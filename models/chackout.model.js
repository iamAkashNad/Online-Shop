const db = require("../data/connections/database");

class Checkout {
  constructor() {}
  static fetchAll(userId) {
    return db
      .getDb()
      .collection("checkouts")
      .find({ "user._id": userId })
      .toArray();
  }
}

module.exports = Checkout;
