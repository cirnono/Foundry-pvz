const express = require("express");
const contractController = require("../controllers/contractController");

const router = express.Router();

router.post("/mint", contractController.mint);
router.post("/trade", contractController.trade);

module.exports = router;
