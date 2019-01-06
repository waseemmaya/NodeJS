const express = require("express");
const Joi = require("joi");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));

if (app.get("env") === "development") {
  app.use(morgan("common"));
  console.log("Morgan Enabled...");
}

const quizzes = [
  { name: "ReactJS", id: 1 },
  { name: "Firebase", id: 2 },
  { name: "React Native", id: 3 }
];

// set NODE_ENV=production
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);  // by default undefined
// const env = app.get('env');
// console.log('env :', env);  // by dafault development

// Read Root
app.get("/", (req, res) => {
  res.send("Quiz Api add /quizzes for viewing all available quizzes.");
});

// Read All Quizzes
app.get("/quizzes", (req, res) => {
  res.send(quizzes);
});

// Read Specific Quiz
app.get("/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(v => v.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).send("Quiz doesn't exist for view");
  res.send(quiz);
});

// Update Quiz Detail
app.put("/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(v => v.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).send("Quiz doesn't exist for edit.");
  quiz.name = req.body.name;
  res.send(quiz);
});

// Delete Quiz
app.delete("/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(v => v.id === parseInt(req.params.id));
  if (!quiz)
    return res.status(404).send("Selected quiz doesn't exist for deletion.");
  const i = quizzes.indexOf(quiz);
  quizzes.splice(i, 1);
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
