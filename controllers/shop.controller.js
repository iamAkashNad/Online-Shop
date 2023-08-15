const { v4: getID } = require("uuid");
const bcrypt = require("bcryptjs");

const pdfDocument = require("pdfkit");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const User = require("../models/user.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const { sendEmail } = require("../util/Emails/sendEmails.util");
const { createInvoiceForOrder } = require("../util/createInvoice.util");

const ITEMS_PER_PAGE = 6;

const redirectToMain = (req, res) => {
  res.redirect("/products");
};

const getProducts = async (req, res, next) => {
  let pageNo = +req.query.page || req.session.page || 1;
  
  let products, numberOfProducts;
  try {
    numberOfProducts = await Product.countProducts();
    if(numberOfProducts > 0 && Math.ceil(numberOfProducts / ITEMS_PER_PAGE) < pageNo) {
      req.session.page = Math.ceil(numberOfProducts / ITEMS_PER_PAGE);
      return res.redirect("/");
    } else if(numberOfProducts == 0) pageNo = 1;
    products = await Product.fetchProductsPerPage(pageNo, { title: 1, image: 1, price: 1 }, ITEMS_PER_PAGE);
  } catch (error) {
    return next(error);
  }

  if(req.session.page !== pageNo) req.session.page = pageNo;

  products = products.map(product => {
    product.imagePath = `/public/static/essential/assets/product-images/${product.image}`;
    return product;
  });
  res.render("common/products", { 
    products,
    prevPage: pageNo - 1,
    currPage: pageNo,
    nextPage: pageNo + 1,
    nextPageExists: pageNo * ITEMS_PER_PAGE < numberOfProducts,
    lastPage: Math.ceil(numberOfProducts / ITEMS_PER_PAGE)
  });
};

const getProduct = async (req, res, next) => {
    const productId = req.params.id;
    let product;
    try {
        product = await Product.fetchProductById(productId);
    } catch(error) {
        return next(error);
    }
    if(!product) return res.status(404).render("common/404");
    product.imagePath = `/public/static/essential/assets/product-images/${product.image}`;
    res.render("common/product-detail", { product: product });
};

const addToCart = async (req, res, next) => {
  const cart = res.locals.cart;
  if(cart.totalQuentity == 20) {
    return res.json({ itemLimitExceed: true, totalQuentity: 20 });
  }
  try {
    const product = await Product.fetchProductById(req.body.productId);
    cart.addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
    });
    req.session.cart = cart;
  } catch(error) {
    return next(error);
  }
  res.status(200).json({ totalQuentity: cart.totalQuentity });
};

const getCart = (req, res, next) => {
  res.render("customer/cart");
};

const updateCart = (req, res, next) => {
  const cart = res.locals.cart;
  const quentity = +req.body.newQty;
  if(quentity != 0 && !quentity) return res.json({ notANumber: true });
  if(quentity < 0) return res.json({ negativeQuentity: true });
  const updatedData = cart.updateCart(req.params.id, quentity);
  req.session.cart = cart;
  res.status(203).json({
    totalQuentity: cart.totalQuentity,
    totalPrice: cart.totalPrice,
    ...updatedData
  });
};

const getCheckouts = async (req, res, next) => {
  const { cartItem: productId } = req.query;
  const cart = res.locals.cart;
  let items = [], totalPrice;
  if(productId) {
    const cartItem = cart.items.find(item => item.product._id.toString() === productId);
    if(!cartItem.status) {
      totalPrice = cartItem.totPrice;
      items.push(cartItem);
    }
  } else {
    items = cart.items.filter(item => !item.status);
    totalPrice = cart.totalPrice;
  }
  req.session.order = { items, totalPrice };
  res.render("customer/checkouts", { items, totalPrice });
};

const chargeForTheOrder = async (req, res, next) => {
  const { items } = req.session.order;
  const order_ver_code = getID() + "-" + getID();
  const hashedCode = await bcrypt.hash(order_ver_code, 12);
  req.session.order_ver_code = hashedCode;
  const site = req.protocol + "://" + req.get("host");
  const products = items.map(item => {
    return {
      price_data: {
        unit_amount: item.product.price * 100,
        currency: "inr",
        product_data: {
          name: item.product.title
        },
      },
      quantity: item.totalQty
    }
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: req.session.user.email,
    line_items: products,
    mode: "payment",
    success_url: site + "/order/success?ovc=" + order_ver_code,
    cancel_url: site + "/order/cancel",
  });
  
  res.redirect(303, session.url);
};

