from app import app, db
from app.models import Order, OrderProduct, Product,Result
from flask import request, jsonify, make_response, abort
from flask_login import login_required


@app.route('/order', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        data = request.get_json()
        prise = 0.0

        for product in data['products']:
            prod = Product.query.filter(
                Product.productId == product['productId']
            ).one_or_none()
            prise += prod.prise

        new_order = Order(prise=prise)
        db.session.add(new_order)
        db.session.commit()
        if 'products' in data:
            for product in data['products']:
                new_order_product = OrderProduct(
                    orderId=new_order.orderId, productId=product['productId'], quantity=product['quantity'])
                db.session.add(new_order_product)
                db.session.commit()
        return jsonify({'message': 'product was added successfully'})
    elif request.method == 'GET':
        orders = Order.query.all()
        result = []
        

        for order in orders:
            res= Result.query.filter(
                    Result.resultId == order.result_id
                ).one_or_none()
            products = []
            for product in order.products:
                product_data = {}
                product_data['productId'] = product.productId
                product_data['quantity'] = product.quantity
                products.append(product_data)
            order_data = {}
            order_data['orderId'] = order.orderId
            order_data['date'] = order.date
            order_data['prise'] = order.prise
            order_data['products'] = products
            order_data['state'] = None if res is None else res.state
            result.append(order_data)

        return jsonify({'orders': result})


@app.route("/order/<int:orderId>", methods=['GET'])
def getOneOrders(orderId):
    order = Order.query.filter(
        Order.orderId == orderId
    ).one_or_none()

    if orderId is None:
        abort(
            404,
            "Order not found for Id: {orderId}".format(
                orderId=orderId),
        )
    else:
        result = []
        products = []
        for product in order.products:
            product_data = {}
            product_data['productId'] = product.productId
            product_data['quantity'] = product.quantity
            products.append(product_data)
        order_data = {}
        order_data['orderId'] = order.orderId
        order_data['prise'] = order.prise
        order_data['date'] = order.date
        order_data['products'] = products
        result.append(order_data)
        return jsonify({'order': result})


@app.route("/order/<int:orderId>", methods=['DELETE'])
def delete_order(orderId):
    order = Order.query.get_or_404(orderId)
    for product in order.products:
        order_product = OrderProduct.query.get_or_404(product.id)
        db.session.delete(order_product)
    db.session.delete(order)
    db.session.commit()
    return jsonify('Your order has been deleted!', 'success')


@app.route("/order", methods=['DELETE'])
def delete_all_orders():
    orders = Order.query.all()
    for order in orders:
        for product in order.products:
            order_product = OrderProduct.query.get_or_404(product.id)
            db.session.delete(order_product)
        db.session.delete(order)
        db.session.commit()
    return jsonify('Your order has been deleted!', 'success')
