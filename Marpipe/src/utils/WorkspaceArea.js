
/******************************************************************************************************************
1. need to also find the workspace area occupied by non-artboard elements
2. coordinate = {x, y}
3. area = { topLeftCoordinate, topRightCoordinate, bottomLeftCoordinate, bottomRightCoordinate }
******************************************************************************************************************/

export default {
  methods: {
    getEmptyWorkspaceArea(artboardWidth, artboardHeight) {
      //Finds available workspace area and calculate coordinate for an artboard to moveInParentCoordinates
      const WIDTH_BETWEEN = 70;														          	//XD horizontal gap value between artboards
      const HEIGHT_BETWEEN = 182;															        //XD vertical gap value between artboards
      const INITIAL_X_PT = -25000 + WIDTH_BETWEEN;										//-25000 is the minimum globalBounds.x value (-25000 is the min x value of XD workspace)
      const INITIAL_Y_PT = -25000 + HEIGHT_BETWEEN;										//-25000 is the minimum globalBounds.y value (-25000 is the min y value of XD workspace)

      let occupiedRangeArr = this.getOccupiedWorkspaceRange();
      let potentialArea;
      let workspaceAreaFound;
      let coordinate;
      let column = 0;
      let row = 0;

      let artboardDimension = {
        width: artboardWidth,
        height: artboardHeight
      }

      do {
        workspaceAreaFound = true;

        coordinate = {
          x: INITIAL_X_PT + column * artboardWidth + column * WIDTH_BETWEEN,
          y: INITIAL_Y_PT + row * artboardHeight + row * HEIGHT_BETWEEN
        }

        potentialArea = this.getArtboardArea(coordinate, artboardDimension);

        //make sure new potential area is not out of workspace range
        if (potentialArea.topRight.x >= 25000) {										   //if topRight coordinate is out of range
          column = 0;																	                 //restart at column 0
          row++;                                                       //continue to next row
          workspaceAreaFound = false;                                  //this line of code may not be needed, gotta double check
          continue;																	                   //loop again to calculate next potential workspace area
        }

        if (this.isOccupiedArea(potentialArea, occupiedRangeArr)) {
          workspaceAreaFound = false;
        }

        column++;

      } while (!workspaceAreaFound)														          //while available workspaceArea is still not found, calculate next potential workspaceArea

      return coordinate;
    },
    getOccupiedWorkspaceRange() {
      //Finds all the workspace range occupied by 'artboards' represented by {xMin, xMax, yMin, yMax} values for calculation
      const { root } = require('scenegraph');
      let nodes = root.children;
      let occupiedRangeArr = [];
      let rangeObj;

      nodes.forEach(node => {
        rangeObj = {
          xMin: node.globalBounds.x,
          xMax: node.globalBounds.x + node.width,
          yMin: node.globalBounds.y,
          yMax: node.globalBounds.y + node.height
        }
        occupiedRangeArr.push(rangeObj);
      })

      return occupiedRangeArr;
    },
    getArtboardArea(coordinate, artboardDimension) {
      //Calculates the workspace area for an artboard using topLeft coordinate
      let area = {
        topLeft: {
          x: coordinate.x,
          y: coordinate.y
        },
        topRight: {
          x: coordinate.x + artboardDimension.width,
          y: coordinate.y
        },
        bottomLeft: {
          x: coordinate.x,
          y: coordinate.y + artboardDimension.height
        },
        bottomRight: {
          x: coordinate.x + artboardDimension.width,
          y: coordinate.y + artboardDimension.height
        }
      }

      return area;
    },
    isOccupiedArea(area, occupiedRangeArr) {
      //Checks if specified area is already occupied on the workspace
      let topLeftOccupied;
      let topRightOccupied;
      let bottomLeftOccupied;
      let bottomRightOccupied;

      for (const occupiedRange of occupiedRangeArr) {
        topLeftOccupied = this.getCornerOccupied(area.topLeft, occupiedRange);
        topRightOccupied = this.getCornerOccupied(area.topRight, occupiedRange);
        bottomLeftOccupied = this.getCornerOccupied(area.bottomLeft, occupiedRange);
        bottomRightOccupied = this.getCornerOccupied(area.bottomRight, occupiedRange);

        //checks if specified artboard area overlaps with occupied workspace area
        if (topLeftOccupied || topRightOccupied || bottomLeftOccupied || bottomRightOccupied) {
          return true;
        }
      }

      return false;
    },
    getCornerOccupied(coordinate, occupiedRange) {
      //Checks if specified coordinate overlaps with any occupied workspace area
      return occupiedRange.xMin <= coordinate.x && coordinate.x <= occupiedRange.xMax && occupiedRange.yMin <= coordinate.y && coordinate.y <= occupiedRange.yMax;
    }
  }
}