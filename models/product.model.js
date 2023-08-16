const mongodb = require("mongodb");

const db = require("../data/connections/database");

const ObjectId = mongodb.ObjectId;

class Product {
  constructor(product, image) {
    this.title = product.title;
    this.summary = product.summary;
    this.price = +product.price;
    this.description = product.description;
    this.image = image;
  }

  static countProducts() {
    return db.getDb().collection("products").countDocuments();
  }

  static fetchProductsPerPage(page, items, projection = {}, limit) {
    return db
      .getDb()
      .collection("products")
      .find()
      .skip((page - 1) * items)
      .limit(limit || items)
      .project(projection)
      .toArray();
  }

  static fetchAll(projection) {
    return db
      .getDb()
      .collection("products")
      .find()
      .project(projection)
      .toArray();
  }

  static fetchProductById(id, projection = {}) {
    let prodId;
    try {
      prodId = new ObjectId(id);
    } catch(error) {
      return null;
    }
    return db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId }, { projection });
  }

  async save(id) {
    const product = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
    };
    if (this.image) {
      product.image = this.image;
    }

    if (id) {
      await db
        .getDb()
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: product });
      return;
    }
    await db.getDb().collection("products").insertOne(product);
  }

  static async delete(id) {
    if(!id) throw new Error("Id undefined!");
    db.getDb().collection("products").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Product;
