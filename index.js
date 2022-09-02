const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const { Pool } = require("PG");

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 7000;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => res.render("kenelTour"));
app.get("/about", (req, res) => res.send("About"));
app.get("/contact", (req, res) => res.send("Contact"));
app.get("/upcoming-tour", (req, res) => res.send("Upcoming Tour"));

app.get("/user", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

//Params
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id=$1;", [id])
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

//Posting or Creating
app.post("/user", (req, res) => {
  console.log(req.body);
  pool
    .query(
      `
    insert into users(first_name, surname, username, email, birth_year) 
    values ($1, $2, $3, $4, $5) returning *;
    `,
      [
        req.body.firstName,
        req.body.surname,
        req.body.userName,
        req.body.email,
        req.body.birthYear,
      ]
    )
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

console.log(process.env.PG_DATABASE);

app.listen(port, () => console.log(`Server listening at port ${port}`));
