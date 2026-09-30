const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {

    // Mengambil lokasi dari input frontend
    const kota = req.query.kota;

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    if (!kota) {
        return res.status(400).json({
            message: "Kota belum dimasukkan"
        });
    }

    const url =
        `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}`;

} )