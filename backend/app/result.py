from logging import fatal
from .utils import visualization_utils as vis_util
from .utils import label_map_util
from app import app, db
from app.models import Product, Result
from flask import request, jsonify, abort,  Flask
from flask_login import login_required
import os
from werkzeug.utils import secure_filename
import numpy as np
import six.moves.urllib as urllib
import sys
import tensorflow as tf
from collections import defaultdict
from io import StringIO
from PIL import Image
import collections
import cv2
from app.models import Order, OrderProduct
from io import BytesIO
import base64
import requests
import pytesseract
import re
from pytesseract import Output

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

sys.path.append("..")

NUM_CLASSES = 50
def detect():
    data = request.get_json()
    file = data['file']
    # graph = request.files['graph']
    order = Order.query.filter(
        Order.orderId == data['orderId']
    ).one_or_none()
    products = order.products

    # filename = secure_filename(file.filename)
    graphname = secure_filename('/frozen_inference_graph.pb')

    # if graph and allowed_graph(graph.filename):
    #     graph.save(os.path.join(app.config['UPLOAD_FOLDER'], graphname))

    # if graph and allowed_graph(graph.filename)==False:
    #     return  "graph not allowed", 400

    # if file and allowed_file(file.filename):
    #     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    PATH_TO_CKPT = os.path.join('app', graphname)

    PATH_TO_LABELS = os.path.join('app/data', 'labelmap.pbtxt')
   

    # Number of classes the object detector can identify
    # NUM_CLASSES = 6

    # Load the label map.
    # Label maps map indices to category names, so that when our convolution
    # network predicts `5`, we know that this corresponds to `king`.
    # Here we use internal utility functions, but anything that returns a
    # dictionary mapping integers to appropriate string labels would be fine
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    categories = label_map_util.convert_label_map_to_categories(
        label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)

    # Load the Tensorflow model into memory.
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')

        sess = tf.Session(graph=detection_graph)

    # Define input and output tensors (i.e. data) for the object detection classifier

    # Input tensor is the image
    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

    # Output tensors are the detection boxes, scores, and classes
    # Each box represents a part of the image where a particular object was detected
    detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

    # Each score represents level of confidence for each of the objects.
    # The score is shown on the result image, together with the class label.
    detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
    detection_classes = detection_graph.get_tensor_by_name(
        'detection_classes:0')

    # Number of objects detected
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')

    # Load image using OpenCV and
    # expand image dimensions to have shape: [1, None, None, 3]
    # i.e. a single-column array, where each item in the column has the pixel RGB value
    decoded_data = base64.b64decode(file)
    np_data = np.fromstring(decoded_data, np.uint8)
    image = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_expanded = np.expand_dims(image_rgb, axis=0)

    # Perform the actual detection by running the model with the image as input
    (boxes, scores, classes, num) = sess.run(
        [detection_boxes, detection_scores, detection_classes, num_detections],
        feed_dict={image_tensor: image_expanded})

    # Draw the results of the detection (aka 'visulaize the results')

    vis_util.visualize_boxes_and_labels_on_image_array(
        image,
        np.squeeze(boxes),
        np.squeeze(classes).astype(np.int32),
        np.squeeze(scores),
        category_index,
        use_normalized_coordinates=True,
        line_thickness=8,
        min_score_thresh=0.60)

    objects = []
    for index, value in enumerate(classes[0]):
        object_dict = {}
        if scores[0, index] > 0.5:
            object_dict[(category_index.get(value)).get(
                'name')] = scores[0, index]*100
            objects.append(object_dict)

    name = []
    for elms in objects:
        for key in elms.keys():
            name.append(key)
    valid1 = ""
    order_products = []
    state = []
    valid=[]
    insuficient=[]
    more=[]
    notvalid=[]
    notinorder=[]

    for product in products:
        order_products.append(product.productId)
        if product.productId in name:
            if name.count(product.productId) == product.quantity:
                valid1 += " i see %s %s" % (product.productId,
                                            product.quantity)
                state.append(True)
                valid.append({
                    "product": product.productId,
                    "quantity":product.quantity
                })
            elif name.count(product.productId) > product.quantity:
                valid1 += " more quantity in %s we get only %s but we need %s" % (
                    product.productId, name.count(product.productId), product.quantity)
                more.append({
                    "product": product.productId,
                    "order_quantity":product.quantity,
                    "quantity":name.count(product.productId)
                })
                state.append(False)
            elif name.count(product.productId) < product.quantity:
                valid1 += " insufficient quantity of %s we get only %s when we need %s" % (
                    product.productId, name.count(product.productId), product.quantity)
                insuficient.append({
                    "product": product.productId,
                    "order_quantity":product.quantity,
                    "quantity":name.count(product.productId)
                })
                state.append(False)
        else:
            valid1 += " i can't see any %s " % (product.productId)
            notvalid.append({
                    "product": product.productId,
                    "quantity":product.quantity
                })
            state.append(False)
    for obj in name:
        if obj not in order_products:
            valid1 += " no %s im order" % (obj)
            state.append(False)
            notinorder.append({
                    "product": obj,
                })

    im = Image.fromarray(image)
    cv2.imwrite('app/uploads/test.jpg', image)
    img = cv2.imread('app/uploads/test.jpg')
    # im_arr: image in Numpy one-dim array format.
    _, im_arr = cv2.imencode('.jpg', img)
    im_bytes = im_arr.tobytes()
    image64 = base64.b64encode(im_bytes)
    final_state = True
    if False in state:
        final_state = False

    new_result = Result(state=final_state,
                        description=valid1, title=order.orderId,
                        image= image64.decode('ascii'))
    db.session.add(new_result)
    db.session.commit()
    result = {
        'valid': valid,
        'notvalid':notvalid,
        'insuficient':insuficient,
        'more':more,
        'notinorder':notinorder,
        'image': image64.decode('ascii'),
        'state':final_state
    }

    return jsonify(result)

