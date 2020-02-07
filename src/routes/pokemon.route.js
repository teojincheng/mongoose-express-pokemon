const express = require("express");
const router = express.Router();

const NewPokemon = require("../models/new-pokemon.model");

const findAll = async () => {
  const foundPokemons = await NewPokemon.find();
  return foundPokemons;
};

router.get("/", (req, res) => {
  const findAll = async () => {
    const foundPokemons = await NewPokemon.find();
    return foundPokemons;
  };

  findAll().then(value => res.status(200).send(value));

  //res.status(200).send(data);
});

module.exports = router;
