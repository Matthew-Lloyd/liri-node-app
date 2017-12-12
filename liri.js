var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var consumerKey = keys.consumer_key;
var consumerSecret = keys.consumer_secret;
var tokenKey = keys.access_token_key;
var tokenSecret = keys.access_token_secret;
var clientId = keys.client_Id;
var clientSecret = keys.client_Secret;
var omdbKey = keys.apiKey;



var userCMD = process.argv[2];
var userReq = process.argv[3];

switch (userCMD) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        doSomething();
        break;
};


function myTweets() {
    var client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: tokenKey,
        access_token_secret: tokenSecret
    });

    
    client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=@ProjectWrath&count=20', function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var twitDisp = tweets[i];
                console.log(twitDisp.text, "\n", twitDisp.created_at, "\n");
            };
        };
    });
};

function spotify() {
    
    if (userReq === "" || userReq === undefined) {
        track = "The Sign Ace of Base";
    } else {
        track = userReq;
    }


    var spotify = new Spotify({
        id: clientId,
        secret: clientSecret
    });

    spotify.search({type: 'track', query: track, limit: '1'}, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
        for (var i = 0; i < data.tracks.items.length; i++) {
            var spotSearch = data.tracks.items[i];
            //console.log(spotSearch); 
            console.log("\n", spotSearch.artists[0].name, "\n", spotSearch.name, "\n", spotSearch.preview_url, "\n", spotSearch.album.name, "\n");            
        };
    //console.log(track); 
    });
};

function movie() {
    if (userReq === "" || userReq === undefined) {
        movie = "Mr. Nobody";
    } else {
        movie = userReq;
    }
    // console.log(movie);
    // console.log(omdbKey);

    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdbKey;
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log("Title: " + info.Title);
            console.log("Year: " + info.Year);
            console.log("IMDB Rating: " + info.Ratings[0].Value);
            console.log("Rotten Tomatoes: " + info.Ratings[1].Value);
            console.log("Country: " + info.Country);
            console.log("Language: " + info.Language)
            console.log("Plot: " + info.Plot);
            console.log("Actors: " + info.Actors);
        }
    })

    

};

function doSomething() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            random = data.split(",");
            userCMD = random[0];
            userReq = random[1];
            spotify();
        }
    });
};