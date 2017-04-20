// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/landing.html'));
});

app.get('/welcome', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/welcome.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/register.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/admin.html'));
});

app.get('/adminlogin', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/adminlogin.html'));
});

app.post('/signup', function(req, res) {
	console.log(req);
	var email = req.params.email;
    var password = req.params.password;
    
    var user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);

    user.signUp(null, {
        success: function(user) {
        // Hooray! Let them use the app now.
        console.log("yay, they signed up");
        res.redirect('https://brown.co1.qualtrics.com/jfe/form/SV_6KeyGldHYVWIKln');
    },
        error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        res.status(500).send("Error: " + error.code + " " + error.message);
    }
    });
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
