const express = require('express');
const router = express.Router();
const budgetEntryController = require('../controller/budgetEntryController');
const auth = require('../middleware/auth');  // Import the authentication middleware

// router.use(auth);

router
.get('/', auth, budgetEntryController.getAllEntries)
.post('/', auth, budgetEntryController.addEntry)
.put('/:id', auth, budgetEntryController.updateEntry)
.delete('/:id', auth, budgetEntryController.deleteEntry)
.get('/getBudgetReport', auth, budgetEntryController.getBudgetReport);
module.exports = router;