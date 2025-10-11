import app from './app.js';
import dotenv from 'dotenv';
import dbConect from './config/dbConect.js';
dotenv.config();
const DATABASEURL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
dbConect(DATABASEURL);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
