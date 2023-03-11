const { PrismaClient } = require("@prisma/client");
const userController = {};
const prisma = new PrismaClient();

userController.submitQuiz = async (req, res) => {
  const { telegram_id, points, quiz_id } = req.body;

  if (!telegram_id || !points || !quiz_id) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const u = await prisma.user.findMany({
      where: {
        telegram_id,
      },
    });

    let point = 0;

    // storing each answer in the DB
    points.map(async (p) => {
      point = point + (100 * p[1] + (30 - p[0]) * 50);
      await prisma.usedtime.create({
        data: {
          user_id: u[0].id,
          question_id: p[2],
          quiz_id,
          isCorrect: p[1] === 0 ? false : true,
          time: p[0],
        },
      });
    });

    await prisma.scoreboard.create({
      data: {
        user_id: u[0].id,
        point,
        quiz_id,
      },
    });

    const scores = await prisma.scoreboard.findMany({
      where: {
        quiz_id,
      },
    });

    scores.sort();

    res.json({
      success: true,
      data: scores,
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

userController.register = async (req, res) => {
  const { telegram_id, username, ref_id } = req.body;

  if (!telegram_id) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const u = await prisma.user.findMany({
      where: {
        telegram_id,
      },
    });

    if (u[0]) {
      return res.json({
        sucess: false,
        data: null,
        error: { msg: "User already exists!!" },
      });
    } else {
      if(ref_id){
        await prisma.user.updateMany({
          where: {
            telegram_id: ref_id
          },
          data:{ 
            number_of_shared_link: {
              increment: 1
            }
          }
        })
      }
      const newUser = await prisma.user.create({
        data: {
          telegram_id,
          username: username ? username : "",
          number_of_quiz: 0,
          number_of_shared_link: 0,
          isActive: true,
        },
      });

      res.json({
        sucess: true,
        data:  {...newUser, telegram_id: newUser.telegram_id.toString() },
        error: null
      })
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      data: null,
      error: error.meta || { msg: "Error occured check the server log!!" },
    });
  }
};

userController.getQuiz = async (req, res) => {
  const { telegram_id, username, tag } = req.body;

  if (!telegram_id || !tag) {
    return res.json({ msg: "Please enter all fields!!" });
  }

  try {
    const user = await prisma.user.findMany({
      where: {
        telegram_id,
      },
    });

    const quizs = await prisma.quiz.findMany({
      where: {},
    });

    let ids = [];

    quizs.map((q) => {
      if(q.tags.indexOf(tag) > -1){
         ids = [...ids, q.id];
      }
    });

    if (user[0]) {
      const s = await prisma.scoreboard.findMany({
        where: {
          user_id: user[0].id,
        },
      });

      s.map((sb) => {
        ids.indexOf(sb.id) > -1 ? ids.pop(sb.id) : null;
      });
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
        id: random,
      },
    });

    res.json({
      success: true,
      data: { ...q[0], views: q[0].views.toString() },
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
