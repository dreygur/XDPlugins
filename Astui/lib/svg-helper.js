class svgHelper
{
     /**
     * Calculate the amount of points in a path and just gets an array of all the points (0,1,2...)
     * @param {string} selection - path string
     * @returns {Array} array points.
     */
    static getPointsArray(selection) {
        let path = selection.split(/(?=[LMC])/);
        let points = path.map(function (d) {
            var pointsArray = d.slice(1, d.length).split(',');

            var pairsArray = [];
            for (var i = 0; i < pointsArray.length; i += 2) {

                pairsArray.push(pointsArray[i]);
            }

            return pairsArray;
        });
        let array = new Array();
        for (var i = 0; i < points.length; i++) {

            array.push(i);
        }

        return array;
    }
}

module.exports = svgHelper;