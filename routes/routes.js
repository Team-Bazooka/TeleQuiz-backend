const router = require("express").Router()
const userController = require("../controllers/UserController");
const adminController = require("../controllers/AdminController");

// Middleware to check if the user is authenticated
const authenticateAdmin = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, env("JWT_SECRET"));
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed!" });
    }
  };

// User routes
router.post("/user/add", userController.register);
router.get("/quiz/get", userController.getQuiz);
router.post("/submit", userController.submitQuiz);


  
// Admin routes
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/add", authenticateAdmin, adminController.addAdmin);
router.post("/admin/quiz/add", authenticateAdmin, adminController.addQuiz);
router.get("/admin/users", authenticateAdmin, adminController.getUsers);
router.get("/admin/stats", authenticateAdmin, adminController.getStats);
router.post("/admin/quiz/update", authenticateAdmin, adminController.updateQuiz);
router.post("/admin/quiz/delete", authenticateAdmin, adminController.deleteQuiz);
router.get("/admin/scoreboard", authenticateAdmin, adminController.getScoreboard);



// Export the router
module.exports = router;