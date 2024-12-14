const express = require('express');

const router = express.Router();
const { registerUser, loginUser, getDashboardData, getAllUsers, getAllEmails, addUser, updateUser, deleteUser, LoginAdmin } = require("../Controller/Controller")

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getDashboardData', getDashboardData)
router.get('/getAllUsers', getAllUsers)
router.get('/getAllEmails', getAllEmails)
router.post('/addUser', addUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);


module.exports = router;
