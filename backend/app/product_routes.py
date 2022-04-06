from app import app, db
from app.models import Product, OrderProduct
from flask import request, jsonify, make_response, abort
from flask_login import login_required


@app.route('/product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        data = request.get_json()

        new_product = Product(productId=data['productId'], name=data['name'],image=data['image'],
                              description=data['description'], quantity=data['quantity'],
                              prise=data['prise'])
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'message': 'product was added successfully'})
    elif request.method == 'GET':
        products = Product.query.all()
        result = []

        for product in products:
            product_data = {}
            product_data['productId'] = product.productId
            product_data['name'] = product.name
            product_data['description'] = product.description
            product_data['quantity'] = product.quantity
            product_data['image'] = product.image
            product_data['prise'] = product.prise
            result.append(product_data)

        return jsonify({'products': result})


@app.route("/product/<string:productId>", methods=['GET'])
def get_one_product(productId):
    product = Product.query.filter(
        Product.productId == productId
    ).one_or_none()

    if product is None:
        abort(
            404,
            "Product not found for Id: {productId}".format(
                productId=productId),
        )
    else:
        result = []
        product_data = {}
        product_data['productId'] = product.productId
        product_data['name'] = product.name
        product_data['description'] = product.description
        product_data['quantity'] = product.quantity
        product_data['image'] = product.image
        product_data['prise'] = product.prise
        result.append(product_data)
        return jsonify({'product': result})


@app.route("/product/<string:productId>", methods=['DELETE'])
def delete_product(productId):
    product = Product.query.get_or_404(productId)
    if(product.orders is not None):
        for order in product.orders:
            order_product = OrderProduct.query.get_or_404(order.id)
            db.session.delete(order_product)
    db.session.delete(product)
    db.session.commit()
    return jsonify('product has been deleted!', 'success')


@app.route("/product", methods=['DELETE'])
def delete_all_products():
    products = Product.query.all()
    for product in products:
        for order in product.orders:
            order_product = OrderProduct.query.get_or_404(order.id)
            db.session.delete(order_product)
        db.session.delete(product)
        db.session.commit()
    return jsonify(' products has been deleted!', 'success')
