function indi () {
    var navWrapper = document.body.querySelector(".ns-TabWrapper");

    var navLeft = navWrapper.getBoundingClientRect().left;
    
    var sectionBody = document.body.querySelector(".ns-TabBarModule");

    var section = sectionBody.getAttribute("data-activesection") || "A";
    
    var activeElement = navWrapper.querySelector("[data-section='"+section+"'] span")
    
    var textPosition = activeElement.getBoundingClientRect();
    
    var indicator = navWrapper.querySelector(".ns-Indicator");

    indicator.style.transform = "translate3d("+(textPosition.left - navLeft)+"px,0,0) scaleX("+(textPosition.width*0.01)+")";
}

var clickHandler = function() { 

    var thisLink = this.getAttribute("data-section");
    
    var sectionBody = document.body.querySelector(".ns-TabBarModule");

    sectionBody.setAttribute("data-activesection", thisLink);
    
    indi();
};

var anchors = document.querySelectorAll(".ns-TabBar_Link");

for (var i = 0; i < anchors.length; i++) {
    var current = anchors[i];
    current.addEventListener('click', clickHandler, false);
}

// nobrains copy for highlight on blurb bar

function indiX () {
    var navWrapper = document.body.querySelector(".ns-TabWrapperX");

    var navLeft = navWrapper.getBoundingClientRect().left;
    
    var sectionBody = document.body.querySelector(".ns-TabBarModuleX");

    var section = sectionBody.getAttribute("data-activesection") || "A";
    
    var activeElement = navWrapper.querySelector("[data-section='"+section+"'] span")
    
    var textPosition = activeElement.getBoundingClientRect();
    
    var indicator = navWrapper.querySelector(".ns-IndicatorX");

    indicator.style.transform = "translate3d("+(textPosition.left - navLeft)+"px,0,0) scaleX("+(textPosition.width*0.01)+")";
}

var clickHandlerX = function() { 

    var thisLink = this.getAttribute("data-section");
    
    var sectionBody = document.body.querySelector(".ns-TabBarModuleX");

    sectionBody.setAttribute("data-activesection", thisLink);
    
    indiX();
};

indiX();

var anchorsX = document.querySelectorAll(".ns-TabBar_LinkX");

for (var i = 0; i < anchorsX.length; i++) {
    var current = anchorsX[i];
    current.addEventListener('click', clickHandlerX, false);
}
