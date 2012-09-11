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

nock('https://test-sandbox.chargify.com:443')
  .put('/customers/1997989.json', "{\"customer\":{\"last_name\":\"Perez\",\"email\":\"jperez@test.com\"}}")
    .reply(200, helpers.loadFixture('updatedCustomer.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .put('/customers/1997989.json', "{\"customer\":{\"first_name\":\"Juan\"}}")
    .reply(200, helpers.loadFixture('updatedCustomer2.json'), helpers.headersChargify);

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
      topic: function () {
        charge.getCustomer(testContext.customer.id, this.callback);
      },
      "should respond with the customer": assertCustomer
    },
    "the getCustomerById() method": {
      topic: function () {
        charge.getCustomerById(testContext.customer.id, this.callback);
      },
      "should respond with the customer": assertCustomer
    },
    //
    // Always get 404 using any reference :(
    //
    //"the getCustomerByRef() method (will be deprecated by chargify anytime)": {
    //  topic: function () {
    //    charge.getCustomerByRef('jdoe@test.com', this.callback);
    //  },
    //  "should respond with the customer": assertCustomer
    //}
  }
}).addBatch({
  "Charged instance": {
    "the updateCustomer() method": {
      topic: function () {
        charge.updateCustomer(testContext.customer.id, {
          last_name: 'Perez',
          email: 'jperez@test.com'
        }, this.callback);
      },
      "should respond with a valid customer": assertCustomer,
      "should respond with the updated customer": function (err, customer) {
        assert.isNull(err);
        assert.ok(customer);
        assert.equal(customer.first_name, 'Jhon');
        assert.equal(customer.last_name, 'Perez');
        assert.equal(customer.email, 'jperez@test.com');
      }
    },
    "the updateCustomerById() method": {
      topic: function () {
        charge.updateCustomerById(testContext.customer.id, {
          first_name: 'Juan'
        }, this.callback);
      },
      "should respond with a valid customer": assertCustomer,
      "should respond with the updated customer": function (err, customer) {
        assert.isNull(err);
        assert.ok(customer);
        assert.equal(customer.first_name, 'Juan');
      }
    }
  }
}).export(module)
