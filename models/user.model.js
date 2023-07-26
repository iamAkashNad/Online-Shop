const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");

const db = require("../data/connections/database");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(user, image) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.image = image;
    this.address = {
      city: user.city,
      country: user.country,
      streetNumber: user["street-number"],
      milestone: user.milestone,
      postalCode: +user["postal-code"],
    };
  }

  getHashPassword() {
    return bcrypt.hash(this.password, 12);
  }

  findUserByEmail() {
    return db
      .getDb()
      .collection("users")
      .findOne(
        { email: this.email },
        { projection: { password: 1, image: 1, isAdmin: 1 } }
      );
  }

  static findUserById(id) {
    return db
      .getDb()
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0, image: 0 } }
      );
  }

  async update(id) {
    const updatedUser = {
      address: {
        ...this.address,
      },
    };
    if (this.image) {
      updatedUser.image = this.image;
    }
    await db
      .getDb()
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
  }

  async signup() {
    const hashedPassword = await this.getHashPassword();
    const user = {
      name: this.name,
      email: this.email,
      password: hashedPassword,
      image: this.image,
      address: this.address,
    };
    await db.getDb().collection("users").insertOne(user);
  }
  async login() {
    const existingUser = await this.findUserByEmail();
    if (!existingUser) return { isLogedIn: false };
    const ismatched = await bcrypt.compare(
      this.password,
      existingUser.password
    );
    return {
      isLogedIn: ismatched,
      userId: existingUser._id,
      isAdmin: existingUser.isAdmin,
    };
  }
  static async forgotPassword(email, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await db.getDb()
    .collection("users")
    .updateOne({ email }, 
      { $set: { password: hashedPassword } }
    );
  }
}

module.exports = User;
