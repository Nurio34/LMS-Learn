const express = require("express");
const router = express.Router();
const multer = require("multer");
const { signup, login } = require("../controllers");
const authMiddleware = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;

    return res.status(200).json({
        success: true,
        message: "Authenticated User ...",
        user,
    });
});

module.exports = router;
