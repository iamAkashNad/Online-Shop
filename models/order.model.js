const mongodb = require("mongodb");

const db = require("../data/connections/database");

const ObjectId = mongodb.ObjectId;

class Order {
  constructor(items, user, totalPrice) {
    this.items = items;
    this.user = user;
    this.totalPrice = totalPrice;
  }

  static fetchAll(filter, project = {}) {
    return db
      .getDb()
      .collection("orders")
      .find(filter)
      .project(project)
      .toArray();
  }

  static fetchById(id, projection = {}) {
    let orderId
    try {
      orderId = new ObjectId(id);
    } catch(error) {
      return null;
    }
    return db.getDb().collection("orders").findOne({ _id: orderId }, { projection });
  }

  static async deleteById(id) {
    let orderId
    try {
      orderId = new ObjectId(id);
    } catch(error) {
      return null;
    }
    return db.getDb().collection("orders").deleteOne({ _id: orderId });
  }

  async save() {
    const order = {
      items: this.items,
      user: this.user,
      date: new Date(),
      status: "Pending",
      totalPrice: this.totalPrice,
    };
    await db.getDb().collection("orders").insertOne(order);
  }

  static update(id, content) {
    let orderId
    try {
      orderId = new ObjectId(id);
    } catch(error) {
      return null;
    }
    return db.getDb().collection("orders").updateOne({ _id: orderId }, { $set: content });
  }

  static async shift(order) {
    await db.getDb().collection("orders").deleteOne({ _id: order._id });
    await db.getDb().collection("archived-orders").insertOne(order);
  }

  static count() {
    return db.getDb().collection("orders").countDocuments();
  }
}

module.exports = Order;
