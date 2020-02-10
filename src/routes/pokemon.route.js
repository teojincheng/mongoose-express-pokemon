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

const findPokemon = async id => {
  const result = await NewPokemon.find({ id: id });
  return result;
};

const findAndReplace = async (id, pokemon) => {
  const result = await NewPokemon.findOneAndReplace({ id: id }, pokemon);
  return pokemon;
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

router.get("/:id", async (req, res) => {
  const pokemon = await findPokemon(parseInt(req.params.id));
  res.send(pokemon);
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

router.put("/:id", async (req, res) => {
  const newPokemon = await findAndReplace(parseInt(req.params.id), req.body);
  res.send(newokemon);
});

module.exports = router;
