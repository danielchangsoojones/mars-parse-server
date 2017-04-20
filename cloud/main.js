Parse.Cloud.define('signUp', function(req, res) {
	console.log('why');
    var email = req.params.email;
    var password = req.params.password;
    
    var user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);

    user.signUp(null, {
        success: function(user) {
        // Hooray! Let them use the app now.
        res.success(user);
        console.log("yay, they signed up");
    },
        error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        res.error("Error: " + error.code + " " + error.message);
    }
    });
});

Parse.Cloud.define('logIn', function(req, res) {
    var email = req.params.email;
    var password = req.params.password;
    
    Parse.User.logIn(email, password, {
        success: function(user) {
        // Do stuff after successful login.
            res.success(user);
        },
        error: function(user, error) {
        // The login failed. Check error to see why.
            res.error("Error: " + error.code + " " + error.message);
        }
    });
});

Parse.Cloud.define('adminLogIn', function(req, res) {
    var email = req.params.email;
    var password = req.params.password;
    
    if (email == "kerri_hayes@brown.edu") {
            Parse.User.logIn("kerri_hayes@brown.edu", password, {
            success: function(user) {
            // Do stuff after successful login.
            res.success(user);
            },
            error: function(user, error) {
            // The login failed. Check error to see why.
            res.error("Error: " + error.code + " " + error.message);
        }
    });
    }
});
