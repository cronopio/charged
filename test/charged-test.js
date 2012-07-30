/*
 * charged-test.js: Tests for Charged
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

nock('https://test-sandbox.chargify.com:443')
  .get('/customers.json')
    .reply(200, helpers.loadFixture('customerList.json'), helpers.headersChargify)

nock('https://test-sandbox.chargify.com:443')
  .post('/customers.json', "{\"customer\":{\"first_name\":\"Jhon\",\"last_name\":\"Doe\",\"email\":\"jdoe@test.com\"}}")
    .reply(201, helpers.loadFixture('customer.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/customers/1997989.json')
    .reply(200, helpers.loadFixture('customer.json'), helpers.headersChargify);
nock('https://test-sandbox.chargify.com:443')
  .get('/customers/1997989.json')
    .reply(200, helpers.loadFixture('customer.json'), helpers.headersChargify);

var charge = new Charged({
  product: 'test-sandbox',
  key: 'e0s91_pdUmXWqtEh7gJW'
});

var testContext = {};

function assertCustomer(err, customer, template) {
  assert.isNull(err);
  assert.ok(customer);
  assert.ok(customer.id);
  assert.ok(customer.created_at);

  if (typeof template !== 'undefined') {
    Object.keys(template).forEach(function (key) {
      assert.equal(customer[key], template[key]);
    });
  }
}

vows.describe('Charged initial tests').addBatch({
  "Charged instance": {
    "the listCustomers() method": {
      topic: function () {
        charge.listCustomers(this.callback);
      },
      "should respond correctly": function (err, customers) {
        assert.isNull(err);
        assert.isArray(customers);
      }
    },
    "the createCustomer() method": {
      topic: function () {
        charge.createCustomer({
          first_name: 'Jhon',
          last_name: 'Doe',
          email: 'jdoe@test.com'
        }, this.callback);
      },
      "should respond correctly": function (err, customer) {
        assertCustomer(err, customer, { email: 'jdoe@test.com' });
        testContext.customer = customer;
      }
    }
  }
}).addBatch({
  "Charged instance": {
    "the getCustomer() method": {
      topic: function (){
        charge.getCustomer(testContext.customer.id, this.callback);
      },
      "should respond with the customer": assertCustomer
    },
    "the getCustomerById() method": {
      topic: function () {
        charge.getCustomerById(testContext.customer.id, this.callback);
      },
      "should respond with the customer": assertCustomer
    }
  }
}).export(module)
