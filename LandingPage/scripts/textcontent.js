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
    if ($(this).scrollTop() >= $("#top-c").height()) {
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : $("#top-c").height() - $(".legalese-nav").height()// Scroll to top of body
    }, 500);
});

// scroll to blurb bar on renavigate

$("li[role=presentation]").click(function() {
    if ($(this).scrollTop() <= $(".title-blurb").offset().top) {
	$('html, body').animate({
            scrollTop: $("#top-c").height() - ($(".legalese-nav").height() * 2)
	}, 500);
    } else {
	$('html, body').animate({
            scrollTop: $(".title-blurb").offset().top // can't retrieve nav height when it's fixed to top
	}, 500);
    }
    $("li[role=presentation] > a > div").removeClass("blurb-nav-highlight");
    $("div", this).addClass("blurb-nav-highlight");
});

$("#early-stage-nav").click(function() {
    $(".player-nav-ancillary").hide();
    $(".player-nav-early-stage").show();
});

$("#ancillary-solutions-nav").click(function() {
    $(".player-nav-early-stage").hide();
    $(".player-nav-ancillary").show();
});

$(window).scroll(function() {
    if ($(this).scrollTop() >= $("#players-content").offset().top) {
	$("#player-nav-accomp").addClass("col-md-offset-3")
    } else {
	$("#player-nav-accomp").removeClass("col-md-offset-3")
    }
});

// fix nav to top

var lastScrollTop = 0;

$(window).scroll(function(event){
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
	$(".legalese-nav").fadeOut(500)
    } else {
	$(".legalese-nav").fadeIn(500)
    };
    lastScrollTop = st;
});

$('.legalese-nav').affix({
    offset: {
 	top: function() {
	    return (this.top = $("#second-container").offset().top)
	}
    }
})

// only affix other-players sidebar if not on mobile

if ($(window).width() > 768) {
    $("#player-nav").affix({
	offset: {
	    top: function() {
		return (this.top = $("#players-content").offset().top)
	    }
	}
    })
}

// downarrow click

$(".downarrow").click(function() {
    $('html, body').animate({
        scrollTop: $("#top-c").height() - $(".legalese-nav").height()
    }, 500);
});

// underline navbar items

/* $(".top-bar-link").click(function() {
 *     $(".top-bar-link > div").css("border-bottom", "0");
 *     $("div", this).css({
 * 	"border-bottom": "0px solid",
 * 	"border-color": "rgba(82, 254, 206, 1)"
 *     }).animate({
 * 	borderWidth: 3
 *     }, 200);
 * });*/

// change color of navbar on scroll, show legalese-logo

$(window).scroll(function() {
    if ($(this).scrollTop() >= $("#first-container").height()) {
	$(".legalese-nav").css("background-color", "#333333");
	$("#top-bar > li > a").css("color", "white");
	$(".fa.fa-twitter").css("color", "white");
	if ($(window).width() < 768) {
	    $(".navbar-collapse").css("background-color", "#333333");
	    $(".navbar-brand.visible-xs-inline > img").attr("src", "images/legalese-section-logo-20160611-croissant-plain-white.png");
	} else {
	    $("#legalese-logo-nav > a > img").attr("src", "images/legalese-section-logo-20160611-croissant-plain-white.png");
	}
    } else {
	$(".legalese-nav").css("background-color", "white");
	$("#top-bar > li > a").css("color", "#333333");
	$("#login").css("color", "rgb(0, 0, 255)");
	$(".fa.fa-twitter").css("color", "#333333");
	if ($(window).width() < 768) {
	    $(".navbar-collapse").css("background-color", "white");
	    $(".navbar-brand.visible-xs-inline > img").attr("src", "images/20160713-b-sq.png");
	} else {
	    $("#legalese-logo-nav > a > img").attr("src", "images/20160713-b-sq.png");
	}
    }
});

// classes for blurb-bar

if ($(window).width() < 768) {
    $("#blurb-nav-id").addClass("nav-justified");
} else {
    $("#blurb-nav-id").removeClass("nav-justified")
}

// fix top button to above bot-container when scrolling

$(window).scroll(function() {
    var bottomHeight = $(".bot-container").height()
    if ($(window).scrollTop() + $(window).height() >= $(".bot-container").offset().top) {
	$("#return-to-top").css({
	    "bottom": bottomHeight + 40
	});
	$("#return-to-top-text").css({
	    "bottom": bottomHeight + 12
	});
    } else {
	$("#return-to-top").css({
	    "bottom": "20px"
	});
	$("#return-to-top-text").css({
	    "bottom": "-8px"
	});
    }
})
	    
