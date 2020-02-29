const request = require("supertest");
const app = require("../../src/app");
const Pokemon = require("../../src/models/new-pokemon.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

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
    jest.resetAllMocks();
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
    jwt.verify.mockReturnValueOnce({});
    const { body: actualPokemons } = await request(app)
      .post("/pokemons")
      .set("cookie", "token=valid-token")
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
    const pokemonId = 1;
    const { body: actualPokemons } = await request(app)
      .get(`/pokemons/${pokemonId}`)
      .expect(200);
    expect(actualPokemons[0]).toMatchObject(expectedPokemonData[0]);
  });

  it("PUT /pokemons/:id should replace pokemon and return new pokemon", async () => {
    const expectedPokemon = {
      id: 1,
      name: "Gastly",
      japaneseName: "ピカチュウ",
      baseHP: 70,
      category: "Ghost Pokemon"
    };

    const pokemonId = 1;
    const { body: actualPokemons } = await request(app)
      .put(`/pokemons/${pokemonId}`)
      .expect(200)
      .send(expectedPokemon);

    expect(actualPokemons).toMatchObject(expectedPokemon);
  });

  it("PATCH /pokemons/:id should update some properties of the pokemon and respond with new pokemon", async () => {
    const pokemon = {
      baseHP: 20
    };

    const expectedPokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 20,
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
      .patch(`/pokemons/${expectedPokemonData[0].id}`)
      .expect(200)
      .send(pokemon);

    expect(actualPokemons).toMatchObject(expectedPokemonData[0]);
  });

  it("DELETE /pokemons/id should remove the pokemon and return the deleted pokemon", async () => {
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

    const pokemonId = 1;
    const { body: actualPokemons } = await request(app)
      .delete(`/pokemons/${pokemonId}`)
      .expect(200);

    expect(actualPokemons).toMatchObject(expectedPokemonData[0]);
  });

  it("POST /pokemons throw error when not sending a proper pokemon object ", async () => {
    const badData = { baseHP: 90 };
    jwt.verify.mockReturnValueOnce({});
    const { body: actualPokemons } = await request(app)
      .post("/pokemons")
      .set("cookie", "token=valid-token")
      .expect(400);
  });
});
