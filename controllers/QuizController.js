const { PrismaClient } = require("@prisma/client");
const quizController = {};
const prisma = new PrismaClient();

quizController.addQuiz = async (req, res) => {
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

quizController.getQuiz = async (req, res) => {
  const { telegram_id, username, tag } = req.body;

  if (!telegram_id || !tag || !username) {
    return res.json({ msg: "Please enter all fields!!" });
  }

  try {
    const user = await prisma.user.findMany({
      where: {
        telegram_id,
      },
    });

    const quizs = await prisma.quiz.findMany({
      where: { tag: tag },
    });

    let ids = [];

    quizs.map((q) => {
      ids = [...ids, q.id];
    });

    if (user[0]) {
      const s = await prisma.scoreboard.findMany({
        where: {
          user_id: user[0].id
        },
      });

      s.map(sb => {
        ids.indexOf(sb.id) > - 1 ? ids.pop(sb.id) : null;
      })
    } else {
      await prisma.user.create({
        data: {
          telegram_id,
          username,
          number_of_quiz: 0,
          number_of_shared_link: 0,
          isActive: true,
        },
      });
    }

    let random = ids[Math.floor(Math.random() * ids.length)];

    const q = await prisma.quiz.findMany({
      where: {
        id: random
      },
    });

    res.json({
      success: true,
      data: { ...q[0], views: q[0].views.toString()},
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

module.exports = quizController;
