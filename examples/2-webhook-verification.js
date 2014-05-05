// Generated by CoffeeScript 1.6.3
/*
  Example 2 - How to verify Mollie API Payments in a webhook.
*/


(function() {
  var Mollie, example, fs, querystring;

  Mollie = require("../lib/mollie");

  querystring = require("querystring");

  fs = require("fs");

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

}).call(this);

/*
//@ sourceMappingURL=2-webhook-verification.map
*/