@app.route('/test', methods=["GET"])
def detect_all():
    results=[]
    file = 'file'
    # graph = request.files['graph']
  

    # filename = secure_filename(file.filename)
    graphname = secure_filename('/frozen_inference_graph.pb')

    # if graph and allowed_graph(graph.filename):
    #     graph.save(os.path.join(app.config['UPLOAD_FOLDER'], graphname))

    # if graph and allowed_graph(graph.filename)==False:
    #     return  "graph not allowed", 400

    # if file and allowed_file(file.filename):
    #     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    PATH_TO_CKPT = os.path.join('app', graphname)

    PATH_TO_LABELS = os.path.join('app/data', 'labelmap.pbtxt')
    # Name of the directory containing the object detection module we're using
   
 

    text=''
    for file in os.listdir('app/orders/'):
        if file.endswith('.jpg' or '.JPG' or '.png' or '.PNG'):
            # Path to image
            PATH_TO_IMAGE = os.path.join('app\orders', file)
            # Number of classes the object detector can identify
            NUM_CLASSES = 6
            label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
            categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
            category_index = label_map_util.create_category_index(categories)

            # Load the Tensorflow model into memory.
            detection_graph = tf.Graph()
            with detection_graph.as_default():
                od_graph_def = tf.GraphDef()
                with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
                    serialized_graph = fid.read()
                    od_graph_def.ParseFromString(serialized_graph)
                    tf.import_graph_def(od_graph_def, name='')

                sess = tf.Session(graph=detection_graph)

            # Define input and output tensors (i.e. data) for the object detection classifier

            # Input tensor is the image
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

            # Output tensors are the detection boxes, scores, and classes
            # Each box represents a part of the image where a particular object was detected
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

            # Each score represents level of confidence for each of the objects.
            # The score is shown on the result image, together with the class label.
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')

            # Number of objects detected
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')

            # Load image using OpenCV and
            # expand image dimensions to have shape: [1, None, None, 3]
            # i.e. a single-column array, where each item in the column has the pixel RGB value
            image = cv2.imread(PATH_TO_IMAGE)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image_expanded = np.expand_dims(image_rgb, axis=0)
            
            
            gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

            thr = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            # img = cv2.resize(thr,(0,0),fx=3,fy=3)
            img = cv2.medianBlur(thr,1)


            # th2 = cv2.adaptiveThreshold(noise,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
            #             cv2.THRESH_BINARY,17,6)
            # kernel = np.ones((5,5),np.uint8)
            # closing = cv2.morphologyEx(thr, cv2.MORPH_CLOSE, kernel,iterations=1)

            # erosion = cv2.erode(closing,np.ones((5,5),np.uint8),iterations = 1)
            # img = cv2.resize(image, (720, 480))
            # # custom_config = "-c page_separator=''"
            text= pytesseract.image_to_string(img,lang='eng', config='--oem 3 --psm 6' )
            d = pytesseract.image_to_data(img, output_type=Output.DICT)
            n_boxes = len(d['level'])
            for i in range(n_boxes):
                (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
               
            cv2.imwrite('app/uploads/thr.jpg', img)

            array= text.split()
         
            index= array.index('order')
            orderId= array[index+2]

            order = Order.query.filter(
            Order.orderId ==int(orderId)
            ).one_or_none()
            products = order.products

            # Perform the actual detection by running the model with the image as input
            (boxes, scores, classes, num) = sess.run(
                [detection_boxes, detection_scores, detection_classes, num_detections],
                feed_dict={image_tensor: image_expanded})

            # Draw the results of the detection (aka 'visulaize the results')

            vis_util.visualize_boxes_and_labels_on_image_array(
                image,
                np.squeeze(boxes),
                np.squeeze(classes).astype(np.int32),
                np.squeeze(scores),
                category_index,
                use_normalized_coordinates=True,
                line_thickness=8,
                min_score_thresh=0.60)

            objects = []
            for index, value in enumerate(classes[0]):
                object_dict = {}
                if scores[0, index] > 0.5:
                    object_dict[(category_index.get(value)).get(
                        'name')] = scores[0, index]*100
                    objects.append(object_dict)

            name = []
            for elms in objects:
                for key in elms.keys():
                    name.append(key)
            valid1 = ""
            order_products = []
            state = []
            valid=[]
            insuficient=[]
            more=[]
            notvalid=[]
            notinorder=[]

            for product in products:
                order_products.append(product.productId)
                if product.productId in name:
                    if name.count(product.productId) == product.quantity:
                        valid1 += " i see %s %s" % (product.productId,
                                                    product.quantity)
                        state.append(True)
                        valid.append({
                            "product": product.productId,
                            "quantity":product.quantity
                        })
                    elif name.count(product.productId) > product.quantity:
                        valid1 += " more quantity in %s we get only %s but we need %s" % (
                            product.productId, name.count(product.productId), product.quantity)
                        more.append({
                            "product": product.productId,
                            "order_quantity":product.quantity,
                            "quantity":name.count(product.productId)
                        })
                        state.append(False)
                    elif name.count(product.productId) < product.quantity:
                        valid1 += " insufficient quantity of %s we get only %s when we need %s" % (
                            product.productId, name.count(product.productId), product.quantity)
                        insuficient.append({
                            "product": product.productId,
                            "order_quantity":product.quantity,
                            "quantity":name.count(product.productId)
                        })
                        state.append(False)
                else:
                    valid1 += " i can't see any %s " % (product.productId)
                    notvalid.append({
                            "product": product.productId,
                            "quantity":product.quantity
                        })
                    state.append(False)
            for obj in name:
                if obj not in order_products:
                    state.append(False) 
                    if(notinorder==[]):
                        notinorder.append({
                                        "product": obj,
                                        "quantity":1
                                    })
                    else:
                        for item in notinorder:
                            print(item)
                            print(obj)
                            if (item['product'] == obj):
                                quantity= item['quantity'] + 1     
                                notinorder.remove(item)  
                                notinorder.append({
                                        "product": obj,
                                        "quantity":quantity
                                    })
                            else:
                                notinorder.append({
                                        "product": obj,
                                        "quantity":1
                                    })

            im = Image.fromarray(image)
            cv2.imwrite('app/uploads/test.jpg', image)
            img = cv2.imread('app/uploads/test.jpg')
            # im_arr: image in Numpy one-dim array format.
            _, im_arr = cv2.imencode('.jpg', img)
            im_bytes = im_arr.tobytes()
            image64 = base64.b64encode(im_bytes)
            final_state = True
            if False in state:
                final_state = False
            description=""
            if final_state==True:
                description="The order is fully packed."
            else:
                if len(notvalid) > 0 or len(insuficient) :
                    description += "the order is missing the following items : \n"
                    if len(notvalid) > 0:
                        for item in notvalid:
                            description +="(%s) %s \n" % (item['quantity'], item['product'])
                    if len(insuficient) > 0:
                        for item in insuficient:
                            description +="(%s) %s \n" % (item['quantity'], item['product'])

                if len(notinorder) > 0 or len(more):
                    description += " the following items are not in this order. Please check the order list again:  \n"
                    if len(notinorder) > 0:
                        for item in notinorder:
                            description +="(%s)  %s \n" % (item['quantity'], item['product'])
                    if len(more) > 0:
                        for item in more:
                            description +="(%s) %s \n" % (item['quantity'], item['product'])

            new_result = Result(state=final_state,
                                description=description, title=order.orderId,
                                image= image64.decode('ascii'))            
            db.session.add(new_result)
            db.session.commit()
            # result = {
            #     'valid': valid,
            #     'notvalid':notvalid,
            #     'insuficient':insuficient,
            #     'more':more,
            #     'notinorder':notinorder,
            #     'image': image64.decode('ascii'),
            #     'state':final_state
            # }
            # results.append(result)
detect()
