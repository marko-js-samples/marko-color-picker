/* global test */
const expect = require('chai').expect;

test('color-picker-header color', function (context) {
  const output = context.render({
    backgroundColor: '#000000'
  });

  expect(output.$('div').attr('style')).to.contain('background-color:#000000');
});

test('color-picker-header default color', function (context) {
  const output = context.render();
  expect(output.$('div').attr('style')).to.contain('background-color:#ff0000');
});
