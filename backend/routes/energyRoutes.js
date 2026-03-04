const express = require('express');
const router = express.Router();
const EnergyData = require("../models/EnergyData");
const { execFile } = require("child_process");
const path = require("path");

//Add energy Data
router.post("/add-energy", async (req,res)=>{
    try{
        const energy = new EnergyData(req.body);
        await energy.save();
        res.status(201).json(energy);
    } catch (error){
        res.status(400).json({error : error.message});
    }
});

// Get Energy by building 
router.get("/building/:buildingId", async(req,res)=>{
    try{
        const data = await EnergyData.find({
            buildingId : req.params.buildingId
        }).sort({year:1,month:1});

        res.json(data);
    } catch(error){
        res.status(400).json({error: error.message});
    }
});

router.post("/forecast", (req, res) => {
  const energyValues = req.body.values;

  // Using execFile is safer than exec as it does not spawn a shell,
  // preventing command injection vulnerabilities. It's also more robust.
  const scriptPath = path.join(__dirname, "..", "ml_service", "forecast.py");
  const args = [scriptPath, JSON.stringify(energyValues)];

  execFile("python", args, (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      // stderr often contains useful error details from the script
      console.error(`stderr: ${stderr}`);
      return res
        .status(500)
        .json({ error: "ML service execution failed", details: stderr || error.message });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error(`JSON parsing error: ${parseError}. Raw output: ${stdout}`);
      res.status(500).json({ error: "ML service output parsing failed", details: stdout });
    }
  });
});

module.exports = router;