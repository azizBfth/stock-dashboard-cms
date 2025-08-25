const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const productRoutes = require("./routes/ProductRoutes");
const stockMvtRoutes = require("./routes/StockMovementRoutes");
const cremeRoutes = require("./routes/CremeRoutes");
const mslProductRoutes = require("./routes/MslProductRoutes");

const app = express();

// Middleware
app.use(cookieParser());

// Autoriser toutes les origines
app.use(
  cors({
    origin: "*", // <- permet toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/mvt", stockMvtRoutes);
app.use("/api/creme", cremeRoutes);
app.use("/api/msl", mslProductRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connect to MongoDB
mongoose.set("strictQuery", false);
const mongoURI = "mongodb://mongo:27017/mvtdb";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    const PORT = 80;
    app.listen(PORT, () => {
      console.log(`🌐 Serveur HTTP démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB:", error);
  });
