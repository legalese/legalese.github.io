
$.when(compiler(), io(), google(), indesign()).done(function(c1, c2, c3, c4) {

    var githubData = [];

    var compiler = c1[0];
    var io = c2[0];
    var google = c3[0];
    var indesign = c4[0];

    io.forEach(function(item) {
	var user = {
	    login: item.login,
	    contributions: item.contributions
	};
	githubData.push(user);
    });

    getItem(compiler, githubData);
    getItem(google, githubData);
    getItem(indesign, githubData);

    githubData.sort(function (a, b) {
	return b.contributions - a.contributions;
    });
    
    githubData.forEach(function(item) {
	$("#second-container > div").append("<div class='flipcard col-md-2 text-center center-block'><div class='front'><p>"
					  + item.login + "<br>" + item.contributions + " git commits"
					  + "</p></div><div class='back'>"
					  + "<img src='images/20160713-b-sq.png' class='img-responsive'>"
	                                  + "</div></div>")
    });


    $(".flipcard").flip({
	trigger: 'hover'
    });
    
});



function getItem(repo, git) {
    repo.forEach(function(item) {
	git.forEach(function(it) {
	    if (item.login !== it.login) {
		return;
	    } else {
		it.contributions += item.contributions;
	    }
	});
    });
}
    

function compiler() {
    return $.ajax({
	url: "https://api.github.com/repos/legalese/legalese-compiler/contributors"
    })
}

function io() {
    return $.ajax({
	url: "https://api.github.com/repos/legalese/legalese.github.io/contributors"
    })
}

function google() {
    return $.ajax({
	url: "https://api.github.com/repos/legalese/legalese-google-app/contributors"
    })
}

function indesign() {
    return $.ajax({
	url: "https://api.github.com/repos/legalese/legalese-indesign/contributors"
    })
}
