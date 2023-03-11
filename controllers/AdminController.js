const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const adminController = {};


// AddQuizes endpoint
adminController.addQuiz = async (req, res) => {
    const { questions, choices, answers, tag, language } = req.body;
  
    if (!questions || !choices || !answers || !tag || !language) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter all fields!!" },
      });
    }
  
    try {
      let qa = [];
  
      for (let i = 0; i < questions.length; i++) {
        qa.push({
          content: questions[i],
          choices: choices[i],
          answer: answers[i],
        });
      }
  
      const newQuiz = await prisma.quiz.create({
        data: {
          number_of_questions: questions.length,
          views: 0,
          tag,
          language,
          created_at: new Date(),
          questions: qa,
        },
      });
  
      res.json({
        success: true,
        data: { ...newQuiz, views: newQuiz.views.toString() },
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        data: null,
        error: error.meta || { msg: "Error occured check the server log!!" },
      });
    }
};

adminController.loginAdmin = async (req, res) => {}


adminController.addAdmin = async (req, res) => {}


adminController.addQuiz = async (req, res) => {}


adminController.getUsers = async (req, res) => {}


adminController.getStats = async (req, res) => {}


adminController.updateQuiz = async (req, res) => {}


adminController.deleteQuiz = async (req, res) => {}


adminController.getScoreboard = async (req, res) => {}


module.exports = adminController;
