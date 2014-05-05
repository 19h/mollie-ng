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
  Example 2 - How to verify Mollie API Payments in a webhook.
*/

var Mollie, example, fs, querystring;

querystring = require("querystring"),
fs = require("fs");

Mollie = require("../lib/mollie");

example = (function() {
	function example(request, response) {
		var _this = this;
		this.body = "";
		request.on("data", function(data) {
			return _this.body += data;
		});
		request.on("end", function() {
			var mollie, _ref;
			_this.body = querystring.parse(_this.body);
			if (!((_ref = _this.body) != null ? _ref.id : void 0)) {
				return response.end();
			}

			/*
				Initialize the Mollie API library with your API key.
				See: https://www.mollie.nl/beheer/account/profielen/
			*/

			mollie = new Mollie.API.Client;
			mollie.setApiKey("test_b93kfaAsnngIAT3NysojhYvKEJ5YbP");
			
			/*
				Retrieve the payment's current state.
			*/

			mollie.payments.get(_this.body.id, function(payment) {
				if (payment.error) {
					console.error(payment.error);
					return response.end();
				}

				/*
        				Update the order in the database.
        			*/

				_this.databaseWrite(payment.metadata.orderId, payment.status);
				if (payment.isPaid()) {
				
				/*
              				At this point you'd probably want to start the process of delivering the product to the customer.
    				*/

				} else if (!payment.isOpen()) {
				
				/*
              				The payment isn't paid and isn't open anymore. We can assume it was aborted.
            			*/

				}
			});
			return response.end();
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