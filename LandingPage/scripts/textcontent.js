// hide and show relevant sections

$( "#investornotice" ).click(function(e) {
    e.preventDefault();
    $( "#complegal-content" ).hide();
    $( "#players-content" ).hide();
    $( "#statusquo-content" ).hide();
    $( "#informatics-content" ).hide();
    $( "#investornotice-content" ).show();
});

$( "#statusquo" ).click(function(e) {
    e.preventDefault();
    $( "#complegal-content" ).hide();
    $( "#players-content" ).hide();
    $( "#investornotice-content" ).hide();
    $( "#informatics-content" ).hide();
    $( "#statusquo-content" ).show();
});

$( "#informatics" ).click(function(e){
    e.preventDefault();
    $( "#statusquo-content" ).hide();
    $( "#players-content" ).hide();
    $( "#investornotice-content" ).hide();
    $( "#complegal-content" ).hide();
    $( "#informatics-content" ).show();
});

$( "#complegal" ).click(function(e) {
    e.preventDefault();
    $( "#statusquo-content" ).hide();
    $( "#players-content" ).hide();
    $( "#investornotice-content" ).hide();
    $( "#informatics-content" ).hide();
    $( "#complegal-content" ).show();
});

$( "#players" ).click(function(e) {
    e.preventDefault();
    $( "#complegal-content" ).hide();
    $( "#statusquo-content" ).hide();
    $( "#investornotice-content" ).hide();
    $( "#informatics-content" ).hide();
    $( "#players-content" ).show();
});

// for scrolltotop arrow

$(window).scroll(function() {
    if ($(this).scrollTop() >= $("#first-container").height() + $("#second-container").height()) {
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : $("#first-container").height() + $("#second-container").height() - $(".legalese-nav").height()// Scroll to top of body
    }, 500);
});

// scroll to blurb bar on renavigate

$(".ns-TabBar_LinkX").click(function() {
    $('html, body').animate({
        scrollTop: $("#first-container").height() + $("#second-container").height() - $(".legalese-nav").height()
    }, 500);
});

$('.legalese-nav').affix({
    offset: {
	top: $("#second-container").offset().top
    }
})

// downarrow click

$(".downarrow").click(function() {
    $('html, body').animate({
        scrollTop: $("#first-container").height() + $("#second-container").height() - $(".legalese-nav").height()
    }, 500);
});
