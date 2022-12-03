// All the required modules are installed using npm i and required in the program

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

// Creating express app
// express app is used for post and get
const app = express();

// Using static to send css and images by saving them in public folder
app.use(express.static(`${__dirname}/public`));

// Using body parser to acess form data
app.use(bodyParser.urlencoded({ extended: true }));

// TO show the home page when acessed by get
app.get("/", function (req, res) {
  // loading html file
  res.sendFile(__dirname + "/templates/signup.html");
});

// Posting to route when form is submitted
app.post("/", function (req, res) {
  const firstName = req.body.first;
  const lastName = req.body.last;
  const emailId = req.body.emailId;

  // Sending data to Mailchimp
  const data = {
    members: [
      {
        email_address: emailId,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Converting data to JSON format
  const jsonData = JSON.stringify(data);

  // Mailchimp api endpoint
  const url = "https://us21.api.mailchimp.com/3.0/lists/e0748e0ad6";

  // Options for https
  const options = {
    method: "POST",
    auth: "pavan:" + process.env.API_Key,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/templates/success.html");
    } else {
      res.sendFile(__dirname + "/templates/failure.html");
    }

    // Acessing the received data
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});