const confirmPurchase = async (req, res, next) => {
  const ovc = req.query.ovc;
  const { order_ver_code } = req.session;
  req.session.order_ver_code = null;
  
  if(!ovc || !order_ver_code) return res.status(404).render("common/404");
  const isMatched = await bcrypt.compare(ovc, order_ver_code);
  if(!isMatched) return res.status(404).render("common/404");

  const { items, totalPrice } = req.session.order;
  req.session.order = null;
  const cart = res.locals.cart;

  if(cart.items.length === items.length) {
    req.session.cart = null;
    res.locals.cart = { items: [], totalQuentity: 0, totalPrice: 0 };
  } else {
    const modifiedItems = cart.items.filter(item => {
      if(item.product._id.toString() === items[0].product._id.toString()) {
        cart.totalQuentity -= items[0].totalQty;
        cart.totalPrice -= items[0].totPrice;
      }
      return item.product._id.toString() !== items[0].product._id.toString();
    });
    cart.items = modifiedItems;
    req.session.cart = cart;
    res.locals.cart = cart;
  }

  try {
    const user = await User.findUserById(res.locals.userStatus.userId);
    const order = new Order(items, user, totalPrice);
    await order.save();
  } catch(error) {
    sendEmail("purchase-fail", { email: res.locals.userStatus.email, totalPrice, INR: res.locals.INR })
    .catch(error => {});
    return next(error);
  }

  sendEmail("purchase-ok", { email: res.locals.userStatus.email, order: items, totalPrice, INR: res.locals.INR })
  .catch(error => {});

  res.render("customer/successful-purchase");
};

const getCancelPurchasePage = (req, res, next) => {
  if(!req.session.order_ver_code) return res.status(404).render("common/404");
  req.session.order_ver_code = null;
  res.render("customer/purchase-fail");
};

const getOrders = async (req, res, next) => {
  const userId = res.locals.userStatus.userId;
  let orders;
  try {
    orders = await Order.fetchAll({ "user._id": userId, customer_does_clear: undefined });
  } catch(error) {
    return next(error);
  }
  orders = orders.map(order => {
    order.hrDate = order.date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    return order;
  });
  res.setHeader("Cache-Control", "no-store");
  res.render("customer/orders", { orders: orders });
};

const getInvoiceForOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.fetchById(orderId);
    if(!order) return next();
    if(order.user._id.toString() !== res.locals.userStatus.userId.toString()) return res.status(403).render("common/403");

    order.hrDate = order.date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${orderId}-invoice.pdf`);
    const pdf = new pdfDocument();
    pdf.pipe(res);
    createInvoiceForOrder(pdf, order, res.locals.INR);
  } catch(error) {
    next(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await Order.fetchById(orderId, { "user._id": 1, status: 1 });
    if(!order) return res.status(404).json({ success: false, message: "Order for that ID not found!" });
    if(order.user._id.toString() !== res.locals.userStatus.userId.toString())
      return res.status(401).json({ success: false, message: "You are not authorize to delete this order!" });

    if(order.status !== "Pending") return res.status(202).json({ success: false, message: "Order can't be canceled!" });

    await Order.update(orderId, { status: "Cancel", cancel_initiator: "Customer" });
    res.json({ success: true, message: "Order cancel successfully!" });
  } catch(error) {
    res.status(500).json({});
  }
};

const clearOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const order = await Order.fetchById(orderId);
    if(!order) return res.status(404).json({ success: false, message: "Order for that ID not found!" });
    if(order.user._id.toString() !== res.locals.userStatus.userId.toString())
      return res.status(401).json({ success: false, message: "You are not authorize to clear this order!" });

    if(order.status !== "Cancel" && order.status !== "Delivered") return res.status(202).json({ success: false, message: "Order can't be cleared!" });

    if(order.customer_does_clear) return res.status(202).json({ success: false, message: "Order is already cleared!" });

    if(order.admin_does_clear) {
      order.customer_does_clear = true;
      await Order.shift(order);
    } else {
      await Order.update(orderId, { customer_does_clear: true });
    }

    const orders = await Order.fetchAll({ "user._id": res.locals.userStatus.userId, customer_does_clear: undefined }, { _id: 1 });

    res.json({ success: true, orderCount: orders.length, message: "Order cleared successfully!" });
  } catch(error) {
    res.status(500).json({});
  }
};

const submitFeedbackForDelivary = async (req, res) => {
  const { orderId, feeling, feedback } = req.body;
  let order;
  try {
    order = await Order.fetchById(orderId);
    if(!order) return res.status(404).json({ success: false, message: "The order matched with the id is not found!" });
    if(order.user._id.toString() !== res.locals.userStatus.userId.toString()) return res.status(403).json({ success: false, message: "You are not autherize to access this order!" });
    if(order.status !== "Shipped") return res.status(202).json({ success: false, message: "Feedback can't be taken!" });

    await Order.update(orderId, { status: "Delivered" });
    res.json({
      success: true,
      title: "Thanks for the Feedback!",
      body: "Your feedback helps us to grow as a team and improve our efforts. We are continuously working for improving our workflow and you are helping us by sharing your opinions. It's means alot."
    });
  } catch(error) {
    return res.status(500).json({ success: false, message: "Something went wrong Internally" });
  }

  sendEmail("order-delivered", {
    email: res.locals.userStatus.email,
    order: order.items,
    totalPrice: order.totalPrice,
    INR: res.locals.INR
  }).catch(error => {});
};

module.exports = {
  redirectToMain,
  getProducts,
  getProduct,
  addToCart,
  getCart,
  updateCart,
  getCheckouts,
  chargeForTheOrder,
  confirmPurchase,
  getCancelPurchasePage,
  getOrders,
  getInvoiceForOrder,
  cancelOrder,
  clearOrder,
  submitFeedbackForDelivary
};
