const Category = require("../models/Category");
const { timeout } = require('promise-timeout');
const promiseWaitTime = process.env.PROMISE_WAIT_TIME || 5000

const createCategory = async (req, res) => {
    try {
        const category = await timeout(Category.create(req?.body), promiseWaitTime);

        res.status(200).json({ category: { name: category.name } });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await timeout(Category.find({}), promiseWaitTime);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

module.exports = {
    createCategory,
    listCategories
};
