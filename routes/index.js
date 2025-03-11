const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));

router.use("/stories", require("./storyRoutes"));

router.use("/categories", require("./categoryRoutes"));

module.exports = router;
