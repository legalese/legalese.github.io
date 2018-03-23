function test(investor, term, expected) {
    results.total++;
    var result = getShares(investor, term);
    if (Math.floor(result) !== expected) {
	results.bad++;
	console.log("Expected " + expected + ", but got " + result);
    }
}

var results = {
    total: 0,
    bad: 0
}

var testObject = [
    [
	{ amount: 100000,
	  cap: 5000000,
	  discount: ""
	},
	{ premoney: 10000000,
	  amountraising: 1000000,
	  companycap: 11000000,
	  newshares: 1100110,
	  pricepershare: 0.909
	}
    ],
    [
	{ amount: 100000,
	  cap: 4000000,
	  discount: ""
	},
	{ premoney: 3000000,
	  amountraising: 600000,
	  companycap: 12500000,
	  newshares: 2500000,
	  pricepershare: 0.24
	}
    ],
    [
	{ amount: 100000,
	  cap: 8000000,
	  discount: ""
	},
	{ premoney: 8000000,
	  amountraising: 2000000,
	  companycap: 11500000,
	  newshares: 2875215,
	  pricepershare: 0.6956
	}
    ],
    [
	{ amount: 100000,
	  cap: 8000000,
	  discount: 15
	},
	{ premoney: 10000000,
	  amountraising: 1000000,
	  companycap: 11000000,
	  newshares: 1100110,
	  pricepershare: 0.909
	}
    ],
    [
	{ amount: 20000,
	  cap: "",
	  discount: 20
	},
	{ premoney: 2000000,
	  amountraising: 400000,
	  companycap: 10500000,
	  newshares: 2105263,
	  pricepershare: 0.19
	}
    ]
]

test(testObject[0][0], testObject[0][1], 220000);
test(testObject[1][0], testObject[1][1], 416666);
test(testObject[2][0], testObject[2][1], 143760);
test(testObject[3][0], testObject[3][1], 137500);
test(testObject[4][0], testObject[4][1], 131578);

console.log("Of " + results.total + " tests, " + results.bad + " failed, "
          + (results.total - results.bad) + " passed.");
