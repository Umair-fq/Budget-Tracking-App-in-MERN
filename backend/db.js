const { mongoose } = require("mongoose")

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect(process.env.Uri)
        console.log('Connected to Mongodb successfully')
    } catch (err) {
        console.error(err)
        console.log('Failed to connect to Mongodb');
    }
}