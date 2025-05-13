const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const https = require("https");
const fs = require("fs");

const productRoutes = require("./routes/ProductRoutes");
const stockMvtRoutes = require("./routes/StockMovementRoutes");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes API
app.use("/api/products", productRoutes);
app.use("/api/mvt", stockMvtRoutes);

// Servir le frontend React
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connexion à MongoDB
mongoose.set("strictQuery", false);
const mongoURI = "mongodb://mongo:27017/mvtdb";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    // Démarrer le serveur HTTP
    const PORT = 80;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
    };
    // Démarrer le serveur HTTPS
    https.createServer(httpsOptions, app).listen(443, () => {
      console.log("🚀 Serveur HTTPS démarré sur le port 443");
    }
    );

  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB:", error);
  });
