const express = require("express");
const router = express.Router();

const sitemapController = require("../controllers/sitemapController")

router.get("/index-sitemap", sitemapController.getIndexSitemap)

router.get("/category-sitemap/:category", sitemapController.getCategorySitemap)

router.get("/old-stories", sitemapController.getOldStories);

module.exports = router;
