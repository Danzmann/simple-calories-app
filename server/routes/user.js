const express = require("express")
const router = express.Router()
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

router.get("/info", verifyUser, (req, res, next) => {
  res.send(req.user)
})

router.post("/signup", (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName) {
    res.statusCode = 500
    res.send({
      name: "FirstNameError",
      message: "The first name is required",
    })
  } else {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          user.firstName = req.body.firstName
          user.lastName = req.body.lastName || ""
          const token = getToken({ _id: user._id })
          const refreshToken = getRefreshToken({ _id: user._id })
          user.refreshToken.push({ refreshToken })

          user.save((err, sUser) => {
            if (err) {
              res.statusCode = 500
              res.send(err)
            } else {
              // By default, we add a "User" role to all users, there is currently no method to add an admin via API
              Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                  res.status(500).send({ message: err })
                  return
                }
                sUser.roles.push(role._id)
                sUser.save()
              })

              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
              // Currently, in the scope of this project, all new created users are regular users, admins must be created directly in DB
              res.send({ success: true, token, user, isAdmin: false })
            }
          })
        }
      }
    )
  }
})

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const token = getToken({ _id: req.user._id })
  const refreshToken = getRefreshToken({ _id: req.user._id })
  User.findById(req.user._id).then(
    user => {
      user.refreshToken.push({ refreshToken })
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          // :todo For now there is only one role so we get it by index 0
          Role.findById(user.roles[0]).then(
            role => {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
              res.send({ success: true, token, user, isAdmin: role.name === 'admin' })
            },
            err => next(err)
          )
        }
      })
    },
    err => next(err)
  )
})

router.post("/refreshToken", (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const userId = payload._id
      User.findOne({ _id: userId }).then(
        user => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refreshToken.findIndex(
              item => item.refreshToken === refreshToken
            )
            if (tokenIndex === -1) {
            }

            if (tokenIndex === -1) {
              res.statusCode = 401
              res.send("Unauthorized")
            } else {
              const token = getToken({ _id: userId })
              // If the refresh token exists, then create new one and replace it.
              const newRefreshToken = getRefreshToken({ _id: userId })
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
              user.save((err, user) => {
                if (err) {
                  res.statusCode = 500
                  res.send(err)
                } else {
                  // :todo For now there is only one role so we get it by index 0
                  Role.findById(user.roles[0]).then(
                    role => {
                      res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                      res.send({ success: true, token, isAdmin: role.name === 'admin' })
                    },
                    err => next(err)
                  )
                }
              })
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

router.get("/logout", verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  User.findById(req.user._id).then(
    user => {
      const tokenIndex = user.refreshToken.findIndex(
        item => item.refreshToken === refreshToken
      )

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
      }

      user.save((err) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS)
          res.send({ success: true })
        }
      })
    },
    err => next(err)
  )
})

module.exports = router