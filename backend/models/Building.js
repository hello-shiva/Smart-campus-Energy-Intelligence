const mongoose = require("mongoose")

const buildingSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    type : {
        type: String,
        required: true
    },
    numberOfOccupants :{
        type: Number,
        required : true
    },
    areaInSqFt :{
        type: Number,
        required : true
    }
} , {timestamps: true});

module.exports=mongoose.model("Building", buildingSchema);