const router = require('express').Router();
const authController = require('../controller/auth');

router
.post('/', authController.login)

exports.router = router;