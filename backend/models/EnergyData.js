const mongoose = require("mongoose");

const energyDataSchema = new mongoose.Schema({
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Building",
        required : true
    },
    month : {
        type: String,
        required :true
    },
    year:{
        type: Number,
        required : true
    },
    unitsConsumed:{
        type: Number,
        required : true
    },
    billAmount:{
        type : Number,
        required: true
    },
    peakLoad:{
        type : Number,
        required : true
    }
}, {timestamps: true});

module.exports = mongoose.model("EnergyData", energyDataSchema);