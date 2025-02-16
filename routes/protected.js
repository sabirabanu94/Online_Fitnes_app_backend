const express = require('express');
const { authenticate } = require('../middleware/auth');


const router = express.Router();

router.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route. You are authenticated!');
});

module.exports = router;