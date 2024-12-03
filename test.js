require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database successfully!");
    return client.end();
  })
  .catch((err) => {
    console.error("Connection to the database failed!", err);
  });
