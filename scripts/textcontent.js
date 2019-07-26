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
        scrollTop : $("#top-c").scrollTop() - $(".legalese-nav").height()// Scroll to top of body
    }, 500);
});

// insert copyright date

let currentYear = `2017 \u2014 ${(new Date()).getFullYear()}`
$("#copyright-date").text(currentYear);

// show various bits of players navbar

$(".sidebar-header").each(function() {
    $(this).click(function() {
	var id = ".sub-" + $(this).attr("href").slice(1);
	$(".left-menu-sub").hide();
	$(id).show();
    });
});

// don't know why I can't just add a css class here

$('.left-menu-item').on('click', function() {
  $('.left-menu-item').css({ "font-weight": "300", "text-decoration": "none" });
  $(this).css({ "font-weight": "700", "text-decoration": "none" });
});

$('.left-menu-item').hover(
  function() {
    $(this).css({ "font-weight": "700", "text-decoration": "none", "color": "#333333" });
  }, function() {
    $(this).css({ "font-weight": "300", "text-decoration": "none" });
  }
);


$(window).on('scroll', function() {
  $('.lower-nav-el').each(function() {
    if($(window).scrollTop() > ($(this).offset().top - 10)) {
      var id = $(this).attr('id');
      $('.left-menu-item').css('font-weight','300');
      $('a[href="#'+ id +'"]').css('font-weight','700');
    }
  });
});

// only affix sidebar if not on mobile

if ($(window).width() > 768) {
  $(".player-nav").affix({
    offset: {
      top: function() {
	return (this.top = $("#blurb-nav-id").offset().top + 65)
      }
    }
  })
}

$(window).resize(function() {
  if ($(window).width() > 767) {
    $("#magic-shift-toggle-bottom").hide();
    $("#magic-shift-toggle").show()
    $(".dropdown.top-justify > a").toggleClass("hvr-underline-from-center")
    $(".dropdown.top-justify > div").toggleClass("hvr-underline-from-center")
  } else {
    $("#magic-shift-toggle").hide();
    $("#magic-shift-toggle-bottom").show()
    $(".dropdown.top-justify > a").toggleClass("hvr-underline-from-center")
    $(".dropdown.top-justify > div").toggleClass("hvr-underline-from-center")
  }
})

if ($(window).width() > 767) {
  $("#magic-shift-toggle-bottom").hide();
  $("#magic-shift-toggle").show()
  $(".dropdown.top-justify > a").addClass("hvr-underline-from-center")
  $(".dropdown.top-justify > div").addClass("hvr-underline-from-center")
} else {
  $("#magic-shift-toggle").hide();
  $("#magic-shift-toggle-bottom").show()
  $(".dropdown.top-justify > a").removeClass("hvr-underline-from-center")
  $(".dropdown.top-justify > div").removeClass("hvr-underline-from-center")
}

// downarrow click

$(".downarrow").click(function() {
  $('html, body').animate({
    scrollTop: $("#top-c").height() - $(".legalese-nav").height()
  }, 500);
});

// fix top button to above bot-container when scrolling

