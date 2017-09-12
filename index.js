if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const exphbs = require("express-handlebars");
// const helpers = require("./helpers");

const hbs = exphbs.create({
  partialsDir: "views",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Set up public folder for styling and front end javascript
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const EmailService = require("./email_service");

app.get("/email", (req, res) => {
  res.render("email");
});

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

const flash = require("express-flash-messages");
app.use(flash());

app.post("/email/new", (req, res, next) => {
  // Grab the data for the sendMail() options
  const options = {
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.message,
    html: `<p>${req.body.message}</p>`
  };

  // Send it and display the result!
  EmailService.send(options)
    .then(result => {
      req.flash("success", "Sent!");
      console.log("req.flash: ", req.flash);
      res.render("email", { result: JSON.stringify(result, null, 2) });
    })
    .catch(next);
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () =>
  console.log(`listening on port ${app.get("port")}`)
);
