const express = require("express")
const router = express.Router()
const FoodEntry = require("../models/products.model")
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")

router.get("/foodEntries", async (req, res, next) => {
  const credentials = await credential_check(req)
  if (!credentials) return res.status(401).send("Unauthorized")
  const { isAdmin, userId } = credentials


  if (isAdmin) {
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
})


router.post("/foodEntries", async (req, res, next) => {
  const credentials = await credential_check(req)
  if (!credentials) return res.status(401).send("Unauthorized")
  const { isAdmin, userId } = credentials

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
      foodPrice: req.body.foodPrice,
      eatingTime: req.body.eatingTime,
      userId
    });

    entry.save((err, sEntry) => {
      if (err) {
        res.statusCode = 500
        res.send(err)
      } else {
        sEntry.save()
        res.send({ success: true, sEntry, isAdmin: isAdmin })
      }
    })
  }
})

router.put("/foodEntries", async (req, res, next) => {
  const credentials = await credential_check(req)
  if (!credentials || !credentials.isAdmin) return res.status(401).send("Unauthorized")

  FoodEntry.findById(req.body.foodEntryId, (err, ent) => {
    if (err) return res.status("Failed")
    ent.foodName =     req.body.foodName ?     req.body.foodName :     ent.foodName
    ent.caloricValue = req.body.caloricValue ? req.body.caloricValue : ent.caloricValue
    ent.foodPrice =    req.body.foodPrice ?    req.body.foodPrice :    ent.foodPrice
    ent.eatingTime =   req.body.eatingTime ?   req.body.eatingTime :   ent.foodName

    console.log(ent)

    ent.save(() => {res.sendStatus(204)})
  })
})


async function credential_check(req) {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const userId = payload._id
      return await User.findOne({ _id: userId }).then(
        user => {
          if (user) {
            const tokenIndex = user.refreshToken.findIndex(
              item => item.refreshToken === refreshToken
            )
            if (tokenIndex === -1) {
              return null
            } else {
              return { isAdmin: user.isAdmin, userId: user._id }
            }
          } else {
            return null
          }
        },
        err => next(err)
      )
    } catch (err) {
      return null
    }
  } else {
    return null
  }
}

module.exports = router