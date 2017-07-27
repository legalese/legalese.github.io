---
title: "A Food-Eating Contract"
layout: "blogsidebar"
excerpt: ""
---
We recently made a lovely food eating contract.

Terms of the Food Challenge
------------------------------------

(1) The Challenger must pay $50 to Bob's Burgers.  This is due in 3601 seconds.
(2) The Challenger must complete the Food Challenge, consisting of:
    
    (2a) eating the whole 1kg Monster Burger and Fries; and
    (2b) complete the obligation in clause (2a), above, within 1 hour (3600 seconds) of the start of this challenge.

(3) Immediately upon the satisfaction of the above, the Restaurant must waive any cost of the 1kg Monster Burger and Fries in clause (2a) above.

------------------------------------

Note: This is a [Carbolic Smoke Ball offer](https://en.wikipedia.org/wiki/Carlill_v_Carbolic_Smoke_Ball_Co).

Python

```
# Can you eat *Bob's Monster Burger* within one hour?  If so it's free!
# 1. Undertake an obligation to pay Yochi's Burgers $50 due in an hour
# 2. but if you eat the burger... 
# 3. Bob's burgers is oblieged to waive the fee.

Permission( {"Alice", passport_id=161803}, action="pay" ):
  where( amount=50, recipient={"Bob's Burgers", org_id=27182} )
  due( afterinit=3601, within=0 )
  then:
		Obligation( {"Alice", passport_id=161803}, action="foodchallenge" ):
			where( "has eaten the entire 1kg KiloBurger" )
	    due( afterinit=0, within=3600 )
    	then:
				Obligation( {"Bob's Burgers", org_id=27182}, action="payment_adjustment" )
        where( "waive the bill" )
        due( afterevent=0, within=0 )
        then:
					Fulfilment
			  lest:
				  breach
	    lest:
			  pass
	lest:
		pass
```

Lisp

```
// Can you eat *Bob's Monster Burger*  (including patties!) within one hour?  If so it's free!
// 1. Alice undertake an obligation to pay Bob's Burgers $50, due in one hour.
// 2. but if Alice eats the entire burger... 
// 3. Bob's burgers is oblieged to waive the fee.

(Obligation (Party (Name "Alice") (Passport_ID "161803"))
  (Must "pay")
  (Where (Amount 50) (Recipient (Party (Name "Bob's Burgers") (Org_ID "27182"))) )
  (Due (AfterInit 3601) (Within 0))
  (Then (Obligation (Party (Name "Alice") (Passport_ID "161803"))
    (Must "foodchallenge")
    (Where "has eaten the entire Monster Burger including patties")
    (Due (AfterInit 0) (Within 3600))
    (Then (Obligation (Party (Name "Bob's Burgers") (Org_ID "27182"))
        (Must "payment_adjustment")
        (Where "waive the bill")
        (Due (AfterEvent 0) (Within 0))
        (Then Fulfilment)
        (Lest Breach)
    ))
    (Lest Noop)
  ))
  (Lest Breach)
)
```
