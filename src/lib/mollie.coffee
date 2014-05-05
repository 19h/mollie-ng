module.exports = Mollie =
  API:
    Client: require "./mollie/api/client"
    Object:
      List: require "./mollie/api/object/list"
      Payment: require "./mollie/api/object/payment"
      Method: require "./mollie/api/object/method"
      Issuer: require "./mollie/api/object/issuer"
    Resource:
      Base: require "./mollie/api/resource/base"
      Payments: require "./mollie/api/resource/payments"
      Methods: require "./mollie/api/resource/methods"
      Issuers: require "./mollie/api/resource/issuers"
