const { Router } = require("express");
const userController = require("../../controllers/userController");

const router = Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/logout", userController.logout);
router.get("/profile", userController.getProfile);

module.exports = router;
