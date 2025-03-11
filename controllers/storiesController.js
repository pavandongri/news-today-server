const Story = require("../models/story");
const { timeout } = require('promise-timeout');
const promiseWaitTime = process.env.PROMISE_WAIT_TIME || 5000

const createStory = async (req, res) => {
    try {
        const payload = req.body;

        payload.slug = req?.body?.title?.toLowerCase()?.replace(/ /g, '-');

        const story = await timeout(Story.create(payload), promiseWaitTime);

        res.status(201).json({ story });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const getStoryById = async (req, res) => {
    try {
        const id = req?.params?.id;

        if (!id) {
            res.status(400).json({ message: 'Please provide an ID' });
            return;
        }

        const story = await timeout(Story.findById(id), promiseWaitTime);

        if (!story) {
            res.status(404).json({ message: 'Story not found' });
            return;
        }

        res.status(200).json({ story });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


const getStoryBySlug = async (req, res) => {
    try {
        const slug = req?.params?.slug;

        if (!slug) {
            res.status(400).json({ message: 'Please provide slug' });
            return;
        }

        const story = await timeout(Story.findOne({ slug }), promiseWaitTime);

        if (!story) {
            res.status(404).json({ message: 'Story not found' });
            return;
        }

        res.status(200).json({ story });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const listStories = async (req, res) => {
    let query = {}
    let page = 1, pageSize = 5;

    if (req?.query?.category) {
        query.categories = { $regex: req.query.category, $options: 'i' };
    }

    if (req?.query?.page) page = Number(req?.query?.page)

    if (req?.query?.pageSize) pageSize = Number(req?.query?.pageSize)

    try {
        const stories = await timeout(
            Story.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean()
            , promiseWaitTime);

        const count = await Story.countDocuments(query);

        res.status(200).json({ stories, totalPages: Math.ceil(count / pageSize), count });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const updateStory = async (req, res) => {
    try {
        const id = req?.params?.id;

        if (!id) {
            res.status(400).json({ message: 'Please provide an ID' });
            return;
        }

        const updatedData = req.body;
        const story = await timeout(Story.findByIdAndUpdate(id, updatedData, { new: true }), promiseWaitTime)

        if (!story) {
            res.status(404).json({ message: 'Story not found' });
            return;
        }

        res.status(200).json({ story });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const deleteStory = async (req, res) => {
    try {
        const id = req?.params?.id;

        if (!id) {
            res.status(400).json({ message: 'Please provide a valid ID' });
            return;
        }

        const story = await timeout(Story.findByIdAndDelete(id), promiseWaitTime)

        if (!story) {
            res.status(404).json({ message: 'Story not found' });
            return;
        }

        res.status(200).json({ message: 'Story successfully deleted', story });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

module.exports = {
    createStory,
    getStoryById,
    getStoryBySlug,
    listStories,
    updateStory,
    deleteStory
};
