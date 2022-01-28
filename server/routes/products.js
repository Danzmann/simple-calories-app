const express = require("express")
const router = express.Router()
const FoodEntry = require("../models/products.model")
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function credential_check(req, next) {
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

router.get("/foodEntries", async (req, res, next) => {
  const credentials = await credential_check(req, next)
  if (!credentials) return res.status(401).send("Unauthorized")
  const { isAdmin, userId } = credentials


  if (isAdmin) {
    FoodEntry.find((err, entry) => {
      if (err) return res.status(500).send(err)
      return res.status(200).send(entry)
    }).sort({ eatingTime: -1 }).collation({ locale: "en_US", numericOrdering: true })
  } else {
    FoodEntry.find({ userId: userId }, (err, entry) => {
      if (err) return res.status(500).send(err)
      return res.status(200).send(entry)
    }).sort({ eatingTime: -1 }).collation({ locale: "en_US", numericOrdering: true })
  }
})


router.post("/foodEntries", async (req, res, next) => {
  const credentials = await credential_check(req, next)
  if (!credentials) return res.status(401).send("Unauthorized")
  const {isAdmin, userId } = credentials

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
      eatingTime: req.body.eatingTime || new Date(),
      userId
    });

    entry.save((err, sEntry) => {
      if (err) {
        res.statusCode = 500
        res.send(err)
      } else {
        sEntry.save()
        res.send({ success: true, sEntry })
      }
    })
  }
})

router.put("/foodEntries/:foodEntryId", async (req, res, next) => {
  const credentials = await credential_check(req, next)
  if (!credentials || !credentials.isAdmin) return res.status(401).send("Unauthorized")

  FoodEntry.findByIdAndUpdate(
    req.param.foodEntryId,
    req.body,
    {new: true},
    (err, ent) => {
        if (err) return res.status(500).send(err);
        return res.send(ent);
    })
})

router.delete("/foodEntries/:foodEntryId", async (req, res, next) => {
  const credentials = await credential_check(req, next)
  if (!credentials || !credentials.isAdmin) return res.status(401).send("Unauthorized")

  FoodEntry.findByIdAndRemove(req.params.foodEntryId, (err, entry) => {
    if (err) return res.status(500).send(err);

    const response = {
      message: "Sucessfully delete",
      id: entry._id
    };

    return res.status(200).send(response);
  })
})

async function fetchEntriesData(startDate, endDate) {
  let promise = FoodEntry.find({createdAt: { $gte: startDate, $lt: endDate}})
  return promise  
}

function digestedData(rawData){
  let totalCalories = 0.00
  let entryCount = 0
  let userList = []

  rawData.forEach(entry => {
    totalCalories += entry.caloricValue;
    entryCount += 1;
    userList.push(entry.userId)
  })

  let distinctUserCount = new Set(userList).size;

  const avgCal = distinctUserCount ? (totalCalories / distinctUserCount) : 0;

  return {entryCount, avgCal};
}

router.get("/report", async (req, res, next) => {
  const credentials = await credential_check(req, next)
  if (!credentials || !credentials.isAdmin) return res.status(401).send("Unauthorized")

  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const last2Week = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);

  lastWeekData = await fetchEntriesData(lastWeek, new Date());
  last2WeeksData = await fetchEntriesData(last2Week, lastWeek);

  let {entryCount, avgCal} = digestedData(lastWeekData);

  const lastWeekReport = {
    entriesCreated: entryCount,
    averageCalories: avgCal
  };

  let secondReport = digestedData(last2WeeksData);

  const last2WeeksReport = {
    entriesCreated: secondReport.entryCount,
    averageCalories: secondReport.avgCal
  }

  return res.send({success: true, report: {lastWeekReport, last2WeeksReport}})

})

module.exports = router