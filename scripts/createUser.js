// scripts/createUser.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create user function (supports admin & patient)
async function createUser(
  username,
  lastName,
  firstName,
  middleName,
  email,
  plainPassword,
  role
) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const sql = `
      INSERT INTO users (
        username,
        last_name,
        first_name,
        middle_name,
        email,
        password,
        role,
        email_verified,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;

    const [result] = await db.execute(sql, [
      username,
      lastName,
      firstName,
      middleName,
      email,
      hashedPassword,
      role,
    ]);

    console.log(
      `✅ User created: ID=${result.insertId}, username=${username}, role=${role}`
    );
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
  }
}

// Users (ADMIN + PATIENTS)
const sampleUsers = [
  {
    username: "admin",
    last_name: "Administrator",
    first_name: "System",
    middle_name: null,
    email: "admin@lumident.com",
    password: "admin123",
    role: "admin",
  },
];

async function run() {
  for (const user of sampleUsers) {
    await createUser(
      user.username,
      user.last_name,
      user.first_name,
      user.middle_name,
      user.email,
      user.password,
      user.role
    );
  }

  await db.end();
  console.log("🎉 All users created!");
  process.exit(0);
}

run();
