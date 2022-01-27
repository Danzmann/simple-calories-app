const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config()
}

const { connect } = require("./config.js")

connect
  .then(() => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  })

require("./strategies/jwtStrategy")
require("./strategies/localStrategy")
require("./authenticate")

const userRouter = require("./routes/user")

const app = express()

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },

  credentials: true,
}

const Role = require("./models/userRole.model")

function setupUserRoles() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

setupUserRoles()

app.use(cors(corsOptions))

app.use(passport.initialize())

app.use("/users", userRouter)

// Standard health check
app.get("/", function (req, res) {
  res.send({ status: "success" })
})

const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port

  console.log("App started at port:", port)
})