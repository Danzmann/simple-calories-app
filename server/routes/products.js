const express = require("express")
const { Mongoose } = require("mongoose")
const router = express.Router()
const FoodEntry = require("../models/products.model")

router.post("/:userId", (req, res, next) => {
    if (!req.body.foodName || !req.body.caloricValue) {
      res.statusCode = 500
      res.send({
        name: "missingParams",
        message: "Food name and Caloric values are required",
      })
    } else {
      const entry = new FoodEntry({ 
         foodName: req.body.foodName,
         caloricValue: req.body.caloricValue,
         eatingTime: req.body.eatingTime,
         userId: req.params.userId
        });

        entry.save((err, sEntry) => {
          if (err) {
            res.statusCode = 500
            res.send(err)
          } else {
            sEntry.save()
            res.send({ success: true, sEntry, isAdmin: false })
          }
        })
            
    }
  })
  
module.exports = router