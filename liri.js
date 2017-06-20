//
// Link to all the required packages
//
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");

var args = process.argv;      //collect arguments

var task = args[2]; //take first argument as keyword
var query = "";     //create variable to hold query

//loop to populate query
for(var x=3;x<args.length;x++){
  query += args[x] + " ";
}
console.log("Query: "+ query);    //log the query

//Function to seach spotify and return tack details
var spotSearch = function(query){
  var spotQuery = "The Sign Ace of Base";     //default spotify search

  if(query !== ""){
   spotQuery = query;   //if the query is not empty then set spotQuery to imputted query
  }

  //use Spotify constructer to create new spotify instance
  var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,             //import spotify keys from keys.js
    secret: keys.spotifyKeys.client_secret,
  });

  //search spotify for a track using the spotQuery variable
  spotify.search({ type: 'track', query: spotQuery}, function(err, data){
    if(err) {
      return console.log('Error occured: ' + err);    //log any errors
    }
    //Print out desired song information
    //console.log(data);
    // console.log(JSON.stringify(data.tracks.items[0], null, 2));
    console.log("Artist name: " + data.tracks.items[0].artists[0].name);
    console.log("Track name: " + data.tracks.items[0].name);
    console.log("Preview_url: " + data.tracks.items[0].preview_url);
    console.log("Album title: " + data.tracks.items[0].album.name );
});
};

//function to retrieve tweets
var getTweets = function(){
  //use Twitter constructer to create new instance using imported keys
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  //set parameter for how many tweets to retrieve
  var params = {count: 20};

  //get the user's (associated to the access tokens) tweets
  client.get('statuses/user_timeline', params, function(error, tweets, response){

    //if no error preint out the 20 tweets
  if(!error){
    for(var x=0;x<tweets.length;x++){
    console.log("Created at: " + tweets[x].created_at);
    console.log("User: " + tweets[x].user.screen_name);
    console.log("Tweet: " + tweets[x].text);
    console.log("\n");
    }
  }
  //if error log error
  else{
    console.log(error);
  }
});
};
//funciton to search omdb site for movie
var searchMovie = function(query){
  var omdbQuery = "Mr. Nobody";   //default movie query

  if(query !== ""){
    omdbQuery = query;    //if query isn't empty set ombdQuery to inputted query
  }
  //new request to omdb api using omdbQuery variable
  request('https://www.omdbapi.com/?apikey=40e9cece&t=' + omdbQuery, function(error, response, body){
    if(!error){
      console.log(body);
    }
  });
};

//funciton to read file and do what the command says
var fsRead = function(){

// using node file system read file "random text"
  fs.readFile("random.txt", "utf8", function(error, data){
    // if error log the error
    if(error){
      console.log(error);
    }
    else{
      var args = data.split(","); //split the returned data by , and place in an array
        task = args[0];   //take first index and set equal to the task

        // loop for the rest of the leangth of the array (if there is one) and formulate query
        for(var i = 1;i<args.length;i++){
          query += args[i] + " ";
          }
          //execute main logic
      main();
    }
});
};

//main logic function
function main(){
  //switch case to procecss tasks
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
      fsRead();
      break;
    }
}

//when file is run execture the main logic
main();
