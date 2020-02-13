const request = require("supertest");
const app = require("../../src/app");
const Trainer = require("../../src/models/trainer.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("trainers", () => {
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
    const trainerData = [
      {
        username: "gary",
        password: "gary1234"
      },
      {
        username: "ash",
        password: "ash123456"
      }
    ];
    await Trainer.create(trainerData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Trainer.deleteMany();
  });
  describe("/", () => {
    it("POST should add a new trainer", async () => {
      const { body: trainer } = await request(app)
        .post("/trainers")
        .send({
          username: "misty",
          password: "misty1234"
        })
        .expect(201);
      expect(trainer.username).toBe("misty");
      expect(trainer.password).not.toBe("misty1234");
    });
  });

  describe("/trainers/:username", () => {
    it("GET should respond with trainer details when correct username is supplied", async () => {
      const expectedTrainer = {
        username: "gary"
      };
      jwt.verify.mockReturnValueOnce({ name: expectedTrainer.username });
      const { body: actualTrainer } = await request(app)
        .get(`/trainers/${expectedTrainer.username}`)
        .set("Cookie", "token=valid-token")
        .expect(200);

      expect(actualTrainer[0]).toMatchObject(expectedTrainer);
    });

    /*
    it("GET should respond with incorrect trainer message when login as incorrect trainer", async () => {
      const wrongTrainer = {
        username: "ash"
      };
      jwt.verify.mockReturnValueOnce({ name: wrongTrainer.username });
      const { body: error } = await request(app)
        .get("/trainers/gary")
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(error).toEqual({ error: "incorrect trainer" });
    });
    */
  });

  describe("/trainers/login", () => {
    /*
    it("should login when password is correct", async () => {
      const correctTrainer = {
        username: "gary",
        password: "gary1234"
      };

      const { body: message } = await request(app)
        .post("/trainers/login")
        .send(correctTrainer)
        .expect(200);

      expect(message).toEqual("You are now logged in!");
    });
    */
    /*
    it("GET should deny access when no token is provided ", async () => {
      const { body: error } = await request(app)
        .get(`/trainers/gary`)
        .expect(401);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(error).toEqual({ error: "You are not authorized" });
    });
    */
    /*
    it("GET should deny access when token is invalid", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error();
      });

      const { body: error } = await request(app)
        .get("trainers/gary")
        .set("Cookie", "token=wrong-token")
        .expect(401);
    });
    */
  });
});

/*

    it("GET should deny access when token is invalid", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error();
      });

      const { body: error } = await request(app)
        .get(`trainers/apple`)
        .set("Cookie", "token=wrong-token")
        .expect(401);
    });
    */
