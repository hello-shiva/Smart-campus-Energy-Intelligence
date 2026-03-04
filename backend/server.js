const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const buildingRoutes = require("./routes/buildingRoutes");
const energyRoutes = require("./routes/energyRoutes");

const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use("/api/buildings",buildingRoutes);
app.use("/api/energy",energyRoutes);

//Test rule
app.get("/",(req,res)=>{
    res.send("Smart Campus Energy Background Running...");
});

//connecting database=mongodb
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongo DB Connected..."))
.catch(err => console.log(err));

const port= 5000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

