'use strict';

var request = require('request');

var FreshdeskAPI = function(options) {
    if (!options.domain)
        throw new Error('FreshdeskAPI::NO_DOMAIN');

    if (!options.credentials.apiKey && !options.credentials.login && !options.credentials.password)
        throw new Error('FreshdeskAPI::NO_CREDENTIALS');

    this.domain      = options.domain;
    this.credentials = options.credentials;

    this._request = request.defaults({
        baseUrl: FreshdeskAPI.API_ROOT.replace('#DOMAIN#', this.domain),
        auth: {
            user: this.credentials.apiKey || this.credentials.login,
            pass: this.credentials.apiKey ? 'x' : this.credentials.password
        },
        useQuerystring: true,
        json: true
    });
};

// Freshdesk API Root with placeholder
FreshdeskAPI.API_ROOT = 'http://#DOMAIN#.freshdesk.com/';

/**
 * Authenticated API Request
 * @param  {string}   verb     HTTP Verb to be used
 * @param  {string}   endpoint Endpoint path
 * @param  {object}   data     Data to send to given endpoint
 * @param  {Function} callback Function called when request is done. Callback params are:
 *                                 - {Error} err  - It should be null most of the time
 *                                 - {Request} req  - Request object for better control
 *                                 - {Object} res - Parsed response body
 */
FreshdeskAPI.prototype.api = function(verb, endpoint, data, callback) {
    if (typeof data === 'function')
    {
        if (!callback) // switch args around
        {
            callback = data;
            data = {};
        }
        else
            data = data();
    }
    else if (!data)
        data = {};

    callback = callback || function() {};

    var opts = {
        uri: endpoint + '.json',
        method: verb.toUpperCase()
    };

    if (opts.method === 'GET')
        opts.qs = data;
    else
        opts.body = data;

    return this._request(opts, callback);
};

// Convenience methods
FreshdeskAPI.prototype.get     = function(endpoint, data, callback) { this.api('GET',     endpoint, data, callback); };
FreshdeskAPI.prototype.post    = function(endpoint, data, callback) { this.api('POST',    endpoint, data, callback); };
FreshdeskAPI.prototype.put     = function(endpoint, data, callback) { this.api('PUT',     endpoint, data, callback); };
FreshdeskAPI.prototype.del     = function(endpoint, data, callback) { this.api('DELETE',  endpoint, data, callback); };

module.exports = FreshdeskAPI;
