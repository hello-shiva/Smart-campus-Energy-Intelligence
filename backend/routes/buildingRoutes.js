const express = require("express");
const router = express.Router();
const Building = require("../models/Building");

//Add Building
router.post("/add-building",async (req,res) =>{
    try{
        const building = new Building(req.body);
        await building.save();
        res.status(201).json(building);
    } catch (error){
        res.status(400).json({error : error.message });
    }
});

//Get all Buildings
router.get("/all-buildings" , async(req,res)=>{
    try{
        const buildings= await Building.find();
        res.json(buildings);
    } catch (error){
        res.status(400).json({error : error.message});
    }
});

module.exports = router;