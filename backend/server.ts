import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "./db/client";
import { students, users } from "./drizzle/schema";

// --------------------------------------------------
// Config
// --------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const PORT = 3000;

// --------------------------------------------------
// App setup
// --------------------------------------------------
const app = express();

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function getAuthPayload(req: any) {
  const auth = req.headers.authorization;
  if (!auth) throw new Error("Unauthorized");

  const token = auth.split(" ")[1];
  return jwt.verify(token, JWT_SECRET) as {
    userId: number;
    schoolId: number;
    role: string;
    name: string;
  };
}

// --------------------------------------------------
// Health check
// --------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --------------------------------------------------
// AUTH
// --------------------------------------------------
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      schoolId: user.schoolId,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// --------------------------------------------------
// STUDENTS (MULTI-SCHOOL SAFE)
// --------------------------------------------------
app.get("/students", async (req, res) => {
  try {
    const { schoolId } = getAuthPayload(req);

    const data = await db
      .select()
      .from(students)
      .where(eq(students.schoolId, schoolId));

    res.json(data);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { schoolId } = getAuthPayload(req);
    const { admissionNo, name, dob, parentName, phone } = req.body;

    if (!admissionNo || !name) {
      return res
        .status(400)
        .json({ error: "admissionNo and name are required" });
    }

    await db.insert(students).values({
      schoolId,
      admissionNo,
      name,
      dob,
      parentName,
      phone,
    });

    res.status(201).json({ success: true });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// --------------------------------------------------
// FRONTEND (PRODUCTION)
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
