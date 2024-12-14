
const User = require('../Model/Model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.getDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEmails = await User.countDocuments({ email: { $exists: true } });
        const recentUsers = await User.find({}, { username: 1, email: 1, _id: 0 })
            .sort({ createdAt: -1 })
            .limit(1);

        const recentActivities = recentUsers.map(
            user => `New user signup: ${user.username} (${user.email})`
        );

        res.json({
            totalUsers,
            totalEmails,
            recentActivities,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEmails = async (req, res) => {
    try {
        const emails = await User.find({ email: { $exists: true } }).select('email');
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addUser = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Debug incoming data
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new Error('Username and Email are required');
        }
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error('Error in addUser:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};