import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
    },
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

export default app;