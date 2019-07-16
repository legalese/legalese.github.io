// for scrolltotop arrow

$(window).scroll(function() {
  if ($(this).scrollTop() >= $("#first-container").height()) {
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
  if (which) {
    return price
  } else {
    return (price / 0.7).toFixed(2)
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
    return accounting.formatMoney(price*0.7)
  }
}

let which = false

const prices = {
  pro: {
    header: 2000,
    substandard: 1.74,
    subcomplex: 2.34,
  },
  plus: {
    header: 25,
    substandard: 1.74,
    subcomplex: 2.34,
  },
  basic: {
    header: 15,
    substandard: 2.32,
    subcomplex: 3.12,
  },
}

$('#price-toggle').change(function() {
  $('#subheader-pro').hide().html(`$${headers(prices.pro.header, which)}`).fadeIn(500)
  $('#subheader-plus').hide().html(`$${headers(prices.plus.header, which)}`).fadeIn(500)  
  $('#subheader-basic').hide().html(`$${headers(prices.basic.header, which)}`).fadeIn(500)  
  $('#substandard-pro').hide().html(`$${monthly(prices.pro.substandard, which)}`).fadeIn(500)
  $('#substandard-plus').hide().html(`$${monthly(prices.plus.substandard, which)}`).fadeIn(500)
  $('#substandard-basic').hide().html(`$${monthly(prices.basic.substandard, which)}`).fadeIn(500)
  $('#subcomplex-pro').hide().html(`$${monthly(prices.pro.subcomplex, which)}`).fadeIn(500)
  $('#subcomplex-plus').hide().html(`$${monthly(prices.plus.subcomplex, which)}`).fadeIn(500)
  $('#subcomplex-basic').hide().html(`$${monthly(prices.basic.subcomplex, which)}`).fadeIn(500)
  which = !which
})

$(function () {
  $('[data-toggle="popover"]').popover()
})
