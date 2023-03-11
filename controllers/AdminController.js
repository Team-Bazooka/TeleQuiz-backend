const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminController = {};

const secret = process.env.JWT_SECRET;

function stringifyNumbers(obj) {
  if (typeof obj === "number") {
    return obj.toString();
  }
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(stringifyNumbers);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, stringifyNumbers(value)])
    );
  }
  return obj;
}

// Done
adminController.addQuiz = async (req, res) => {
  const { questions, choices, answers, tags, language, title, description } =
    req.body;

  if (
    !questions ||
    !choices ||
    !answers ||
    !tags ||
    !language ||
    !title ||
    !description
  ) {
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
        tags,
        language,
        title,
        description,
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

// Done
adminController.getQuiz = async (req, res) => {
  const { tag } = req.body;

  try {
    const quizs = await prisma.quiz.findMany({
      where: {},
    });
    let data = [];
    if (quizs.length !== 0) {
      quizs.map(q => {
        if(q.tags.indexOf(tag) > -1){
          data = [...data, {...q,views: q.views.toString()} ];
        }
      })
    }
    res.json({
      success: true,
      data: data,
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

// Done
adminController.getQuizes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const lim = parseInt(limit);
  const skip = (page - 1) * limit;

  try {
    const items = await prisma.quiz.findMany({
      skip,
      take: lim,
    });

    const stringifiedData = stringifyNumbers(items);

    res.json({
      success: true,
      data: stringifiedData,
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

// Done
adminController.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Admin does not exist!!" },
      });
    }

    bcrypt.compare(password, admin.password).then((result) => {
      if (result) {
        const token = jwt.sign(
          { username: admin.username, adminId: admin.id },
          secret,
          { expiresIn: "1h" }
        );

        res.json({
          success: true,
          data: { accesstoken: token, username: admin.username, email: admin.email, fname: admin.fname, lname: admin.lname },
          error: null,
        });
      }else {
        return res.json({
          success: false,
          data: null,
          error: {
             msg: "Invalid email or password!!"
          }
        })
      }
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

// Done
adminController.addAdmin = async (req, res) => {
  const { fname, lname, email, username, password } = req.body;

  if (!username || !password || !fname || !lname || !email) {
    return res.json({
      success: false,
      data: null,
      error: { msg: "Please enter all fields!!" },
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (admin) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Admin already exists!!" },
      });
    }

    let pwd = bcrypt.hashSync(password, 8);

    await prisma.admin.create({
      data: {
        fname: fname,
        lname: lname,
        email: email,
        username: username,
        password: pwd,
        registered_at: new Date(),
      },
    });

    res.json({
      success: true,
      data: { fname, lname, email, username },
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

// Done
adminController.getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const lim = parseInt(limit);
  const skip = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      skip,
      take: lim,
    });

    let data = []

    users.map(u => {
      data = [...data, {...u, telegram_id: u.telegram_id.toString()}]
    })

    res.json({
      success: true,
      data: data,
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

adminController.getStats = async (req, res) => {

  try {
    const quizes = await prisma.quiz.findMany({
      where: {}
    })

    const users = await prisma.user.findMany({
      where: {}
    })

    const admins = await prisma.admin.findMany({
      where: {}
    })

    res.json({
      success: true,
      data: {
        total_quiz: quizes.length,
        total_user: users.length,
        total_admins: admins.length
      }
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

adminController.getUserStats = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.json({
      success: false,
      data: null,
      error: {
        msg: "Please enter all fields!!",
      },
    });
  }

  try {
    res.json({
      success: true,
      data: {
        quiz: {
          tags: {
            science: 0,
            technology: 0,
            history: 0,
            sport: 0
          },
          highscore: {
            point: 0,
            quiz_title: ""
          },
          total_time_spent: 0
        }
      },
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
}

adminController.updateQuiz = async (req, res) => {};

adminController.patchQuiz = async (req, res) => {};

// Done
adminController.deleteQuiz = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.json({
      success: false,
      data: null,
      error: {
        msg: "Please enter all fields!!",
      },
    });
  }

  try {
    await prisma.quiz.delete({
      where: {
        id
      },
    });

    res.json({
      success: true,
      data: { msg: "Done!!" },
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


adminController.getScoreboard = async (req, res) => {
  const quiz_id = req.params.id;

  if(!quiz_id){
    return res.json({
      success: false,
      data: null,
      error: {
        msg: "Please enter all fields!!",
      },
    });
  }
  
  try {
    const board = await prisma.scoreboard.findMany({
      where: { quiz_id }
    })

    res.json({
      success: true,
      data: board,
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

module.exports = adminController;
