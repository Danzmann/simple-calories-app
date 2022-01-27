const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FoodEntry = new Schema({
  foodName: {
    type: String,
    default: "",
  },
  caloricValue: {
    type: String,
    default: 0.00,
  },
  eatingTime: {
    type: Date,
    default: new Date(),
  },
  userId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'user'
  }
}, { timestamps: true })

module.exports = mongoose.model("FoodEntry", FoodEntry)
