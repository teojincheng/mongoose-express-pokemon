const request = require("supertest");
const app = require("../../src/app");
const Pokemon = require("../../src/models/new-pokemon.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("pokemons", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    await Pokemon.create(pokemonData);
  });

  afterEach(async () => {
    await Pokemon.deleteMany();
  });

  it("GET should respond with all pokemons", async () => {
    const expectedPokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];

    const { body: actualPokemons } = await request(app)
      .get("/pokemons")
      .expect(200);
    actualPokemons.sort((a, b) => a.id > b.id);
    expect(actualPokemons).toMatchObject(expectedPokemonData);
  });

  it("GET /pokemons?name should respond with pokemon with that name", async () => {
    const expectedPokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      }
    ];

    const { body: actualPokemons } = await request(app)
      .get("/pokemons?name=pi")
      .expect(200);
    actualPokemons.sort((a, b) => a.id > b.id);
    expect(actualPokemons).toMatchObject(expectedPokemonData);
  });

  it("POST /pokemons should add a new pokemon and respond with new pokemon", async () => {
    const expectedPokemonData = [
      {
        id: 9,
        name: "Raichu",
        japaneseName: "ピカチュウ",
        baseHP: 50,
        category: "Mouse Pokemon"
      }
    ];

    const pokemon = {
      id: 9,
      name: "Raichu",
      japaneseName: "ピカチュウ",
      baseHP: 50,
      category: "Mouse Pokemon"
    };
    const { body: actualPokemons } = await request(app)
      .post("/pokemons")
      .expect(201)
      .send(pokemon);

    expect(actualPokemons).toMatchObject(expectedPokemonData[0]);
  });

  it("GET /pokemons/:id should return one specific pokemon", async () => {
    const expectedPokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    const { body: actualPokemons } = await request(app)
      .get("/pokemons/1")
      .expect(200);
    expect(actualPokemons[0]).toMatchObject(expectedPokemonData[0]);
  });
});
