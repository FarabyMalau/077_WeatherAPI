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

    try {

        const response = await axios.get(url);

        console.log(response.data);

        const data = response.data;

        if (!data.features || data.features.length === 0) {

            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });

        }

        const feature = data.features[0];

        const lokasi =
            feature.matching_text ||
            feature.text ||
            "-";

        const koordinat =
            feature.geometry.coordinates;

        /*
         * Koordinat MapTiler:
         *
         * [longitude, latitude]
         */

        const longitude = koordinat[0];

        const latitude = koordinat[1];


        /*
         * Mengambil informasi dari context
         */

        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";


        if (feature.context) {

            feature.context.forEach(item => {

                if (item.id.startsWith("country")) {
                    negara = item.text;
                }

                if (item.id.startsWith("region")) {
                    provinsi = item.text;
                }

                if (
                    item.id.startsWith("district") ||
                    item.id.startsWith("county") ||
                    item.id.startsWith("locality")
                ) {
                    kecamatan = item.text;
                }

            });

        }


        /*
         * Kirim data ke frontend
         */

        res.json({

            kota: lokasi,

            negara: negara,

            provinsi: provinsi,

            kecamatan: kecamatan,

            longitude: longitude,

            latitude: latitude

        });


    } catch (error) {

        console.error(error.message);

        res.status(500).json({

            message:
                "Gagal mengambil data dari MapTiler"

        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Server berjalan di http://localhost:${PORT}`
    );

});