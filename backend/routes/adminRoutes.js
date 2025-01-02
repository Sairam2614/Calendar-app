const express = require("express");
const {
  addCompany,
  editCompany,
  deleteCompany,
  getCompanies,
  addMethod,
  editMethod,
  deleteMethod,
  getMethods
} = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/company", authenticate("admin"), addCompany);
router.delete("/company/:id", authenticate("admin"), deleteCompany);
router.get("/companies", authenticate("admin"), getCompanies);
router.put("/company/:id", authenticate("admin"), editCompany);

router.post("/methods", authenticate("admin"), addMethod);
router.put("/methods/:id", authenticate("admin"), editMethod);
router.delete("/methods/:id", authenticate("admin"), deleteMethod);
router.get("/methods", authenticate("admin"), getMethods);

module.exports = router;
