// move to https
if (location.protocol != 'https:')
    {
	location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

// redirect www.legalese.com, and legalese.github.io domains
// if( window.location.hostname != "legalese.com" ) {
//     window.location.replace("https://legalese.com" + window.location.pathname );
// }
