const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newPokemonSchema = Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  japaneseName: String,
  baseHP: Number,
  category: String
});

const NewPokemon = mongoose.model("NewPokemon", newPokemonSchema);

module.exports = NewPokemon;
