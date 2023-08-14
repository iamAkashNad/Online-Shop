const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const db = require("./data/connections/database");

const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const { getINRCurrency } = require("./middlewares/getCurrency.middleware");
const csrf = require("./middlewares/csrf.middleware");
const getCart = require("./middlewares/getCart.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const getUserImage = require("./middlewares/getUserImage.milddleware");
const { expressDefaultErrorHandler, pageNotFound } = require("./middlewares/errorHandler.middlewares");
const clearVerificationData = require("./middlewares/clearVerificationData.middleware");

const helmetConfig = require("./config/helmet.config");
const sessionConfig = require("./config/session.config");
const { morganFormatConfig, morganSuccessConfig, morganErrorConfig } = require("./config/morgan.config");

const app = express();

app.set("view engine", "ejs");

app.use(helmet(helmetConfig()));
app.use(compression());

app.use(morgan(morganFormatConfig, morganSuccessConfig()));
app.use(morgan(morganFormatConfig, morganErrorConfig()));

app.use(session(sessionConfig()));

app.use(getCart);
app.use(authMiddleware);
app.use(getUserImage);

app.use("/public/static/essential/assets", express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(getINRCurrency);

app.use(csrf);

app.use(authRoutes);

app.use(clearVerificationData);
app.use(shopRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.use(pageNotFound);
app.use(expressDefaultErrorHandler);

db.connectToDatabase().then(() => {
    app.listen(process.env.PORT || 3000);
}).catch((error) => {
    console.log("Fail to connect the database!");
});
