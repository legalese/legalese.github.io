$(window).on("load", function() {
    var webAuth = new auth0.WebAuth({
	domain: "legalese.auth0.com",
	clientID: "u6mNNtkHsQU3rA1wI9LMBzr78htT4U6s",
	redirectUri: `${window.location.host}/v2/`,
	audience: 'https://' + "legalese.auth0.com" + '/userinfo',
	responseType: 'token id_token',
	scope: 'openid',
	leeway: 60
    });

    $("#login").click(function(e) {
	e.preventDefault();
	webAuth.authorize();
    });

    function setSession(authResult) {
	// Set the time that the access token will expire at
	var expiresAt = JSON.stringify(
	    authResult.expiresIn * 1000 + new Date().getTime()
	);
	localStorage.setItem('access_token', authResult.accessToken);
	localStorage.setItem('id_token', authResult.idToken);
	localStorage.setItem('expires_at', expiresAt);
    }

    function isAuthenticated() {
	// Check whether the current time is past the
	// access token's expiry time
	var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	return new Date().getTime() < expiresAt;
    }

    function handleAuthentication() {
	webAuth.parseHash(function(err, authResult) {
	    if (authResult && authResult.accessToken && authResult.idToken) {
		window.location.hash = '';
		setSession(authResult);
	    } else if (err) {
		console.log(err);
		alert(
		    'Error: ' + err.error + '. Check the console for further details.'
		);
	    }
	});
    }

    handleAuthentication();
    
})

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

// show various bits of players navbar

$("#early-stage-nav").click(function() {
    $(".player-nav-ancillary").hide();
    $(".player-nav-early-stage").show();
    $(".player-nav-document-gen").hide();
    $(".player-nav-lib-repos").hide();
});

$("#ancillary-solutions-nav").click(function() {
    $(".player-nav-ancillary").show();
    $(".player-nav-early-stage").hide();
    $(".player-nav-document-gen").hide();
    $(".player-nav-lib-repos").hide();
});

$("#document-gen-assembly-nav").click(function() {
    $(".player-nav-ancillary").hide();
    $(".player-nav-early-stage").hide();
    $(".player-nav-document-gen").show();
    $(".player-nav-lib-repos").hide();
});

$("#lib-repos-nav").click(function() {
    $(".player-nav-ancillary").hide();
    $(".player-nav-early-stage").hide();
    $(".player-nav-document-gen").hide();
    $(".player-nav-lib-repos").show();
});

// realign players navbar on scroll

$(window).scroll(function() {
    if ($("#players-content").length) {
	if ($(this).scrollTop() >= $("#players-content").offset().top) {
	    $("#player-nav-accomp").addClass("col-md-offset-3")
	} else {
	    $("#player-nav-accomp").removeClass("col-md-offset-3")
	}
    }
});

// realign informatics navbar on scroll

$(window).scroll(function() {
    if ($("#informatics-content").length) {
	if ($(this).scrollTop() >= $("#informatics-content").offset().top) {
	    $("#informatics-nav-accomp").addClass("col-md-offset-3")
	} else {
	    $("#informatics-nav-accomp").removeClass("col-md-offset-3")
	}
    }
});

// fix nav to top

var lastScrollTop = 0;

$(window).scroll(function(event){
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
	$(".legalese-nav").fadeOut(100)
    } else {
	$(".legalese-nav").fadeIn(100)
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

// only affix sidebar if not on mobile

if ($(window).width() > 768) {
    $("#player-nav").affix({
	offset: {
	    top: function() {
		return (this.top = $("#players-content").offset().top)
	    }
	}
    })
}

if ($(window).width() > 768) {
    $("#informatics-nav").affix({
	offset: {
	    top: function() {
		return (this.top = $("#informatics-content").offset().top)
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

/*
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
 */

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

