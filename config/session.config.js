const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const MongoStore = mongodbStore(session);

const getMongoStore = () => {
    return new MongoStore({
        uri: "mongodb://127.0.0.1:27017",
        databaseName: "online-shop-2",
        collection: "sessions",
    });
}

const sessionConfig = () => {
    return {
        secret: "Aka03112001",
        resave: false,
        saveUninitialized: false,
        store: getMongoStore(),
        name: "wcart-cookie",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 10,
            sameSite: "lax",
        }
    };
}

module.exports = sessionConfig;
