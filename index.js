const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");

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

let data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/people", (req, res) => {
  res.json(data);
});

app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${data.length} people <br> ${new Date()}`);
});

app.get("/api/people/:id", (req, res) => {
  const reqId = req.params.id;
  const person = data.find((person) => person.id === reqId);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
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
  } else if (data.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 10000 + 1).toString(),
    name: body.name,
    number: body.number,
  };

  data = data.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
