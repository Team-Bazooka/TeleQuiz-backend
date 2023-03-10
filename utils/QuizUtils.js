const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const quizUtils = {};

quizUtils.addQuestion = async(question) => {
    try {
        await prisma.question.create({
            data: {
                question
            }
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

quizUtils.addChoice = async(choice) => {
    try {
        await prisma.choice.create({
            data: {
                choice
            }
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

module.exports = quizUtils;