// scripts/createUser.js

// 1️⃣ Load environment variables first
import dotenv from "dotenv";
dotenv.config({ path: './.env.local' });

// 2️⃣ Import dependencies
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// 3️⃣ Create a MySQL pool directly in this script
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 4️⃣ Function to create a user with hashed password
async function createUser(username, email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [username, email, hashedPassword]);
    console.log(`✅ User created: ID=${result.insertId}, username=${username}`);
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
  }
}

// 5️⃣ Example: create multiple sample users
const sampleUsers = [
  { username: "lance", email: "lance@email.com", password: "mypassword123" },
  { username: "alice", email: "alice@email.com", password: "alice1234" },
  { username: "bob", email: "bob@email.com", password: "bobpassword" },
];

async function run() {
  for (const user of sampleUsers) {
    await createUser(user.username, user.email, user.password);
  }
  await db.end(); // close the pool
  console.log("🎉 All users created!");
  process.exit(0);
}

run();
