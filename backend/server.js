const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// ----------------------------------
// 🌐 Middleware
// ----------------------------------
app.use(cors());
app.use(express.json());

// ----------------------------------
// 🩺 Health Check
// ----------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// ----------------------------------
// 🌱 Seed Sample Listings
// Use once: http://localhost:5000/api/seed
// ----------------------------------
app.get("/api/seed", async (req, res) => {
  try {
    const sampleListings = [
      {
        title: "Modern Studio Flat",
        location: "London",
        address: "123 City Rd",
        price: "£1,800/month",
        description: "Cozy studio in the heart of the city",
        imageUrl: "https://source.unsplash.com/featured/?apartment,london"
      },
      {
        title: "Spacious Family Home",
        location: "Manchester",
        address: "45 Suburb Lane",
        price: "£2,500/month",
        description: "Perfect for families, great local parks",
        imageUrl: "https://source.unsplash.com/featured/?house,manchester"
      },
      {
        title: "Minimalist Apartment",
        location: "Brighton",
        address: "10 Beachside Ave",
        price: "£1,400/month",
        description: "Clean, bright, walk to the beach",
        imageUrl: "https://source.unsplash.com/featured/?apartment,brighton"
      },
      {
        title: "Elegant Loft",
        location: "Leeds",
        address: "22 Industrial Road",
        price: "£1,950/month",
        description: "Industrial feel with modern amenities",
        imageUrl: "https://source.unsplash.com/featured/?loft,leeds"
      }
    ];

    for (const listing of sampleListings) {
      await prisma.listing.create({ data: listing });
    }

    res.json({ message: "✅ Seeded sample listings!" });
  } catch (error) {
    console.error("❌ Error seeding listings:", error);
    res.status(500).json({ error: "Failed to seed listings" });
  }
});

// ----------------------------------
// 📥 Signup Route
// POST /api/users
// ----------------------------------
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
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ----------------------------------
// 📤 Create a New Listing
// POST /api/listings
// ----------------------------------
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

// ----------------------------------
// 🔍 Get Listings with Optional Filters
// GET /api/listings?city=&search=
// ----------------------------------
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

// ----------------------------------
// 🚀 Start the server
// ----------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


