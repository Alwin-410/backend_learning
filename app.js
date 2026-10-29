/*const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
const port = process.env.PORT
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});*/

/*mongodb connection*/
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const app = express();
app.use(express.json());
app.use('/api/user',userRoutes)
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
});
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});