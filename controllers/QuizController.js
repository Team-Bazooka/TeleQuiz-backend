const { PrismaClient } = require("@prisma/client");
const quizUtils = require("../utils/QuizUtils");
const quizController = {};
const prisma = new PrismaClient();

quizController.addQuiz = async(req, res) => {
    const { questions, choices, answers, tag, language } = req.body;

    if(!questions || !choices || !answers || !tag || !language){
        return res.json({
            success: false,
            data: null,
            error: { msg: "Please enter all fields!!" }
        })
    }

    try {
        const newQuiz = await prisma.quiz.create({
            data:{
                number_of_questions: questions.length,
                views: 0,
                tag,
                created_at: new Date(),
            }
        })

        let qa = [];

        for(let i = 0; i < questions.length; i++){
            qa.push({
                content: questions[i],
                language: language,
                choices: choices[i],
                answer: answers[i]
            })  
        }

        res.json({
            success: true,
            data: {
                ...newQuiz,
                views: newQuiz.views.toString(),
                qa
            },
            error: null
        })
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error.meta || { msg: "Error occured check the server log!!"}
        })
    }
}

quizController.getQuiz = async(req, res) => {
    const 
}

module.exports = quizController;