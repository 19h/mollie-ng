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

var example, fs, url, _;

url = require("url");

_ = require("underscore");

fs = require("fs");

example = (function() {
	function example(request, response) {
	/*
        	In this example we retrieve the order stored in the database.
        	Here, it's unnecessary to use the Mollie API Client.
      	*/

		var params, status;
		params = url.parse(request.url, true).query;
		status = this.databaseRead(params.orderId);
		response.writeHead(200, {
			'Content-Type': "text/html; charset=utf-8"
		});
		response.write("<p>Your payment status is '" + (_.escape(status)) + "'.</p>");
		response.write("<p>");
		response.write("<a href=\"http://" + request.headers.host + "/1-new-payment\">Retry example 1</a><br>");
		response.write("<a href=\"http://" + request.headers.host + "/4-ideal-payment\">Retry example 4</a><br>");
		response.write("</p>");
		response.end();
	}

	/*
		NOTE: This example uses a text file as a database. Please use a real database like MySQL in production code.
    	*/


	example.prototype.databaseRead = function(orderId) {
		orderId = parseInt(orderId);
		return fs.readFileSync(__dirname + ("/orders/order-" + orderId + ".txt"));
	};

	return example;
})();

module.exports = example;