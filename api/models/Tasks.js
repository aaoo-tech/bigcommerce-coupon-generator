/**
* Tasks.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    email: 'string',
    url: 'string',
    token: 'string',
    username: 'string',
    // prefix: 'string',
    // suffix: 'string',
    // len: 'string',
    // number: 'integer',
    csv_filename: 'string',
    is_upload: {
        type: 'integer',
        defaultsTo: 0
    },
    _rules: {
        type: 'text',
        defaultsTo: 0
    },
    status: {
        type: 'integer',
        defaultsTo: 0
    }
  }
};