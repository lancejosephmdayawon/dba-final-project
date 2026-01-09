// scripts/createUser.js

import dotenv from "dotenv";
dotenv.config({ path: './.env.local' });

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Updated createUser function
async function createUser(username, lastName, firstName, middleName, email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const sql = `
      INSERT INTO users (username, last_name, first_name, middle_name, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [username, lastName, firstName, middleName, email, hashedPassword]);
    console.log(`✅ User created: ID=${result.insertId}, username=${username}`);
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
  }
}

// Example users with full names
const sampleUsers = [
  { username: "lance", last_name: "Dayawon", first_name: "Lance Joseph", middle_name: "M.", email: "lancejosephmanalangdayawon3@gmail.com", password: "12345678" },
  { username: "kyle", last_name: "Dayawon", first_name: "Kyle Adam", middle_name: "M.", email: "kyledayawon@gmail.com", password: "kyle1234" },
  { username: "rin", last_name: "Bofill", first_name: "Angeline", middle_name: "M.", email: "rinbofill@email.com", password: "rin1234" },
];

async function run() {
  for (const user of sampleUsers) {
    await createUser(user.username, user.last_name, user.first_name, user.middle_name, user.email, user.password);
  }
  await db.end(); // close the pool
  console.log("🎉 All users created!");
  process.exit(0);
}

run();
