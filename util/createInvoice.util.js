exports.createInvoiceForOrder = (pdf, order, INR) => {
    pdf.info.Title = `${order.user.name}'s Invoice`;
    pdf.info.Author = "wCart.com";
    pdf.info.Subject = `This is an invoice for the #${order._id.toString()} order.`;

    pdf.fontSize(30).text("INVOICE", 50, 45);
    pdf.underline(20, 70, 570, 10);

    pdf.fontSize(12).text(`Order Status: ${order.status.toUpperCase()}`, 370, 105);

    pdf.fontSize(14).text("Billed To:", 50, 95)
    pdf.fontSize(12).text(`Name: ${order.user.name}`, 50, 115);
    pdf.fontSize(12).text(`Email: ${order.user.email}`, 50, 132);
    pdf.fontSize(12).text(`Address: ${order.user.address.city + ", " + order.user.address.country + " (" + order.user.address.postalCode + ")"}`, 50, 149);
    pdf.fontSize(12).text(`Order Date: ${order.hrDate}`, 50, 166);

    pdf.underline(20, 180, 570, 10);
    
    pdf.fill("#005252", "even-odd");
    pdf.fontSize(12).text("Product", 30, 230);
    pdf.fontSize(12).text("Quentity", 220, 230);
    pdf.fontSize(12).text("Price (per unit) in rupee", 380, 230);
    pdf.underline(20, 240, 570, 10);
    
    pdf.fill("black", "even-odd");
    const col1 = 30, col2 = 230, col3 = 385;
    let y = 260;
    order.items.map(item => {
      pdf.fontSize(12).text(item.product.title, col1, y);
      pdf.fontSize(12).text(item.totalQty, col2, y);
      pdf.fontSize(12).text(INR.format(item.totPrice).substring(1) + "(" + INR.format(item.product.price).substring(1) + ")", col3, y);
      pdf.underline(20, y + 10, 570, 10);
      y += 30;
      return item;
    });

    pdf.underline(col3 - 105, y, 295, 10);
    pdf.fontSize(12).text(`TOTAL AMOUNT: ${INR.format(order.totalPrice).substring(1)} /-`, col3 - 98, y + 20);
    pdf.underline(col3 - 105, y + 30, 295, 10);
    pdf.moveTo(col3 - 105, y + 9).lineTo(col3 - 105, y + 39).fill("black");

    y += 80;
    let message = "You can visit our website www.wcart.com for tracking your order's status or";
    if(order.status === "Delivered") {
      message = "Hope you like our service and the order(s) which is delivered. If there is any defect in ordered product you can return/replace the product by going to the 'checkout' page of our website, then we try process your request as soon as possible.";
    }
    message += " if you have any query regarding your order you can reach to us via support@wcart.com.";
    pdf.fontSize(12).text(message, 50, y);
    pdf.end();
};
