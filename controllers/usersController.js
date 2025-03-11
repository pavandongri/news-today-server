const User = require("../models/User");
const { timeout } = require('promise-timeout');
const bcrypt = require('bcrypt');
const promiseWaitTime = process.env.PROMISE_WAIT_TIME

const createUser = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload?.password) {
            return res.status(400).json({ Error: 'Password is required' });
        }

        if (!payload?.email) {
            return res.status(400).json({ Error: 'Email is required' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

        payload.password = hashedPassword;

        const user = await timeout(User.create(payload), promiseWaitTime);

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await timeout(User.findById(id), promiseWaitTime)

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await timeout(User.find({}), promiseWaitTime)
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const user = await timeout(User.findByIdAndUpdate(id, updatedData, { new: true }), promiseWaitTime);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await timeout(User.findByIdAndDelete(id), promiseWaitTime)

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User successfully deleted', user });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

module.exports = {
    createUser,
    getUserById,
    listUsers,
    updateUser,
    deleteUser
};
