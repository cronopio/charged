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
    Charged = require('../');
    
nock.recorder.rec();

/**
nock('https://test-sandbox.chargify.com')
  .get('/customers.json')
  .reply(200, "[{\"customer\":{\"email\":\"test@test.com\",\"address_2\":\"\",\"phone\":\"\",\"created_at\":\"2012-07-18T10:58:21-04:00\",\"city\":\"\",\"address\":\"\",\"zip\":\"\",\"last_name\":\"Pablo\",\"updated_at\":\"2012-07-18T10:58:21-04:00\",\"country\":\"\",\"organization\":\"\",\"state\":\"\",\"first_name\":\"Pedro\",\"reference\":null,\"id\":1997915}},{\"customer\":{\"email\":\"juan@test.com\",\"address_2\":\"\",\"phone\":\"\",\"created_at\":\"2012-07-18T10:58:37-04:00\",\"city\":\"\",\"address\":\"\",\"zip\":\"\",\"last_name\":\"Perez\",\"updated_at\":\"2012-07-18T10:58:37-04:00\",\"country\":\"\",\"organization\":\"\",\"state\":\"\",\"first_name\":\"Juan\",\"reference\":null,\"id\":1997916}}]", { 'content-type': 'application/json; charset=utf-8',
  connection: 'keep-alive',
  status: '200',
  'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.12',
  'x-ratelimit-reset': '1342656000',
  p3p: 'CP="ALL DSP COR CURa ADMa DEVa OUR IND COM NAV"',
  'x-ratelimit-remaining': '999999',
  'cache-control': 'private, max-age=0, must-revalidate',
  'x-ratelimit-limit': '1000000',
  'content-length': '584',
  'set-cookie': [ '_chargify_session=BAh7CCIac2VsbGVyX2NyZWRlbnRpYWxzX2lkaQLkMToPc2Vzc2lvbl9pZCIlNDA1MTY3NzM5NWVhZTFmNGNmZDY2N2M3NTdmOGZmNzMiF3NlbGxlcl9jcmVkZW50aWFscyIBgDc4ZGY4NWVkMGY0ZmNhNGNiMzNjZjFlM2MyOTI5ODE0YzI4MzZjMzA1MzhjZTBlNmM3MjUzYzgxYTlkYTliYjcyMzM5ZmVmZDlmMzZkNDZiZTI3ZWI4MGVmNjI2Zjg5ZGM1OTNkMmFhMmJkMjcwM2QwODk3MTQ5ODRlNGViM2I0--24396f01cee3aba3aa0467ee9a0045f18e567502; domain=.chargify.com; path=/; secure; HttpOnly' ],
  'x-runtime': '21',
  etag: '"ec64118a41e0fef2046655873fb0cc6d"',
  server: 'nginx/1.0.15 + Phusion Passenger 3.0.12 (mod_rails/mod_rack)' });
  
nock('https://test-sandbox.chargify.com')
  .post('/customers.json', "{\"customer\":{\"first_name\":\"Jhon\",\"last_name\":\"Doe\",\"email\":\"jdoe@test.com\"}}")
  .reply(201, "{\"customer\":{\"state\":null,\"phone\":null,\"country\":null,\"reference\":null,\"last_name\":\"Doe\",\"city\":null,\"zip\":null,\"first_name\":\"Jhon\",\"address_2\":null,\"address\":null,\"id\":1997989,\"organization\":null,\"email\":\"jdoe@test.com\",\"updated_at\":\"2012-07-18T11:21:47-04:00\",\"created_at\":\"2012-07-18T11:21:47-04:00\"}}", { 'content-type': 'application/json; charset=utf-8',
  connection: 'keep-alive',
  status: '201',
  'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.12',
  'x-runtime': '20',
  location: 'https://test-sandbox.chargify.com/customers/1997989',
  'content-length': '304',
  'x-ratelimit-reset': '1342656000',
  'cache-control': 'no-cache',
  'set-cookie': [ '_chargify_session=BAh7CCIXc2VsbGVyX2NyZWRlbnRpYWxzIgGANzhkZjg1ZWQwZjRmY2E0Y2IzM2NmMWUzYzI5Mjk4MTRjMjgzNmMzMDUzOGNlMGU2YzcyNTNjODFhOWRhOWJiNzIzMzlmZWZkOWYzNmQ0NmJlMjdlYjgwZWY2MjZmODlkYzU5M2QyYWEyYmQyNzAzZDA4OTcxNDk4NGU0ZWIzYjQ6D3Nlc3Npb25faWQiJWU2YzEwYjE2OWNjYTQxYzI1YjkzM2JhNDA3OWEyNDNkIhpzZWxsZXJfY3JlZGVudGlhbHNfaWRpAuQx--5bf5e2e84679df6180236d48577f5ccbecb0ea57; domain=.chargify.com; path=/; secure; HttpOnly' ],
  p3p: 'CP="ALL DSP COR CURa ADMa DEVa OUR IND COM NAV"',
  'x-ratelimit-limit': '1000000',
  'x-ratelimit-remaining': '999995',
  server: 'nginx/1.0.15 + Phusion Passenger 3.0.12 (mod_rails/mod_rack)' });
**/

var charge = new Charged({
  product: 'test-sandbox',
  key: 'e0s91_pdUmXWqtEh7gJW'
});

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
        assert.isNull(err);
        assert.ok(customer);
        assert.ok(customer.id);
        assert.ok(customer.created_at);
        assert.equal(customer.email, 'jdoe@test.com');
      }
    }
  }
}).export(module)
