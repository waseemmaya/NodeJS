const express = require("express");
const Joi = require("joi");
const app = express();

// app.use(express.json());

const quizzes = [
  { name: "ReactJS", id: 1 },
  { name: "Firebase", id: 2 },
  { name: "React Native", id: 3 }
];

// POST: to create a resource
// PUT: to update it
// DELETE: to delete it

// Read Root
app.get("/", (req, res) => {
  res.send("Working");
});

// Read All Quizzes
app.get("/quizzes", (req, res) => {
  res.send(quizzes);
});

// Read Specific Quiz
app.get("/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(v => v.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).send("Quiz doesn't exist");
  res.send(quiz);
});

// Post new Quiz
app.post("/quizzes", (req, res) => {
  const { error } = validateQuiz(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const quiz = {
    name: req.body.name,
    id: quizzes.length + 1
  };
  quizzes.push(quiz);
  res.send(quiz);
});

// Function for validating quiz object
function validateQuiz(quiz) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(quiz, schema);
}

// Setup Port i.e set PORT=3000
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}.`));
