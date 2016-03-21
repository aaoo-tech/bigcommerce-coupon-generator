/**
 * SettingController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  test: function(req, res) {
    SettingService.set('abc', '1abc', function() {
      SettingService.get('abc', function(setting) {
        console.log(setting);
      });
    });
  }
};

