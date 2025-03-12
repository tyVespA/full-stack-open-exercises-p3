require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
const Person = require("./models/person");

morgan.token("reqBody", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

// app.use(morgan("tiny"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    res.send(
      `Phonebook has info for ${people.length} people <br> ${new Date()}`
    );
  });
});

app.get("/api/people/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.post("/api/people", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  // else if (data.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    // id: Math.floor(Math.random() * 10000 + 1).toString(),
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
