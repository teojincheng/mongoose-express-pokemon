const express = require("express");
const router = express.Router();

const NewPokemon = require("../models/new-pokemon.model");
const { protectRoute } = require("../middlewares/auth");

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
  await NewPokemon.init();
  const doc = NewPokemon(pokemon);
  await doc.save();
};

const findPokemon = async id => {
  const result = await NewPokemon.find({ id: id });
  return result;
};

const replacePokemon = async (id, pokemon) => {
  const result = await NewPokemon.findOneAndReplace({ id }, pokemon, {
    new: true
  });
  return result;
};

const updatePokemon = async (id, pokemon) => {
  const result = await NewPokemon.findOneAndUpdate({ id }, pokemon, {
    new: true
  });
  return result;
};

const deletePokemon = async id => {
  const result = await NewPokemon.findOneAndRemove({ id: id });
  return result;
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

router.post("/", protectRoute, async (req, res, next) => {
  try {
    await createPokemon(req.body);
    res.status(201).send(req.body);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.put("/:id", async (req, res) => {
  const newPokemon = await replacePokemon(parseInt(req.params.id), req.body);
  res.send(newPokemon);
});

router.patch("/:id", async (req, res) => {
  const newPokemon = await updatePokemon(parseInt(req.params.id), req.body);
  res.send(newPokemon);
});

router.delete("/:id", async (req, res) => {
  const result = await deletePokemon(parseInt(req.params.id));
  res.send(result);
});

module.exports = router;
