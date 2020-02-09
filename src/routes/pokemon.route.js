const express = require("express");
const router = express.Router();

const NewPokemon = require("../models/new-pokemon.model");

const findAll = async () => {
  const foundPokemons = await NewPokemon.find();
  return foundPokemons;
};

const filterByName = async name => {
  const regex = new RegExp(name, "gi");
  const filteredPokemons = await NewPokemon.find({ name: regex });
  return filteredPokemons;
};

const createPokemon = async pokemon => {
  try {
    const doc = NewPokemon(pokemon);
    await doc.save();
  } catch (err) {
    console.log(err);
  }
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

router.post("/", async (req, res) => {
  const pokemon = {};
  pokemon.id = req.body.id;
  if (req.body.name) {
    pokemon.name = req.body.name;
  }
  await createPokemon(pokemon);
  res.send(pokemon);
});

module.exports = router;
