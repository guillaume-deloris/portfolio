import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", { title: "Portfolio", homeActive: true });
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

router.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Portfolio" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            replyTo: email,
            subject: `Message de ${name} — Portfolio`,
            text: message,
        });
        res.render("contact", { title: "Contact", contactActive: true, success: true });
    } catch (err) {
        console.error(err);
        res.render("contact", { title: "Contact", contactActive: true, error: true });
    }
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
