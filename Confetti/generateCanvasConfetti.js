function getCircleNodes(columns, rows, height, width) {
  const circleSize = 8
  const initRandomValueArrays = []
  const xandyValues = []

  let columnArrayRandomValues = []
  let columnArrayYvalues = []

  let rowArrayRandomValues = []
  let rowArrayXvalue = []

  for (let h = 0; h < columns; h++) {
    columnArrayRandomValues = []
    columnArrayYvalues = []

    for (let v = 0; v < rows; v++) {
      rowArrayRandomValues = []
      rowArrayXvalue = []

      const initXValue = Math.random()
      const xMin = (width / columns) * h - (circleSize / 2)
      const xMax = (width / columns) * (h + 1) - (circleSize / 2)
      const xVal = initXValue * (xMax - xMin) + xMin
      rowArrayRandomValues.push(initXValue)
      rowArrayXvalue.push(xVal)

      const initYValue = Math.random()
      const yMin = (height / rows) * v - (circleSize / 2)
      const yMax = (height / rows) * (v + 1) - (circleSize / 2)
      const yVal = initYValue * (yMax - yMin) + yMin
      rowArrayRandomValues.push(initYValue)
      rowArrayXvalue.push(yVal)

      columnArrayRandomValues.push(rowArrayRandomValues)
      columnArrayYvalues.push(rowArrayXvalue)
    }

    initRandomValueArrays.push(columnArrayRandomValues)
    xandyValues.push(columnArrayYvalues)
  }

  return {initRandomValueArrays, xandyValues}
}

function generateCanvasConfettiSVG({options, width, height}) {
  const { columns, rows } = options

  const {
    initRandomValueArrays,
    xandyValues
  } = getCircleNodes(columns, rows, height, width)

  let testDiv = document.createElement('div')
  testDiv.className = 'generated-container'

  return {
    initRandomValueArrays,
    xandyValues,
    testDiv
  }
}

module.exports = { generateCanvasConfettiSVG }
