const router = require("express").Router()
const userController = require("../controllers/UserController");
const quizController = require("../controllers/QuizController");

// User routes
router.post("/submit", userController.submitQuiz);

// Quiz routes
router.post("/quiz/add", quizController.addQuiz);

router.get("/quize/get", quizController.getQuiz);

module.exports = router;