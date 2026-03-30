import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    await pool.query("INSERT INTO visits (visited_at) VALUES (NOW())");
    const { rows } = await pool.query("SELECT COUNT(*) FROM visits");
    res.render("home", { title: "Portfolio", homeActive: true, visits: rows[0].count });
});

router.get("/skills", (req, res) => {
    res.render("skills", { title: "Skills", skillsActive: true });
});

router.get("/cv", (req, res) => {
    res.render("cv", { title: "CV", cvActive: true });
});

router.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact", contactActive: true });
});

router.get("/scores", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM scores ORDER BY score DESC");
    res.render("scores", { title: "Scores", scoresActive: true, scores: rows });
});

router.post("/scores", async (req, res) => {
    const { player, game, score } = req.body;
    await pool.query("INSERT INTO scores (player, game, score) VALUES ($1, $2, $3)", [player, game, score]);
    res.redirect("/scores");
});

router.get("/nasa", async (req, res) => {
    try {
        let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
        if (req.query.date) {
            url += `&date=${req.query.date}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];
        res.render("nasa", {
            title: "NASA APOD",
            nasaActive: true,
            today,
            apod: {
                title: data.title,
                date: data.date,
                explanation: data.explanation,
                url: data.url,
                hdurl: data.hdurl,
                mediaType: data.media_type,
                copyright: data.copyright || null,
            },
        });
    } catch (err) {
        console.error(err);
        res.render("nasa", { title: "NASA APOD", nasaActive: true, error: true });
    }
});

export default router;