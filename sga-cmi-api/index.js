const { dbConnection } = require("./database/config");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);

// MIDLEWARES

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use("/api/login", require("./routes/auth"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/email", require("./routes/sendEmailRoutes"));
app.use("/api/sedes", require("./routes/sedes"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/modulos", require("./routes/modulos"));

// 📌 Rutas
app.use("/api", require("./routes/report"));
app.use("/api", require("./routes/proceso"));
app.use("/api", require("./routes/solicitud"));

app.listen(process.env.PORT, () => {
  console.log(
    "Server is running on port http://localhost:" + process.env.PORT + "/api"
  );
});
