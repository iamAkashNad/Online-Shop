const helmetConfig = () => {
  return {
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "https://i.imgur.com", "blob:"],
        "script-src": ["'self'", "https://js.stripe.com/v3/"],
        "form-action": ["'self'", "https://checkout.stripe.com/c/pay/*"],
        "frame-src": ["https://js.stripe.com/v3/"]
      },
    },
  };
};

module.exports = helmetConfig;
