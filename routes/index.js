const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));

router.use("/stories", require("./storyRoutes"));

router.use("/categories", require("./categoryRoutes"));

router.use("/sitemap", require("./sitemapRoutes"))

module.exports = router;
