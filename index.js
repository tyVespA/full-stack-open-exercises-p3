// skipped exs: 3.17
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

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.send(
        `Phonebook has info for ${people.length} people <br> ${new Date()}`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/people/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.post("/api/people", (req, res, next) => {
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

  const person = new Person({
    // id: Math.floor(Math.random() * 10000 + 1).toString(),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.delete("/api/people/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// error handling
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
