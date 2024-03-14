const express = require('express');
const router = express.Router();
const { addUser, getUsers, updateUserStatus } = require('../controllers/userDetails');

// Define routes
router.post('/add', addUser);
router.get('/get/:tableName', getUsers);
router.put('/updateStatus', updateUserStatus);


module.exports = router;
