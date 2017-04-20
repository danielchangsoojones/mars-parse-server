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
