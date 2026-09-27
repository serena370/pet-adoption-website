const bcrypt = require("bcrypt");
const pool = require("../db");
const userModel = require("../models/userModel");

const EXISTING_USER_EMAIL = "adopter@example.com";
const EXISTING_USER_PASSWORD = "adopter"; 

describe("User Model Tests", () => {

  test("Should fetch user by email", async () => {
    const user = await userModel.getUserByEmail(EXISTING_USER_EMAIL);

    expect(user).toBeDefined();
    expect(user.email).toBe(EXISTING_USER_EMAIL);
    expect(user).toHaveProperty("password"); 
  });

  test("Should validate correct password", async () => {
    const user = await userModel.getUserByEmail(EXISTING_USER_EMAIL);
    const isMatch = await bcrypt.compare(EXISTING_USER_PASSWORD, user.password);

    expect(isMatch).toBe(true);
  });

  test("Should fail password comparison with wrong password", async () => {
    const user = await userModel.getUserByEmail(EXISTING_USER_EMAIL);
    const isMatch = await bcrypt.compare("WRONG_PASSWORD", user.password);

    expect(isMatch).toBe(false);
  });

  afterAll(async () => {
    await pool.end();
  });
});
