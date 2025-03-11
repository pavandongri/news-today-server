const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, categoryController.createCategory);

router.get("/", categoryController.listCategories);

module.exports = router;
