/*global $ */

var c_green = '#449d44';
var c_yellow = 'yellow';
var c_red = 'red';
var t_start_secs = 90;
var t_status = 'off';
var current_slideshow = null;
var current_slide_number = 1;

var timer = new easytimer.Timer();

var slideshows = {


	'Introduction': {
		type: 'div',
		slide_path: './',
		num_slides: 1,
		title: "Introduction / Meeting Format"
	},
	'cornerstone6am': {
		type: 'div',
		num_slides: 1,
		title: "Cornerstone 6am Group Conscience"
	},

};

function resetTimer() {
	timer.stop();
	$('.timer-box').css('color', c_green);
	var min = Math.floor(t_start_secs / 60);
	var secs = t_start_secs % 60 + ''; // convert to string
	secs = (secs.length > 1) ? secs : '0'+secs; //zero pad

	var str = min + ':' + secs;

	$('#timer-val').text(str);
	t_status = 'off';
};

function setTimerDuration(seconds) {
	t_start_secs = seconds;
	if (t_start_secs < 60) {
		$('#first-round-time').text(seconds)
		$('#first-round-time-word').text('seconds')
	}
	else {
		$('#first-round-time').text((t_start_secs / 60));
		let w = "minute";
		if (t_start_secs > 60) w += 's';
		$('#first-round-time-word').text(w);

	}
	resetTimer();
}


$(function() {


	for (var sn in slideshows) {
		var title = slideshows[sn].title;
		$('#slideshow_chooser').append('<option value="' + sn + '">' + title + '</option>');

	}

	$('#slideshow_chooser').selectmenu({

		width: 600,

		change: function(event, ui) {

			if (this.value == 'choose') {
				current_slideshow = null;
				return;
			}

			console.log(this.value);
			loadSlideshow(this.value);

		}

	});


	var loadSlideshow = function(slideshow_name) {

		s = slideshows[slideshow_name];

		console.log(s)

		current_slide_number = 1;


		current_slideshow = slideshow_name;

		if (s.type == 'image') {

			$("#current-slide-div").hide();
			$('#current-slide-img').attr('src', s.slide_path + '/slide' + current_slide_number + '.jpg').show();

		}
		else if (s.type == 'div') {

			console.log('in here');

			var content_div = $('#' + slideshow_name + '-slide' + current_slide_number);

			$('#current-slide-img').hide();
			$("#current-slide-div").html(content_div.html()).show();

		}



	};

	$('#prev-slide').click(function(){

		if (current_slideshow === null) return;
		s = slideshows[current_slideshow];

		if (current_slide_number == 1) return;


		current_slide_number -= 1;
		$('#current-slide-img').attr('src', s.slide_path + '/slide' + current_slide_number + '.jpg');


	});
	$('#next-slide').click(function(){

		if (current_slideshow === null) return;
		s = slideshows[current_slideshow];

		if (current_slide_number == s.num_slides) return;


		current_slide_number += 1;
		$('#current-slide-img').attr('src', s.slide_path + '/slide' + current_slide_number + '.jpg');


	});


	//resetTimer();

	setTimerDuration(t_start_secs);

	$(".timer-box").draggable().resizable().fitText(.45);

	$("#settings-button").button({
		icon: "ui-icon-gear",
        showLabel: false
	}).click(function(e){

		$("#settings-box").toggle();

	});


	$("#set-timer-slider").slider({

		range: "min",
		value: 90,
		min: 30,
		step: 30,
		max: 1200,
		slide: function( event, ui ) {
			setTimerDuration(ui.value);
		}

	});

	$("#hide-clock-button").button().click(function(e){
		$(".timer-box").toggle(100, function(){
			if ($(this).not(":visible")) {
				$("#settings-box").hide();
			}

		});
	});


	timer.addEventListener('secondsUpdated', function (e) {


		var secs = timer.getTimeValues().seconds;
		
		var min = timer.getTimeValues().minutes;

		var totalsecs = secs + (min * 60);

		secs = secs + '' // convert to string
		secs = (secs.length > 1) ? secs : '0'+secs; //zero pad

		var str = min + ':' + secs;
		
		$('#timer-val').text(str);
	

		if (totalsecs > (((t_start_secs - 10) / 3) * 2)) {
			$('.timer-box').css('color', c_green);
		}
		else if (totalsecs > 20) {
			$('.timer-box').css('color', c_yellow);
		}
		else {
			$('.timer-box').css('color', c_red);
		}

	});


	//$('#timer-start').click(function(){

	//	timer.start({countdown: true, startValues: {seconds: t_start_secs}});
	//	t_status = 'on';

	//});
	//$('#timer-stop').click(function(){

	//	timer.stop();
	//	t_status = 'off';

	//});
	//$('#timer-reset').click(function(){

	//	resetTimer();

	//});

	$('.timer-box').click(function(){

		if (t_status == 'off') {
			timer.start({countdown: true, startValues: {seconds: t_start_secs}});
			t_status = 'on';
		}
		else if (t_status == 'paused') {
			timer.start();
			t_status = 'on';

		}
		else {
			timer.pause();
			t_status = 'paused';
		}

	}).dblclick(resetTimer);


	loadSlideshow('Introduction');


});
