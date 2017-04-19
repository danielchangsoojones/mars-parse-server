$(document).ready(function(){
	$('#email-field').blur(validateEmail);
	$('#password-field').blur(validatePassword);
	$('#register-form').submit(function(event) {
		if(!validateEmail() || !validatePassword()) {
			event.preventDefault();
		}
	});
});

function validateEmail() {
	var email = $('#email-field').val();
	if(email == "") {
		$('#email-error').html("Enter your username/email.");
		return false;
	}
	$('#email-error').html("");
	return true;
}

function validatePassword() {
	var pass = $('#password-field').val();
	if(pass == "") {
		$('#password-error').html("Enter your password.");
		return false;
	}
	$('#password-error').html("");
	return true;
}