const mongodb = require("mongodb");

let database;

const connectToDatabase = async () => {
  const connections = await mongodb.MongoClient.connect(
    process.env.MONGO_DB_SERVER
  );
  database = connections.db(process.env.APP_DB);
};

const getDb = () => {
  if (!database) {
    return new Error("Database connection isn't established!");
  }
  return database;
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
