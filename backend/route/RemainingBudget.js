const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RemainingBudgetController = require('../controller/RemainingBudgetController'); //

router
.get('/', auth, RemainingBudgetController.remainingBudget)

module.exports = router;