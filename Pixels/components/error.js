const { alert, error } = require('../lib/dialogs');

module.exports.noConnection = async function() {
  await error(
    "Pixels Error",
    "Please connect to the internet and try again.",
  );
}


module.exports.noSelection = async function () { 
  await error(
    "Pixels Error",
    "Please select atleast 1 Rectangle, Ellipse, or Polygon object and try applying again.",
  );
}