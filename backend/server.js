const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check route (test in browser: http://localhost:5000/)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// GET listings with optional filtering
app.get("/api/listings", async (req, res) => {
  const { city, search } = req.query;

  try {
    const listings = await prisma.listing.findMany({
      where: {
        AND: [
          city ? { location: { contains: city, mode: "insensitive" } } : {},
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
    });

    res.json(listings);
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    res.status(500).json({ error: "Server error while fetching listings" });
  }
});

// POST /api/users - Signup route
app.post("/api/users", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
  
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }
  
      const newUser = await prisma.user.create({
        data: { email, password },
      });
  
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error during signup" });
    }
  });
  

// POST a new listing
app.post("/api/listings", async (req, res) => {
  const { title, location, address, price, description, imageUrl } = req.body;

  try {
    const newListing = await prisma.listing.create({
      data: { title, location, address, price, description, imageUrl },
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    res.status(500).json({ error: "Server error while creating listing" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

