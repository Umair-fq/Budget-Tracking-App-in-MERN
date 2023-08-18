const { BudgetEntry, validateBudgetEntry} = require('../model/budget')
const { User } = require('../model/user');
// const Entries = model.budgetEntries

exports.getAllEntries = async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID
        const entries = await BudgetEntry.find({ user: userId });
        res.status(200).send(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}


exports.addEntry = async (req, res) => {
    console.log('Request body:', req.body);

    const { error } = validateBudgetEntry(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        // Get the user Id from the authenticated user
        const userId = req.user._id;

        console.log('User ID:', userId);

        // Fetch the user to get their budget
        const user = await User.findById(userId);

        console.log('User:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        const userBudget = user.budget;
        const enteredPrice = req.body.price;

        // console.log('User budget:', userBudget);
        // console.log('Entered price:', enteredPrice);

        if (enteredPrice > userBudget) {
            // console.log('Insufficient budget');
            // return res.status(400).send('Insufficient budget');
            const notification = 'Insufficient budget: Your budget is exceeded.';
            user.notifications.push(notification);
            await user.save();
            return res.status(400).send(notification);
        }

        const remainingBudget = userBudget - enteredPrice;
        
        await User.findByIdAndUpdate(userId, { budget: remainingBudget });

        const budgetEntry = new BudgetEntry({
            name: req.body.name,
            price: req.body.price,
            date: req.body.date,
            user: userId,
            userBudget: remainingBudget
        });

        const savedEntry = await budgetEntry.save();
        console.log('Budget entry saved successfully');
        res.send(savedEntry);
    } catch (error) {
        console.error('Error adding entry:', error);
        res.status(500).send(error);
    }
};



// exports.updateEntry = async (req, res) => {
//     console.log(req.body);
//     const { error } = validateBudgetEntry(req.body);
//     if (error) {
//         console.log('error');
//         return res.status(400).send(error.details[0].message);
//     }

//     try {
//         console.log('Updating entry with ID:', req.params.id);

//         const entry = await BudgetEntry.findByIdAndUpdate(
//             req.params.id,
//             {
//                 name: req.body.name,
//                 price: req.body.price,
//                 date: req.body.date
//             },
//             {
//                 new: true
//             }
//         );

//         if (!entry) {
//             console.log('Entry not found for update:', req.params.id);
//             return res.status(404).send('Entry not found');
//         }

//         console.log('Entry updated successfully:', entry);
//         return res.send(entry);
//     } catch (error) {
//         console.error('Error updating entry:', error);
//         res.status(500).send(error);
//     }
// };

exports.updateEntry = async (req, res) => {
    const { error } = validateBudgetEntry(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const entryId = req.params.id;

        // Find the existing entry to get the old price
        const existingEntry = await BudgetEntry.findById(entryId);
        if (!existingEntry) {
            return res.status(404).send('Entry not found');
        }

        const oldPrice = existingEntry.price;
        const newPrice = req.body.price;

        // Calculate the difference between old and new prices
        const priceDifference = newPrice - oldPrice;

        // Get the user's budget
        const userId = existingEntry.user;
        const user = await User.findById(userId);
        const userBudget = user.budget;

        // Calculate the potential new budget after the entry update
        const potentialNewBudget = userBudget - priceDifference;

        if (potentialNewBudget < 0) {
            // return res.status(400).send('Insufficient budget');
            const notification = 'Insufficient budget: Your budget is negative after the update.';
            user.notifications.push(notification);
            await user.save();
            return res.status(400).send(notification);
        }

        // Update the budget entry
        const entry = await BudgetEntry.findByIdAndUpdate(
            entryId,
            {
                name: req.body.name,
                price: newPrice,
                date: req.body.date
            },
            {
                new: true
            }
        );

        if (!entry) {
            return res.status(404).send('Entry not found');
        }

        // Update the user's budget
        await User.findByIdAndUpdate(userId, { budget: potentialNewBudget });

        console.log('Entry updated successfully:', entry);
        return res.send(entry);
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).send(error);
    }
};




exports.deleteEntry = async(req, res) => {
    try {
        const entry = await BudgetEntry.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).send('Entry not found');
        }

        res.send(entry);
    } catch (error) {
        res.status(500).send(error);
    }
}


exports.getBudgetReport = async (req, res)=>{
    try{
        const userId = req.user._id; // Get the authenticated user's ID
        const entries = await BudgetEntry.find({ user: userId });
        res.status(200).send(entries);
    }
    catch (error) {
        res.status(500).send(error);
    }
}