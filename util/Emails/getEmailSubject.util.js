const getEmailSubject = (purpose, data) => {
    if(purpose === "signup-ok") return `Congo ${data.name}, Your Signup is Successfull`;
    if(purpose === "signup-verify") return `Email verification`;
    if(purpose === "forgot-pass") return `Your code for forgot your password!`;
    if(purpose === "forgot-pass-ok") return `[SUCCESS] Password Set!`;
    if(purpose === "purchase-ok") return `[SUCCESS] Your Order is placed successfully`;
    if(purpose === "purchase-fail") return `[ISSUE] We enable to process your order`;
    if(purpose === "order-shipped") return `[SUCCESS] Your order is shipped🤩`;
    if(purpose === "order-cancel") return `Order Canceled😖`;
    if(purpose === "order-delivered") return `[SUCCESS]Order Delivered😍`;
};

module.exports = getEmailSubject;
