//Redis DataBase
const express = require("express");
const redis = require("redis");
const path = require("path");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const nconf = require("nconf");
const swaggerDocument = YAML.load(path.join(process.cwd(), "./swagger.yaml"));
dotenv.config();
const app = express();

nconf
  .argv()
  .env()
  .file("keys.json");
const PORT = process.env.PORT || 8080;

//Initialise Redis Database
const redisClient = redis.createClient(
  nconf.get("redisPort") || "6379",
  nconf.get("redisHost") || "127.0.0.1",
  {
    auth_pass: nconf.get("redisKey"),
    return_buffers: true
  }
);
redisClient.on("connect", () => console.log("Redis dataBase started"));

const user = require("./routes/user")(redisClient);

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/user", user);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
