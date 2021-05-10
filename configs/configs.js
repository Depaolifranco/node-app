module.exports = {
  application: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT || 3000,
    environment: process.env.APP_ENV,
    logpath: process.env.LOG_PATH,
  },
  mongo: {
    port: process.env.MONGO_PORT,
    host: process.env.MONGO_HOST,
    dbName: process.env.MONGO_DB_NAME,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
};
