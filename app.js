const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const db = require("./data/connections/database");

const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const csrf = require("./middlewares/csrf.middleware");
const getCart = require("./middlewares/getCart.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const getUserImage = require("./middlewares/getUserImage.milddleware");
const errorHandler = require("./middlewares/errorHandler.middlewares");
const clearVerificationData = require("./middlewares/clearVerificationData.middleware");

const sessionConfig = require("./config/session.config");


const app = express();

app.set("view engine", "ejs");

app.use(session(sessionConfig()));

app.use(getCart);
app.use(authMiddleware);
app.use(getUserImage);

app.use("/public/static/essential/assets", express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    const INR = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    res.locals.INR = INR;
    next();
});

app.use(csrf);

app.use(authRoutes);

app.use(clearVerificationData);
app.use(shopRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler.pageNotFound);
app.use(errorHandler.expressDefaultErrorHandler);

db.connectToDatabase().then(() => {
    app.listen(3000);
}).catch((error) => {
    console.log("Fail to connect the database!");
});
