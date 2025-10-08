const express = require("express");
const postRoutes = require("./routes/post.routes");
const userRoutes = require('./routes/user.routes.js')
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

const plainPassword = "mySecret123";

async function run() {
    const hashdedPassword = await bcrypt.hash(plainPassword, 10);

    console.log(hashdedPassword);

    let myPassword = "mySecret122";

    let isMatch = await bcrypt.compare(myPassword, hashdedPassword);

    console.log(isMatch);
}

run();

module.exports = app;
