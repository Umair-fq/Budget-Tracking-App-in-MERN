const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const budgetEntriesSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true},
    userBudget: { type: Number }
}); 

const BudgetEntry = mongoose.model('budgetEntries', budgetEntriesSchema);

const validateBudgetEntry = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Entry Name'),
        price: Joi.number().required().label('Price'),
        date: Joi.date().required().label('Date')
    });
    return schema.validate(data);
}


module.exports = { BudgetEntry, validateBudgetEntry}