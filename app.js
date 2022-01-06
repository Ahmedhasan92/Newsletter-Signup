const express=require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");
const app =express();


app.use(express.urlencoded({extended : true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName=req.body.firstName;
    const lastName= req.body.lastName;
    const email = req.body.email;
    // console.log(firstName+ " "+ lastName+" "+ email);

    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData=JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/7275ec879a"

    const Option = {
        method : "POST",
        auth : "Ahmed:17d1e566b5b82656aa25e4451f053a2c-us6"
    }
    const request=https.request(url, Option, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            if(response.statusCode===200 && JSON.parse(data).error_count==0){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
            }
        });
        
    });
    request.write(jsonData);
    request.end();
})

app.post("/failure.html", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})


//apikey
// 17d1e566b5b82656aa25e4451f053a2c-us6

// Listid
// 7275ec879a