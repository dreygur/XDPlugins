const { Color, LinearGradient } = require('scenegraph');
const { alert } = require('./lib/dialogs');


function generateColor() {
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255)
  };
}

async function setNewColor(selection) {
  if (!selection.items.length) {
    await alert(
      'No items selected',
      'To generate a color, please select at least one item.'
    );
    return;
  }

  const color = new Color(generateColor());

  selection.items.forEach(item => {
    item.fill = color;
  });
}

async function setNewGradient(selection) {
  if (!selection.items.length) {
    await alert(
      'No items selected',
      'To generate a gradient, please select at least one item.'
    );
    return;
  }

  const gradient = new LinearGradient();

  gradient.colorStops = [
    {
      color: new Color(generateColor()),
      stop: 0
    },
    {
      color: new Color(generateColor()),
      stop: 1
    }
  ];

  const direction = Math.round(Math.random()) ? 'x' : 'y';

  gradient.startX = 0;
  gradient.startY = 0;
  gradient.endX = direction === 'x' ? 1 : Math.random();
  gradient.endY = direction === 'y' ? 1 : Math.random();

  selection.items.forEach(item => {
    item.fill = gradient;
  });
}

module.exports = {
  commands: {
    color: setNewColor,
    gradient: setNewGradient
  }
};
