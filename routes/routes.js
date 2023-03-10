const router = require("express").Router()
const userController = require("../controllers/UserController");
const quizController = require("../controllers/QuizController");

// User routes
router.post("/signup", userController.signup);

router.post("/submit", userController.submitQuiz);

// Quiz routes
router.post("/quiz/add", quizController.addQuiz);

module.exports = router;