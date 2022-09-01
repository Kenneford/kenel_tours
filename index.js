const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.render("kenelTour"));
app.get("/about", (req, res) => res.send("About"));
app.get("/contact", (req, res) => res.send("Contact"));
app.get("/upcoming-tour", (req, res) => res.send("Upcoming Tour"));

app.listen(port, () => console.log(`Server listening at port ${port}`));
