const modifyCart = async (req, res, next) => {
    try {
        await res.locals.cart.modifyCart();
      } catch(error) {
        return next(error);
      }
      next();
};

module.exports = modifyCart;
