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

app.use("/pokemon", pokemonRouter);

module.exports = app;
