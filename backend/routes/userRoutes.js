const express = require("express");
const {
  logCommunication,
  getOverdueCommunications,
  getTodaysCommunications,
  getCompanies
} = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/communications/log", authenticate("user"), logCommunication);
router.get("/communications/overdue", authenticate("user"), getOverdueCommunications);
router.get("/communications/today", authenticate("user"), getTodaysCommunications);
router.get("/companies", authenticate("user"), getCompanies);

module.exports = router;
