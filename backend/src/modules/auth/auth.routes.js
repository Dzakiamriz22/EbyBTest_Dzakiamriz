const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.get('/demo-account', authController.getDemoAccount);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
