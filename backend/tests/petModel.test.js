const petModel = require("../models/petModel");
const db = require("../db");

describe("Pet Model Tests", () => {

  test("Should get all pets", async () => {
    const pets = await petModel.getAllPets();
    expect(Array.isArray(pets)).toBe(true);
  });

  test("Should get pet by ID", async () => {
    const pet = await petModel.getPetById(3);
    expect(pet).toBeDefined();
    expect(pet.pet_id).toBe(3);
  });

  afterAll(async () => {
    await db.end();
  });
});
