const express = require("express");
const router = express.Router();
const { getSessions } = require("../controllers/sessionController");
const auth = require("../middleware/authMiddleware");

router.get("/sessions", auth, getSessions);

module.exports = router;
