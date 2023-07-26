const Cart = require("../models/cart.model");

const getCart = (req, res, next) => {
    const cart = req.session.cart;
    if(!cart) {
        res.locals.cart = new Cart();
    } else {
        res.locals.cart = new Cart(cart.items, cart.totalQuentity, cart.totalPrice);
    }
    next();
};

module.exports = getCart;
