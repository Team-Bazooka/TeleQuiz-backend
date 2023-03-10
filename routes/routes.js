const router = require("express").Router()
const userController = require("../controllers/UserController");

// User routes
router.post("/signup", userController.signup);

router.post("/submit", userController.submitQuiz);
