const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  credentials: true,
  allowedHeaders: "content-type",
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

const listOfRoutes = {
  "0": "GET    /",
  "1": "GET   /pokemons",
  "2": "GET   /pokemons?name=pokemonNameNotExact",
  "3": "POST    /pokemons",
  "4": "GET /pokemons/:id",
  "5": "PUT /pokemons/:id",
  "6": "PATCH /pokemons/:id",
  "7": "DELETE /pokemons/:id"
};

app.get("/", (req, res) => {
  res.send(listOfRoutes);
});

const pokemonRouter = require("./routes/pokemon.route");
const trainerRouter = require("./routes/trainer.route");

app.use("/pokemons", pokemonRouter);
app.use("/trainers", trainerRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
