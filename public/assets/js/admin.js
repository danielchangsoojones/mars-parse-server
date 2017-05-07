$(document).ready(function(){
	var total = document.querySelector('meta[name=total]').content;
	var consent = document.querySelector('meta[name=consent]').content;
	var main = document.querySelector('meta[name=main]').content;
	
	var screeningData = [{name: "invited", count: total, color: "#6DB1A5"}, {name: "remaining", count: Math.max(100 - total, 0), color: "#4A514B"}];
	drawChart(document.getElementById("screeningChart"), screeningData);
	var consentData = [{name: "complete", count: consent, color: "#6DB1A5"}, {name: "incomplete", count: total-consent, color: "#4A514B"}];
	drawChart(document.getElementById("consentChart"), consentData);
	var mainSurveyData = [{name: "complete", count: main, color: "#6DB1A5"}, {name: "incomplete", count: total-main, color: "#4A514B"}];
	drawChart(document.getElementById("mainSurveyChart"), mainSurveyData);
	
	$('#consent-reminder').click(function() {
	  $('#survey-field').val("consent");
	  openOverlay();
	});
	$('#main-reminder').click(function() {
	  $('#survey-field').val("main");
	  openOverlay();
	});
	$('#cancel-button').click(closeOverlay);
});

function drawChart(canvas, values) {
	var total = 0.0;
	values.forEach(function(value) {
		total += value.count;
	});

	var ctx = canvas.getContext("2d");
	var radius = 120;
	var currentTotal = 0.0;

	values.forEach(function(value) { //wedges
		ctx.fillStyle = value.color;
		var startAngle = (currentTotal / total) * 2.0 * Math.PI;
		currentTotal += value.count;
		var endAngle = (currentTotal / total) * 2.0 * Math.PI;
		ctx.beginPath();
		ctx.arc(125, 125, radius, startAngle, endAngle);
		ctx.lineTo(125, 125);
		ctx.fill();
		ctx.closePath();
	});
	
	//outer circle
	ctx.beginPath();
	ctx.arc(125, 125, radius, 0, 2.0*Math.PI);
	ctx.stroke();
	ctx.closePath();
}

function openOverlay() {
	$('#overlay').css("display", "block");
}

function closeOverlay() {
	$('#overlay').css("display", "none");
}