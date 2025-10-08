const express = require("express"); 
const userRoutes = require('./routes/authRoutes')
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;
