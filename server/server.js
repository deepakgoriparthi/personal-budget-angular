const express = require('express');
const app = express();
const port = 3000;
const cors=require("cors");

const budget = require('./budget-data.json');
app.use(cors());

app.get('/budget',(req,res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});