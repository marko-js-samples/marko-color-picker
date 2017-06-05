var flatColors = require('flat-colors').colors;

module.exports = function getColors () {
  var colors = [];
  for (var i = 0; i < 10; i++) {
    colors.push(flatColors[i][3]);
  }
  return colors;
};
