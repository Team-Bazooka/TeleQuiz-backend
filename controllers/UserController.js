const { PrismaClient } = require("@prisma/client");
const userController = {};
const prisma = new PrismaClient();

userController.submitQuiz = async (req, res) => {
  const { telegram_id, point, quiz_id } = req.body;

  if (!telegram_id || !point || !quiz_id) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const u = await prisma.user.findMany({
      where: {
        telegram_id
      }
    })

    const score = await prisma.scoreboard.create({
      data: {
        user_id: u[0].id,
        point,
        quiz_id
      }
    })

    const scores = await prisma.scoreboard.findMany({
      where: {
        quiz_id
      }
    })

    scores.sort();

    res.json({
      success: true,
      data: scores,
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      data: null,
      error: error.meta || { msg: "Error occured check the server log!!" },
    });
  }
};

userController.register = async (req, res) => {
  const { telegram_id, name } = req.body;

  if (!telegram_id || !name ) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const u = await prisma.user.findMany({
      where: {
        telegram_id
      }
    })

    console.log(u);
    
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      data: null,
      error: error.meta || { msg: "Error occured check the server log!!" },
    });
  }

}

userController.getQuiz = async (req, res) => {
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

module.exports = userController;
