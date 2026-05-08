const mongoose = require('mongoose');
const { Report } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to DB. Deleting all reports...');
    await Report.deleteMany({});
    console.log('All reports deleted.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
