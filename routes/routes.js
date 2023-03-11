const router = require("express").Router()
const userController = require("../controllers/UserController");
const adminController = require("../controllers/AdminController");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

// Middleware to check if the user is authenticated
const authenticateAdmin = (req, res, next) => {
    try {
      const token = req.headers.auth.split(" ")[1];
      const decodedToken = jwt.verify(token, secret);
      req.userData = { adminId: decodedToken.adminId };
      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed!" });
    }
  };

// User routes
router.post("/user/register", userController.register);
router.get("/quiz/get", userController.getQuiz);
router.post("/quiz/submit", userController.submitQuiz);
  
// Admin routes
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/register", authenticateAdmin, adminController.addAdmin);

// Admin Quiz routes
router.get("/admin/quizes", authenticateAdmin, adminController.getQuizes);
router.get("/admin/quiz", authenticateAdmin, adminController.getQuiz);
router.post("/admin/quiz", authenticateAdmin, adminController.addQuiz);
router.put ("/admin/quiz", authenticateAdmin, adminController.updateQuiz);
router.patch("/admin/quiz", authenticateAdmin, adminController.patchQuiz);
router.delete("/admin/quiz", authenticateAdmin, adminController.deleteQuiz);

// Admin Stats routes
router.get("/admin/stats", authenticateAdmin, adminController.getStats);
router.get("/admin/users", authenticateAdmin, adminController.getUsers);
router.get("/admin/scoreboard", authenticateAdmin, adminController.getScoreboard);



// Export the router
module.exports = router;