$(window).scroll(function() {
  var bottomHeight = $(".bot-container").height()
  if ($(window).scrollTop() + $(window).height() >= $(".bot-container").offset().top) {
    $("#return-to-top").css({
      "bottom": bottomHeight + 30
    });
    $("#return-to-top-text").css({
      "bottom": bottomHeight + 2
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

// fix bar to bottom for large screens

if ($('body').outerHeight() < $(window).height()) {
  $(".bot-container").addClass("bot-container-fixed")
} else {
  $(".bot-container").removeClass("bot-container-fixed")
}

// set pricetags

function monthly(price, which) {
  const pStr = price.toString()
  if (which) {
    const toreturn = `$${pStr.slice(0,2)}<span class="small-money">${pStr.slice(2)}</span>`
    return toreturn
  } else {
    const p = (pStr / 0.7).toFixed(2) 
    const toreturn = `$${p.slice(0,2)}<span class="small-money">${p.slice(2)}</span>`
    return toreturn
  }
}

accounting.settings = {
  currency: {
    symbol : "$",   // default currency symbol is '$'
    format: "%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal : ".",  // decimal point separator
    thousand: ",",  // thousands separator
    precision : 0   // decimal places
  },
  number: {
    precision : 0,  // default precision on numbers is 0
    thousand: ",",
    decimal : "."
  }
}

function headers(price, which) {
  if (which) {
    return price
  } else {
    return accounting.formatMoney(price/0.7)
  }
}

let which = false

const prices = {
  pro: {
    header: 1400,
    substandard: 1.74,
    subcomplex: 2.34,
  },
  plus: {
    header: 18,
    substandard: 1.74,
    subcomplex: 2.34,
  },
  basic: {
    header: 11,
    substandard: 2.32,
    subcomplex: 3.12,
  },
}

$('#price-toggle').change(function() {
  $('#subheader-pro').hide().html(`$${headers(prices.pro.header, which)}`).fadeIn(500)
  $('#subheader-plus').hide().html(`$${headers(prices.plus.header, which)}`).fadeIn(500)  
  $('#subheader-basic').hide().html(`$${headers(prices.basic.header, which)}`).fadeIn(500)  
  $('#substandard-pro').hide().html(`${monthly(prices.pro.substandard, which)}`).fadeIn(500)
  $('#substandard-plus').hide().html(`${monthly(prices.plus.substandard, which)}`).fadeIn(500)
  $('#substandard-basic').hide().html(`${monthly(prices.basic.substandard, which)}`).fadeIn(500)
  $('#subcomplex-pro').hide().html(`${monthly(prices.pro.subcomplex, which)}`).fadeIn(500)
  $('#subcomplex-plus').hide().html(`${monthly(prices.plus.subcomplex, which)}`).fadeIn(500)
  $('#subcomplex-basic').hide().html(`${monthly(prices.basic.subcomplex, which)}`).fadeIn(500)
  which = !which
})

$(function () {
  $('[data-toggle="popover"]').popover()
})

// show or hide relevant fields based on radio selection

$(function() {
  const emailRadio = $('#comms-email-radio')
  const phoneRadio = $('#comms-phone-radio')
  const eitherRadio = $('#comms-either-radio')

  const emailField = $('#commsEmail')
  const phoneField = $('#commsPhone')

  const weekdayRadio = $('#weekdays-radio')
  const everydayRadio = $('#everyday-radio')

  const weekdayGroup = $('#weekdaysGroup')
  const everydayGroup = $('#everydayGroup')

  emailRadio.change(function() {
    if (emailRadio.prop('checked', true)) {
      emailField.show()
      phoneField.hide()
    } else {
      emailField.hide()
    }
  })

  phoneRadio.change(function() {
    if (phoneRadio.prop('checked', true)) {
      phoneField.show()
      emailField.hide()
    } else {
      phoneField.hide()
    }
  })

  eitherRadio.change(function() {
    if (eitherRadio.prop('checked', true)) {
      emailField.show()
      phoneField.show()
    } else {
      emailField.hide()
      phoneField.hide()
    }
  })

  weekdayRadio.change(function() {
    if (weekdayRadio.prop('checked', true)) {
      weekdayGroup.show()
      everydayGroup.hide()
    } else {
      weekdayGroup.show()
      everydayGroup.hide()
    }
  })

  everydayRadio.change(function() {
    if (everydayRadio.prop('checked', true)) {
      everydayGroup.show()
      weekdayGroup.hide()
    } else {
      everydayGroup.show()
      weekdayGroup.hide()
    }
  })

})

function sendData() {

  $('#formModal').modal('toggle')
  $('#congratsModal').modal('toggle')
  var XHR = new XMLHttpRequest();

  // Bind the FormData object and the form element
  const form = document.getElementById('interestForm')
  var FD = new FormData(form);


  // Define what happens on successful data submission
  XHR.addEventListener("load", function(event) {
    console.log(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", function(event) {
    console.log('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open("POST", "http://localhost/api/email/signup");

  // The data sent is what the user provided in the form
  XHR.send(FD);
}


$(document).ready(function() {
  var c = document.getElementById('celebration-canvas')
  if (c) {
    var ctx = c.getContext('2d');


    var particles = [];

    let startingX = c.width / 2
    let startingY = c.height / 2

    document.getElementById('contrastButtonCelebration').addEventListener('mouseover', function(e){
      startingX = Math.random() * 400
      startingY = Math.random() * 60
      createParticles();
    });


    setTimeout(function(){
      createParticles();
    }, 250);

    draw();

    function draw(){
      
      drawBg();
      incParticles();
      drawParticles();
      window.requestAnimationFrame(draw);
      
    }

    function drawBg(){
      ctx.rect(0, 0, c.width, c.height);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    function drawParticles(){
      for(let i = 0; i < particles.length; i++){
	ctx.beginPath();
	ctx.arc(particles[i].x,
		particles[i].y,
		particles[i].size,
		0,
		Math.PI * 2);
	ctx.fillStyle = particles[i].color;
	ctx.closePath();
	ctx.fill();
      }
    }

    function incParticles(){
      for(let i = 0; i < particles.length; i++){
	particles[i].x += particles[i].velX;
	particles[i].y += particles[i].velY;
	
	particles[i].size = Math.max(0, (particles[i].size - .05));
	
	if(particles[i].size === 0){
	  particles.splice(i, 1);
	}
      }
    }

    function createParticles(){
      for(let i = 0; i < 30; i++){
	particles.push({
	  x: startingX,
	  y: startingY,
	  size: parseInt(Math.random() * 10),
	  color: 'rgb(' + ranRgb() + ')',
	  velX: ranVel(),
	  velY: ranVel()
	});
      }
    }

    function ranRgb(){
      var colors = [
	'255, 122, 206',
	'0, 157, 255',
	'0, 240, 168',
	'0, 240, 120'
      ];
      
      var i = parseInt(Math.floor(Math.random() * Math.floor(4)));
      
      return colors[i];
    }

    function ranVel(){
      var vel = 0;
      
      if(Math.random() < 0.5){
	vel = Math.abs(Math.random());
      } else {
	vel = -Math.abs(Math.random());
      }
      
      return vel;
    }
  }
})
