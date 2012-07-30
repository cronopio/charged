/**
 * Helpers for using Nock in the tests of charged
 */

var fs = require('fs');

var helpers = exports;

// Load a response from a fixture file.
helpers.loadFixture = function loadFixture(path, json) {
  var contents = fs.readFileSync(__dirname + '/fixtures/' + path, 'ascii');
  return json === 'json'
    ? JSON.parse(contents)
    : contents; 
};

// Just copying the headers used by chargify
helpers.headersChargify = {
  'content-type': 'application/json; charset=utf-8',
  connection: 'keep-alive',
  'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.12',
  server: 'nginx/1.0.15 + Phusion Passenger 3.0.12 (mod_rails/mod_rack)'
};