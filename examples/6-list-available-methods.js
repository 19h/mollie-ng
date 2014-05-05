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
  Example 6 - How to get the currently activated payment methods.
*/

var Mollie, example, _;

Mollie = require("../lib/mollie");

_ = require("underscore");

example = (function() {
	function example(request, response) {
	
		/*
        		Initialize the Mollie API library with your API key.
        		See: https://www.mollie.nl/beheer/account/profielen/
      		*/

		var mollie;
		mollie = new Mollie.API.Client;
		mollie.setApiKey("test_b93kfaAsnngIAT3NysojhYvKEJ5YbP");
	
		/*
			Get the all payments for this API key ordered by newest.
			*/

		mollie.methods.all(function(methods) {
			var method, _i, _len;
			if (methods.error) {
				console.error(methods.error);
				return response.end();
			}
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			for (_i = 0, _len = methods.length; _i < _len; _i++) {
				method = methods[_i];
				response.write("<div style='line-height:40px; vertical-align:top'>");
				response.write("<img src='" + (_.escape(method.image.normal)) + "'>");
				response.write("" + (_.escape(method.description)) + " (" + (_.escape(method.id)) + ")</div>");
			}
			return response.end();
		});
	}

	return example;

})();

module.exports = example;