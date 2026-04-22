const { signup, login } = require("../src/controllers/Controllers/AuthController");
const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;