/*
	 ___ ____ __ __
	/ _ `/ _ \\ \ /
	\_,_/ .__/_\_\ 
	   /_/         

	Copyright (c) 2014, Kenan Sulayman
	
	Copyright (c) 2013, Mollie B.V.
	All rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:

	- Redistributions of source code must retain the above copyright notice,
	this list of conditions and the following disclaimer.
	- Redistributions in binary form must reproduce the above copyright
	notice, this list of conditions and the following disclaimer in the
	documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND ANY
	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY
	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
	LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
	OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
	DAMAGE.

	@license     Berkeley Software Distribution License (BSD-License 2) http://www.opensource.org/licenses/bsd-license.php
	@author      Mollie B.V. <info@mollie.nl>
	@copyright   Mollie B.V.
	@link        https://www.mollie.nl
*/

/*
  Example 4 - How to prepare an iDEAL payment with the Mollie API.
*/

var Mollie, example, fs, querystring, _;

querystring = require("querystring"),
fs = require("fs");

Mollie = require("../lib/mollie"),
_ = require("underscore");

example = (function() {
	function example(request, response) {
		var _this = this;
		this.body = "";
		request.on("data", function(data) {
			return _this.body += data;
		});
		request.on("end", function() {
			var issuers, mollie, orderId;
			_this.body = querystring.parse(_this.body);
			
			/*
        			Initialize the Mollie API library with your API key.
        			See: https://www.mollie.nl/beheer/account/profielen/
        		*/

			mollie = new Mollie.API.Client;
			mollie.setApiKey("test_b93kfaAsnngIAT3NysojhYvKEJ5YbP");
			
			/*
        			First, let the customer pick the bank in a simple HTML form. This step is actually optional.
        		*/

			if (request.method !== "POST") {
				issuers = mollie.issuers.all(function(issuers) {
					var issuer, _i, _len;
					response.writeHead(200, {
						'Content-Type': "text/html; charset=utf-8"
					});
					response.write('<form method="post">Select your bank: <select name="issuer">');
					for (_i = 0, _len = issuers.length; _i < _len; _i++) {
						issuer = issuers[_i];
						if (issuer.method === Mollie.API.Object.Method.IDEAL) {
							response.write("<option value=\"" + (_.escape(issuer.id)) + "\">" + (_.escape(issuer.name)) + "</option>");
						}
					}
					response.write('<option value="">or select later</option>');
					response.write('</select><button>OK</button></form>');
					return response.end();
				});
				return;
			}

			/*
			        Generate a unique order id for this example. It is important to include this unique attribute
			        in the redirectUrl (below) so a proper return page can be shown to the customer.
		        */

			orderId = new Date().getTime();

			/*
			          Payment parameters:
			            amount        Amount in EUROs. This example creates a € 10,- payment.
			            method        Payment method "ideal".
			            description   Description of the payment.
			            redirectUrl   Redirect location. The customer will be redirected there after the payment.
			            metadata      Custom metadata that is stored with the payment.
			            issuer        The customer's bank. If empty the customer can select it later.
		        */

			return mollie.payments.create({
				amount: 25.00,
				method: Mollie.API.Object.Method.IDEAL,
				description: "My first iDEAL payment",
				redirectUrl: "http://" + request.headers.host + "/3-return-page?orderId=" + orderId,
				metadata: {
					orderId: orderId
				},
				issuer: _this.body.issuer || null
			}, function(payment) {
				if (payment.error) {
					console.error(payment.error);
					return response.end();
				}
				
				/*
        				In this example we store the order with its payment status in a database.
          			*/

				_this.databaseWrite(orderId, payment.status);
	
				/*
        				Send the customer off to complete the payment.
  				*/

				response.writeHead(302, {
					Location: payment.getPaymentUrl()
				});
				return response.end();
			});
		});
	}

	/*
      		NOTE: This example uses a text file as a database. Please use a real database like MySQL in production code.
    	*/


	example.prototype.databaseWrite = function(orderId, paymentStatus) {
		orderId = parseInt(orderId);
		return fs.writeFile(__dirname + ("/orders/order-" + orderId + ".txt"), paymentStatus);
	};

	return example;

})();

module.exports = example;