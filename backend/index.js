const express = require('express')
require('dotenv').config();
const cors = require('cors')
// const budgetTrackingRouter = require('./route/budgetEntries')
const connection = require('./db')
const server = express();
const userRoutes = require('./route/user');
const authRoutes = require('./route/auth');
const budgetEntryRoutes = require('./route/budgetEntryRoutes');
const RemainingBudget = require('./route/RemainingBudget');
// database connection
connection();

// middleware
server.use(express.json());
server.use(cors());
const port = process.env.PORT || 8000;

server.use('/api/users', userRoutes.router)
server.use('/api/auth', authRoutes.router);
server.use('/api/budget-entries', budgetEntryRoutes)
server.use('/api/remaining-budget', RemainingBudget)
// uncomment this line
// server.use('/', budgetTrackingRouter.router)


server.listen(port, () => {
    console.log('listening on port ' + port);
})

