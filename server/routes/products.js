const express = require("express")
const router = express.Router()
const FoodEntry = require("../models/products.model")
const User = require("../models/user.model")
const Role = require("../models/userRole.model")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate")

router.get("/foodEntries", (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const userId = payload._id
      User.findOne({ _id: userId }).then(
        user => {
          if (user) {
            const tokenIndex = user.refreshToken.findIndex(
              item => item.refreshToken === refreshToken
            )
            if (tokenIndex === -1) {
              res.statusCode = 401
              res.send("Unauthorized")
            } else {
              if (user.isAdmin) {
                FoodEntry.find((err, entry) => {
                  if (err) return res.status(500).send(err)
                  return res.status(200).send(entry)
                })
              } else {
                FoodEntry.find({ userId: userId }, (err, entry) => {
                  if (err) return res.status(500).send(err)
                  return res.status(200).send(entry)
                })
              }
            }
          } else {
            res.statusCode = 401
            res.send("Unauthorized")
          }
        },
        err => next(err)
      )
    } catch (err) {
      res.statusCode = 401
      res.send("Unauthorized")
    }
  } else {
    res.statusCode = 401
    res.send("Unauthorized")
  }
})

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

router.get("/:userId", (req, res, next) => {
  FoodEntry.find({})
})

function isUserAdmin(user) {

}

module.exports = router