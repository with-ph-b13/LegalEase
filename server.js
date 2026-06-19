const express = require("express");
const next = require("next");
const mongoose = require("mongoose");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Import backend app
  // Note: Vercel or local builds will compile backend TS to JS in dist/
  const backendApp = require("./backend/dist/app").default;

  // MongoDB connection for production single process
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    mongoose.connect(mongoUri)
      .then(() => console.log("Connected to MongoDB from unified server"))
      .catch((err) => console.error("MongoDB connection failed:", err));
  } else {
    console.warn("MONGO_URI environment variable not set, starting without MongoDB connection");
  }

  // Mount backend routes
  server.use(backendApp);

  // All other routes go to Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Unified Server running on http://localhost:${PORT}`);
  });
});
