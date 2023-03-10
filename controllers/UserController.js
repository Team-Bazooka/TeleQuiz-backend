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


module.exports = userController;
