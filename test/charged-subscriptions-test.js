/*
 * charged-subscriptions-test.js: Tests for Charged
 *
 * (C) 2012 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var vows    = require('vows'),
    nock    = require('nock'),
    assert  = require('assert'),
    helpers = require('./helpers'),
    Charged = require('../');
    
nock.recorder.rec();

var charge = new Charged({
  product: 'test-sandbox',
  key: 'e0s91_pdUmXWqtEh7gJW'
});

var testContext = {};

vows.describe('Charged subscriptions tests').addBatch({
  "Charged instance": {
    "with a new customer": {
      topic: function () {
        charge.createCustomer({
          first_name: 'MrNew',
          last_name: 'Customer',
          email: 'ncustomer@test.com'
        }, this.callback);
      },
      "with a created product": {
        topic: function (customer) {
          console.log('CLIENTEEEEEE', customer);
          charge.getProducts(this.callback);
        },
        "the createSubscription() method": {
          topic: function (customer, products) {
            console.log('LLLEGAN!!!', arguments);
            charge.create
          }
        }
      },
      "should respond correctly": function (err, customer) {
        assertCustomer(err, customer, { email: 'jdoe@test.com' });
        testContext.customer = customer;
      }
        charge.getCustomers(function (err, customers) {
          assert.isNull(err);
          console.log('CSSSSS', customers);
          self.callback();
        })
      },
      "should respond correctly": function (err, subscription) {
        assert.isNull(err);
        assert.ok(subscription);
      }
    }
  }
}).addBatch({
  "Charged instance": {
    "the getSubscriptions() method": {
      topic: function () {
        charge.getSubscriptions(this.callback);
      },
      "should respond with the all subscriptions": function (err, list) {
        console.log('asdadasdasdasdasdasd', arguments);
      assert.ok(false);
      }
    }
  }
}).addBatch({
  "Charged instance": {
    topic: function () {
      charge.getCustomerSubscriptions(testContext.customer.id, this.callback);
    },
    "should respond with subscriptions list": function (err, list) {
      console.log('AALLL', arguments);
      assert.ok(false);
    }
  }
}).export(module)