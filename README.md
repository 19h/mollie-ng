**This module is a fork of the "official" Mollie API client for Node and sports these differences:**
 - No Coffeescript or comparable crap
 - No native modules for useless version lookups
 - Actually, no native modules. So this is node-version agnostic
 - No underscore-hipster rubbish
 - Actual Love

# Mollie API client for Node #

Accepting [iDEAL](https://www.mollie.nl/betaaldiensten/ideal/), [Mister Cash](https://www.mollie.nl/betaaldiensten/mistercash/), [Creditcard](https://www.mollie.nl/betaaldiensten/creditcard/), [PayPal](https://www.mollie.nl/betaaldiensten/paypal/), and [paysafecard](https://www.mollie.nl/betaaldiensten/paysafecard/) online payments without fixed monthly costs or any punishing registration procedures. Just use the Mollie API to receive payments directly on your website.

## Requirements ##
To use the Mollie API client, the following things are required:

+ Get yourself a free [Mollie account](https://www.mollie.nl/aanmelden). No sign up costs.
+ Create a new [Website profile](https://www.mollie.nl/beheer/account/profielen/) to generate API keys (live and test mode) and setup your webhook.
+ Now you're ready to use the Mollie API client in test mode.
+ In order to accept payments in live mode, payment methods must be activated in your account. Follow [a few of steps](https://www.mollie.nl/beheer/diensten), and let us handle the rest.

## Installation ##

By far the easiest way to install the Mollie API client is to install it with [npm](https://npmjs.org/).

    $ npm install mollie-ng

Additionally, add it to your project in order make deployments easier:

        {
            "dependencies": {
                "mollie-ng": "~1.x.x"
            }
        }


You may also git checkout or [download all the files](https://github.com/KenanSulayman/mollie-ng/archive/master.zip), and include the Mollie API client manually. Though, *you shouldn't.*

## How to receive payments ##

To successfully receive a payment, these steps should be implemented:

1. Use the Mollie API client to create a payment with the requested amount, description and optionally, a payment method. It is important to specify a unique redirect URL where the customer is supposed to return to after the payment is completed.

2. Immediately after the payment is completed, our platform will send an asynchronous request to the configured webhook to allow the payment details to be retrieved, so you know when exactly to start processing the customer's order.

3. The customer returns, and should be satisfied to see that the order was paid and is now being processed.

## Getting started ##

Requiring the library.

```javascript
    var Mollie = require("mollie-api-node");
```

Initializing the Mollie API client, and setting your API key.

```javascript
    var mollie = new Mollie.API.Client;
    mollie.setApiKey("test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM");
```

Creating a new payment.

```javascript
    mollie.payments.create({
        amount:      10.00,
        description: "Payment description",
        redirectUrl: "https://example.com/order/12345/"
    },  function (payment) {
        response.writeHead(302, {
            Location: payment.getPaymentUrl()
        })
    });
```

Retrieving a payment.

```javascript
    mollie.payments.get(
        payment.id,
        function (payment) {
            if (payment.isPaid())
                console.log("Payment received.");
        }
    );
```


## License ##
[BSD (Berkeley Software Distribution) License](http://www.opensource.org/licenses/bsd-license.php).
Copyright (c) 2013, Mollie B.V.

## Support ##
Contact: [www.mollie.nl](http://www.mollie.nl) — info@mollie.nl — +31 20-612 88 55

+ [More information about iDEAL via Mollie](https://www.mollie.nl/betaaldiensten/ideal/)
+ [More information about Creditcard via Mollie](https://www.mollie.nl/betaaldiensten/creditcard/)
+ [More information about Mister Cash via Mollie](https://www.mollie.nl/betaaldiensten/mistercash/)
+ [More information about Bank transfer via Mollie](https://www.mollie.nl/betaaldiensten/overboeking/)
+ [More information about PayPal via Mollie](https://www.mollie.nl/betaaldiensten/paypal/)
+ [More information about paysafecard via Mollie](https://www.mollie.nl/betaaldiensten/paysafecard/)