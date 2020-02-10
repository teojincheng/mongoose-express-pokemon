const express = require("express");
const app = express();
app.use(express.json());

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

app.use("/pokemons", pokemonRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode);
  res.send(`Error : ${err}<br>
  Status code : ${err.statusCode} <br>
    Error stack: ${err.stack}`);
});

module.exports = app;
