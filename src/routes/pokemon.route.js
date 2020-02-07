const express = require("express");
const router = express.Router();

const NewPokemon = require("../models/new-pokemon.model");

const findAll = async () => {
  const foundPokemons = await NewPokemon.find();
  return foundPokemons;
};

/*
router.get("/", async (req, res) => {
  const collection = await findAll();
  res.send(collection);
});
*/
const filterByName = async name => {
  const regex = new RegExp(name, "gi");
  const filteredPokemons = await NewPokemon.find({ name: regex });
  return filteredPokemons;
};

router.get("/", async (req, res) => {
  if (req.query.name) {
    const collection = await filterByName(req.query.name);
    res.send(collection);
  } else {
    const collection = await findAll();
    res.send(collection);
  }
});

module.exports = router;
