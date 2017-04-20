$(document).ready(function(){
	$('#email-field').blur(validateEmail);
	$('#password-field').blur(validatePassword);
	$('#confirm-password-field').blur(validatePassword);
	$('#register-form').submit(function(event) {
		
		if(!validateEmail() || !validatePassword()) {
			event.preventDefault();
		}
	});
});

function validateEmail() {
	var email = $('#email-field').val();
	var regex1 = /^.*@rutgers.edu$/;
	var regex2 = /^.*@uw.edu$/;
	var regex3 = /^.*@uri.edu$/;
	if(email.match(regex1) || email.match(regex2) || email.match(regex3)) {
		$('#email-error').html("");
		return true;
	}
	$('#email-error').html("Invalid address. Please use the email from your university.");
	return false;
}

function validatePassword() {
	var pass1 = $('#password-field').val();
	var pass2 = $('#confirm-password-field').val();
	if(pass1 == "" || pass2 == "") {
		$('#password-error').html("");
		return false;
	}
	if(pass1 == pass2) {
		$('#password-error').html("");
		return true;
	}
	$('#password-error').html("Passwords must match.");
	return false;
}