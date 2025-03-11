const express = require("express");
const router = express.Router();
const storiesController = require("../controllers/storiesController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, storiesController.createStory);

router.get("/:id", storiesController.getStoryById);

router.get("/by-slug/:slug", storiesController.getStoryBySlug);

router.get("/", storiesController.listStories);

router.put("/:id", authMiddleware, storiesController.updateStory);

router.delete("/:id", authMiddleware, storiesController.deleteStory);

module.exports = router;
