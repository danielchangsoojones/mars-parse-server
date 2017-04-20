//change these with your app keys
var appId = "JFKSKLSDFNJE3857390285";
var masterKey = "LKSDFJKSDJFKLSJKLDFKSJDLF5869493030282";
var serverURL = "http://alcoholandmarijuanastudy.herokuapp.com/parse";
//npm module
global.Parse = require("parse-cloud-debugger").Parse;
//init parse modules
Parse.initialize(appId, masterKey);
Parse.masterKey = masterKey;
Parse.serverURL = serverURL;
process.nextTick(function () {
    //run cloud code
    require('./cloud/main.js');
    console.log("starting local debugging");
    
        Parse.Cloud.run("adminLogIn", {email: "kerri_hayes@brown.edu", password: "projectmars"}, {
                        success: function (result) {
                            console.log("success");
                            console.log(result);
                        },
                        error: function (error) {
                            console.log(error);
                        }
        });


});