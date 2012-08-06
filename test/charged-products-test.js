/*
 * charged-products-test.js: Tests for Charged
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
  .get('/products.json')
    .reply(200, helpers.loadFixture('productsList.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/products.json')
    .reply(200, helpers.loadFixture('productsList.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/products/1891978.json')
    .reply(200, helpers.loadFixture('product.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/products/handle/productononeprodcutfamily.json')
    .reply(200, helpers.loadFixture('product.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/product_families/206029/components.json')
  .reply(200, helpers.loadFixture('familyComponent.json'), helpers.headersChargify);

nock('https://test-sandbox.chargify.com:443')
  .get('/product_families/206029/components.json')
    .reply(200, helpers.loadFixture('familyComponent.json'), helpers.headersChargify);

var charge = new Charged({
  product: 'test-sandbox',
  key: 'e0s91_pdUmXWqtEh7gJW'
});

var testContext = {};

vows.describe('Charged products tests').addBatch({
  "Charged instance": {
    "the getProducts() method": {
      topic: function () {
        charge.getProducts(this.callback);
      },
      "should respond correctly": function (err, result) {
        assert.isNull(err);
        assert.ok(result);
        assert.isArray(result);
        assert.lengthOf(result, 1);
        testContext.products = result;
      }
    },
    "the listProducts() method": {
      topic: function () {
        charge.listProducts(this.callback);
      },
      "should respond correctly": function (err, result) {
        assert.isNull(err);
        assert.ok(result);
        assert.isArray(result);
        assert.lengthOf(result, 1);
      }
    }
  }
}).addBatch({
  "Charged instance": {
    "the getProduct() method": {
      topic: function () {
        charge.getProduct(testContext.products[0].id, this.callback);
      },
      "should respond correctly": function (err, product) {
        assert.isNull(err);
        assert.ok(product);
        assert.ok(product.id);
        assert.ok(product.name);
        assert.ok(product.created_at);
        assert.equal(product.id, testContext.products[0].id);
        testContext.handler = product.handle;
        testContext.family = product.product_family;
      }
    }
  }
}).addBatch({
  "Charged instance": {
    "the getProductByHandle() method": {
      topic: function () {
        charge.getProductByHandle(testContext.handler, this.callback);
      },
      "should respond correctly": function (err, product) {
        assert.isNull(err);
        assert.ok(product);
        assert.ok(product.id);
        assert.ok(product.name);
        assert.ok(product.created_at);
        assert.equal(product.handle, testContext.handler);
      }
    }
  }
}).addBatch({
  "Charged instance": {
    "the getProductFamilyComponents() method": {
      topic: function () {
        charge.getProductFamilyComponents(testContext.family.id, this.callback);
      },
      "should respond correctly": function (err, result) {
        assert.isNull(err);
        assert.ok(result);
        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.ok(result[0].id);
        assert.equal(result[0].product_family_id, testContext.family.id);
      }
    },
    "the listProductFamilyComponents() method": {
      topic: function () {
        charge.listProductFamilyComponents(testContext.family.id, this.callback);
      },
      "should respond correctly": function (err, result) {
        assert.isNull(err);
        assert.ok(result);
        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.ok(result[0].id);
        assert.equal(result[0].product_family_id, testContext.family.id);
      }
    }
  }
}).export(module)
