const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const MongoStore = mongodbStore(session);

const getMongoStore = () => {
    return new MongoStore({
        uri: process.env.MONGO_DB_SERVER,
        databaseName: process.env.APP_DB,
        collection: "sessions",
    });
}

const sessionConfig = () => {
    return {
        secret: process.env.SESSION_SECRET,
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
