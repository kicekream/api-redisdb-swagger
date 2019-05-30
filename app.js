//Redis DataBase
const express = require("express");
const redis = require("redis");
const path = require('path');
const dotenv = require('dotenv');
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs')
const swaggerDocument = YAML.load(path.join(process.cwd(), './swagger.yaml'))
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080

//Initialise Redis Database
const redisClient = redis.createClient();
redisClient.on("connect", () => console.log("Redis dataBase started"));

const user = require('./routes/user')(redisClient);

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/user', user)

app.get('/', (req, res) => {
    res.redirect('/docs');
})

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
