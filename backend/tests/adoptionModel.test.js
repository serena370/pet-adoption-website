const adoptionModel = require('../models/adoptionModel');
const pool = require('../db');   // IMPORTANT FIX

describe("Adoption Model Tests", () => {

  test("Should create an adoption request", async () => {
    const result = await adoptionModel.createAdoptionRequest(
      3,     // valid pet_id
      3,     // valid adopter_id
      "test",
      "123456",
      "test message"
    );

    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await pool.query("DELETE FROM adoption_requests WHERE fullName = 'test'");
    await pool.end(); // Close DB connection for Jest
  });

});
