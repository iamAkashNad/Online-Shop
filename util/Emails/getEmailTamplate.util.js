const getEmailTamplate = (purpose, data) => {
  return `
    <section style="padding: 0.5rem 0.6rem; border: 1px solid rgb(300, 320, 210); background-color: rgb(200, 320, 310); border-radius: 5px;">
      ${getHeader()}
      ${getEmailMainBody(purpose, data)}
      ${getFooter()}
    </section>
  `;
};

const getHeader = () => {
  return `
  <section style="margin-bottom: 3rem;">
    <p style="text-align: center; margin-bottom: 0.2rem;"><img style="width: 8rem;" src="https://i.imgur.com/4iWiOVs.png" alt="wCart"></p>
  </section>
  `;
};

const getFooter = () => {
  return `
    <section style="margin-top: 2rem;">
      <p style="text-align: center; margin-bottom: 0.2rem;">wCart</p>
      <p style="text-align: center; margin-top: 0.2rem;">(c) All copyrights reserved.</p>
    </section>
  `;
};

const getOrders = (orders, INR) => {
  let order_list = `<hr/>`;
  for(let order of orders) {
    order_list += `<li>${ order.product.title } ---- ${order.totalQty} x ${INR.format(order.product.price)}</li><hr/>`;
  }
  return order_list;
};

const getEmailMainBody = (purpose, data) => {
    if(purpose === "signup-ok") {
        return `
        <section>
          <h3>Welcome ${data.name}</h3>
          <p>We are gled to inform that you are successfully created an account with us.</p>
          <p><em>Happy Shopping!</em></p>
        </section>
      `;
    } if(purpose === "signup-verify") {
        return `
        <section>
          <h3>Hello ${data.name}</h3>
          <p>This is your verification code for creating account!</p>
          <h4 style="text-align: center; padding: 0.3rem 0.6rem; border: 1px solid rgb(0, 0, 0); border-radius: 3px;">${data.code}</h4>
        </section>
        `;
    } if(purpose === "forgot-pass") {
        return `
        <section>
            <h3>OTP: Keep it secret!</h3>
            <p>This is your One-Time-Password for reseting your password!</p>
            <h4 style="text-align: center; padding: 0.3rem 0.6rem; border: 1px solid rgb(0, 0, 0); border-radius: 3px;">${data.code}</h4>
        </section>
        `;
    } if(purpose === "forgot-pass-ok") {
      return `
      <section>
          <h3>Congo! You successfully set new password.</h3>
          <p>Now, make sure that you don't forget the password. And make a note for that password & make it secret!</p>
          <p><em>Happy Shopping!</em></p>
      </section>
      `;
    } if(purpose === "purchase-ok") {
      return `
      <section>
          <h3>Congo! Your purchase is being successful</h3>
          <ul style="list-style: none; padding: 0;">${getOrders(data.order, data.INR)}</ul>
          <p>Total Price: ${data.INR.format(data.totalPrice)}</p>
          <p>Now, We are trying our best to make your order shipped as soon as possible.</p>
          <p><em>Happy Shopping!</em></p>
      </section>
      `;
    } if(purpose === "purchase-fail") {
      return `
      <section>
          <h3>We unable to process your order</h3>
          <p>We are sorry to say that because of some internal problem we are unable to proceed with your order. But don't take stress about your payed money. We are working on refund your payment ${data.INR.format(data.totalPrice)}</p>
          <p><em>Happy Shopping!</em></p>
      </section>
      `;
    } if(purpose === "order-shipped") {
      return `
      <section>
          <h3>Hurayyy...Order shipped!</h3>
          <ul style="list-style: none; padding: 0;">${getOrders(data.order, data.INR)}</ul>
          <p>Total Price: ${data.INR.format(data.totalPrice)}</p>
          <p>Your order is successfully shipped from our base and we hope it will reach to your door bell as soon as possible.</p>
          <p style="font-weight: bold;">Note: When the order is successfully reach to you than please share your feedback regarding to the delivary process and the order. By that we can understand that you get your order.</p>
          <p><em>Happy Shopping!</em></p>
      </section>
      `;
    } if(purpose === "order-cancel") {
      return `
      <section>
          <h3>Your order is canceled...😣</h3>
          <ul style="list-style: none; padding: 0;">${getOrders(data.order, data.INR)}</ul>
          <p>Total Price: ${data.INR.format(data.totalPrice)}</p>
          <p>We are very sorry to inform you that due to some unignorable problem, we have to cancel your order from our side. Your paid money will be refund to you very soon. Hope we are able to complete your next order.</p>
          <p><em>Happy Shopping!</em></p>
      </section>
      `;
    } if(purpose === "order-delivered") {
      return `
      <section>
          <h3>Your order is Delivered...🤩</h3>
          <ul style="list-style: none; padding: 0;">${getOrders(data.order, data.INR)}</ul>
          <p>Total Price: ${data.INR.format(data.totalPrice)}</p>
          <p>We are glad to hear that your order is reached to your place.</p>
          <p>And thanks for giving your valuable feedback. Your feedback helps us to grow as a team and improve our efforts. We are continuously working for improving our workflow and you are helping us by sharing your opinions. It's means alot.</p>
          <p><em>Happy Shopping🛍️</em></p>
      </section>
      `;
    }
};

module.exports = getEmailTamplate;
