const { create } = require('xmlbuilder2');
const Story = require("../models/story");
const Category = require('../models/Category');

const getIndexSitemap = async (req, res) => {
    const domainUrl = process.env.NEXT_PUBLIC_DOMAIN

    try {
        const categories = await Category.find({})
            .limit(500)
            .lean()

        const tempCategories = await Promise.allSettled(
            categories.map(async (item) => {
                const story = await Story.findOne({ categories: { $regex: item?.name, $options: 'i' } });
                return story ? item?.name : null;
            })
        );

        const filteredCategories = tempCategories.map(item => item?.value).filter(item => item !== null);

        const storyDates = await Story.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "/",
                            {
                                $arrayElemAt: [
                                    ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
                                    { $subtract: ["$_id.month", 1] }
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('sitemapindex', {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        });

        filteredCategories?.map(categoryName => {
            root.ele('sitemap')
                .ele('loc').txt(domainUrl + `/sitemap/category/${categoryName}.xml`).up()
                .ele('changefreq').txt('daily').up()
                .ele('priority').txt('0.8').up()
        })

        storyDates.forEach(date => {
            root.ele('sitemap')
                .ele('loc').txt(`${domainUrl}/sitemap/${date?.date}.xml`).up()
                .ele('changefreq').txt('monthly').up()
                .ele('priority').txt('0.7').up()
        });

        const xmlContent = root.end({ prettyPrint: true });

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xmlContent);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

const getCategorySitemap = async (req, res) => {
    const domainUrl = process.env.NEXT_PUBLIC_DOMAIN
    const category = req?.params?.category

    try {
        const stories = await Story.find({ categories: { $regex: category, $options: 'i' } })

        const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:xhtml': "http://www.w3.org/1999/xhtml"
        });

        stories.forEach(story => {
            root.ele('url')
                .ele('loc').txt(`${domainUrl}/story-detail/${story?.slug}`).up()
                .ele('lastmod').txt(story?.createdAt?.toISOString()).up()
                .ele('changefreq').txt('monthly').up()
                .ele('priority').txt('0.9').up()
        });

        const xmlContent = root.end({ prettyPrint: true });

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xmlContent);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Error: error?.message })
    }
}

const getOldStories = async (req, res) => {
    const domainUrl = process.env.NEXT_PUBLIC_DOMAIN

    try {
        const year = Number(req?.query?.year)
        const month = Number(req?.query?.month)

        let endOfMonth = new Date(year, month, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        const stories = await Story.find({
            $and: [
                { createdAt: { $gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`).toISOString() } },
                { createdAt: { $lt: endOfMonth.toISOString() } },
            ]
        })
            .sort({ createdAt: -1 })
            .limit(500)
            .lean()

        const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:xhtml': "http://www.w3.org/1999/xhtml"
        });

        stories.forEach(story => {
            root.ele('url')
                .ele('loc').dat(`${domainUrl}/story-detail/${story?.slug}`).up()
                .ele('lastmod').txt(story?.createdAt?.toISOString()).up()
                .ele('changefreq').txt('monthly').up()
                .ele('priority').txt('0.9').up()
        });

        const xmlContent = root.end({ prettyPrint: true });

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xmlContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getIndexSitemap,
    getCategorySitemap,
    getOldStories
}