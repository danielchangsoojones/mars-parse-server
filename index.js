// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var unirest = require('unirest');
var mailgun_domain = "sandbox6397671ea3094abda6a3af154dc62eaf.mailgun.org";
var mailgun_api_key = "key-2ae9b07c4828f29a10980aea8f37805c";
var mailgun = require('mailgun-js')({apiKey: mailgun_api_key, domain: mailgun_domain});
var mongoose = require('mongoose');
mongoose.Promise = require('es6-promise').Promise;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'Fhr8Q9SD^wSfe', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var db = mongoose.connection;
db.on('error', console.error);

mongoose.connect(databaseUri);
var surveyCompletionSchema = new mongoose.Schema({
  email: String,
  screening: Boolean,
  consent: Boolean,
  main: Boolean
});
var SurveyCompletion = mongoose.model('SurveyCompletion', surveyCompletionSchema);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var store = new MongoDBStore({
  uri: databaseUri || 'mongodb://localhost:27017/dev',
  collection: 'sessions'
});

app.use(session({
  secret: '??????????',
  cookie: {},
  store: store,
  resave: true,
  saveUninitialized: true
}));

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


function isLoggedIn(req, res, next) {
  var serverurl = process.env.SERVER_URL || 'http://localhost:1337/parse';
  unirest.get(serverurl + '/users/me').headers({
    'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
    'X-Parse-Session-Token': req.session.token,
    'X-Parse-REST-API-Key': process.env.MASTER_KEY || 'Fhr8Q9SD^wSfe'
  }).send({}).end(function(userData) {
    if (userData.status == 200) {
      req.user = userData.body;
      next();
    } else {
	  res.redirect('/login');
    }
  });
}

function isAdmin(req, res, next) {
  if(req.user.email == "kerri_hayes@brown.edu") {
    next();
  } else {
    res.redirect('/adminlogin');
  }
}

function sendReminderEmail(survey, subject, body) {
  var condition = {};
  condition[survey] = false;
  SurveyCompletion.find(condition, function(err, users) {
    if(err) {
      console.log(err);
    }
    users.forEach(function(user) {
      console.log(user);
	  var maildata = {
        from: 'Project SAM <noreply@sandbox6397671ea3094abda6a3af154dc62eaf.mailgun.org>',
        to: user.email,
        subject: subject,
        text: body
      };
 
      mailgun.messages().send(maildata, function (error, body) {
        console.log(body);
      });
    });
  });
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/landing.html'));
});

app.get('/welcome', isLoggedIn, function(req, res) {
  res.sendFile(path.join(__dirname, '/public/welcome.html'));
});

app.get('/login', function(req, res) {
  req.session.token = null;
  res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.post('/login', function(req, res) {
  Parse.Cloud.run('logIn', {email: req.body.email, password: req.body.password}, {
    success: function(user) {
      req.session.token = user.getSessionToken();
      res.redirect('/welcome');
    },
    error: function(error) {
      console.log(error);
      res.redirect('/login');
    },
  });
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/register.html'));
});

app.get('/admin', isLoggedIn, isAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, '/public/admin.html'));
});

app.get('/adminlogin', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/adminlogin.html'));
});

app.post('/adminlogin', function(req, res) {
  Parse.Cloud.run('adminLogIn', {email: req.body.email, password: req.body.password}, {
    success: function(user) {
      req.session.token = user.getSessionToken();
      res.redirect('/admin');
    },
    error: function(error) {
      console.log(error);
      res.redirect('/adminlogin');
    },
  });
});

app.post('/signup', function(req, res) {
  Parse.Cloud.run('signUp', {email: req.body.email, password: req.body.password}, {
    success: function(user) {
      req.session.token = user.getSessionToken();
      res.redirect('https://brown.co1.qualtrics.com/jfe/form/SV_6KeyGldHYVWIKln');
    },
    error: function(error) {
      console.log(error);
      res.redirect('/register');
    },
  });
});

app.post('/sendreminder', isLoggedIn, isAdmin, function(req, res) {
  sendReminderEmail(req.body.survey, req.body.subject, req.body.message);
  res.redirect("/admin");
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
