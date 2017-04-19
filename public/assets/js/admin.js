$(document).ready(function(){
	var screeningData = [{name: "invited", count: 100, color: "#6DB1A5"}, {name: "remaining", count: 0, color: "#4A514B"}];
	drawChart(document.getElementById("screeningChart"), screeningData);
	var consentData = [{name: "complete", count: 80, color: "#6DB1A5"}, {name: "incomplete", count: 20, color: "#4A514B"}];
	drawChart(document.getElementById("consentChart"), consentData);
	var mainSurveyData = [{name: "complete", count: 55, color: "#6DB1A5"}, {name: "incomplete", count: 30, color: "#4A514B"}];
	drawChart(document.getElementById("mainSurveyChart"), mainSurveyData);
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