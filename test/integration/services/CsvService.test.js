var should = require('should');

describe('CsvService', function() {
  var fields = ['column1', 'column2'];
  var data = [
    { column1: '1', column2: '2'},
    { column1: '2', column2: '4'},
    { column1: '3', column2: '8'},
    { column1: 'abc,ddd', column2: 'with comma and white space'},
  ];

  var tmp_filename = null;

  describe('#write()', function() {

    it('success', function(done) {
      CsvService.write(data, fields, function(err, filename) {
        should.equal(err, null);
        (typeof filename).should.equal('string');

        tmp_filename = filename;
        done();
      });
    });

  });

  describe('#read()', function() {

    it('success', function(done) {
      CsvService.read(tmp_filename, function(err, csvs) {
        should.equal(err, null);
        csvs.should.deepEqual(data);
        done();
      });
    });

  });
});