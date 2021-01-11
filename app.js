const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// sending home page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signUp.html");
});
// after clicking on submit button in home page
app.post("/", function (req, res) {
    const firsName = req.body.Fname;
    const lastName = req.body.Lname;
    const email = req.body.Email;
    console.log("The name is:" + firsName)
    // filling mailchimp object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firsName,
                    LNAME: lastName
                }
            }
        ]
    };
    // JSON parsing
    const jsonData = JSON.stringify(data);
    // API endpoint/path/list id
    const url = "https://us7.api.mailchimp.com/3.0/lists/49e1cb7f14 ";
    const options = {
        method: "POST",
        auth: "bla-bla-bla:28859034fba8e83820ed432a69a840c7-us7"
    };
    // API POST call
    const request = https.request(url, options, function (response) {
        console.log("Status Cooode: " + response.statusCode)
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});
// routing to home page
app.post("/failure", function (req, res) {
    res.redirect("/")
});

// Running server
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// LIST id
// 49e1cb7f14  
// APP ID
// 28859034fba8e83820ed432a69a840c7-us7