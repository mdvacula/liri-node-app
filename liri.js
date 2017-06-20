var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");

var args = process.argv;      //collect arguments

var task = args[2]; //take first argument as keyword
var query = "";     //create variable to hold query

//loop to populate query
for(var x=3;x<args.length;x++){
  query += args[x] + " ";
}
console.log("Query: "+ query);

//Function to seach spotify and return tack details
var spotSearch = function(query){
  var spotQuery = "The Sign Ace of Base";

  if(query !== ""){
   spotQuery = query;
  }

  var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret,
  });

  spotify.search({ type: 'track', query: spotQuery}, function(err, data){
    if(err) {
      return console.log('Error occured: ' + err);
    }
    //console.log(data);
    console.log(JSON.stringify(data.tracks.items[0], null, 2));
    console.log("Artist name: " + data.tracks.items[0].artists[0].name);
    console.log("Track name: " + data.tracks.items[0].name);
    console.log("Preview_url: " + data.tracks.items[0].preview_url);
    console.log("Album title: " + data.tracks.items[0].album.name );
});
};

var getTweets = function(){
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response){


  if(!error){
    for(var x=0;x<tweets.length;x++){
    console.log("Created at: " + tweets[x].created_at);
    console.log("User: " + tweets[x].user.screen_name);
    console.log("Tweet: " + tweets[x].text);
    console.log("\n");
    }
  }
  else{
    console.log(error);
  }
});
};

var searchMovie = function(query){
  var omdbQuery = "Mr. Nobody";

  if(query !== ""){
    omdbQuery = query;
  }

  request('https://www.omdbapi.com/?apikey=40e9cece&t=' + omdbQuery, function(error, response, body){
    if(!error){
      console.log(body);
    }
  });
};

switch(task){
  case "my-tweets":
    getTweets();
    break;

  case "spotify-this-song":
    spotSearch(query);
    break;

  case "movie-this":
    searchMovie(query);
    break;
  case "do-what-it-says" :

    break;
}
