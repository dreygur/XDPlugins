const { Rectangle, Ellipse, Color, Path, Text, GraphicNode } = require("scenegraph");
let commands = require("commands");
const { editDocument } = require("application");
const fs = require("uxp").storage.localFileSystem;
const application = require("application");
const scenegraph = require("scenegraph");
const $ = require("./jquery");
const { alert, error } = require("./lib/dialogs.js");
const uxp = require('uxp');

let templates = [
		{
			"name" : "Default template",
			"id" : 0,
			"colors" : {
				"common" : ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],
				"progressChart" : ["#e31a1c"],
				"sparkline" : ["#343434"],
				"scatterPlot" : ["#1f78b4"],
				"candlestickChart" : ["#33a02c", "#e31a1c"],
				"heatmap" : ["#a6cee3"]
			},
			"grid" : {
				"type" : 1,
				"lineWidth" : 1,
				"color" : "#F0F0F0"
			},
			"labels" : {
				"type" : 1,
				"fontName" : "Roboto",
				"fontStyle" : "Regular",
				"textCase" : "ORIGINAL",
				"fontSize" : 10,
				"lineHeight" : 10,
				"letterSpacing" : 0,
				"color" : "#a3a3a3",
				"yAxisPosition" : "left",
				"xAxisPosition" : "bottom"
			},
			"beginAtZero" : 0,
			"lineType" : 0,
			"sorting" : 0,
			"typeOfCircle" : 0,
			"lineChart" : {
				"lineWidth" : 2,
				"dotType" : 1,
				"dotDiameter" : 8
			},
			"areaChart" : {
				"lineWidth" : 0,
				"opacity" : 0.8
			},
			"verticalBarChart" : {
				"margin" : 0.4,
				"roundTop" : 0,
				"useOneColor" : true
			},
			"horizontalBarChart" : {
				"margin" : 0.4,
				"roundTop" : 0,
				"useOneColor" : true
			},
			"groupedBarChart" : {
				"margin" : 0.4,
				"roundTop" : 0
			},
			"groupedHorizontalBarChart" : {
				"margin" : 0.4,
				"roundTop" : 0
			},
			"donutChart" : {
				"thicknessOfDonut" : 30
			},
			"progressChart" : {
				"backgroundColor" : "#f7f7f7",
				"thicknessOfProgress" : 10,
				"endOfLine" : 0
			},
			"sparkline" : {
				"lineWidth" : 1,
				"dotDiameter" : 4
			},
			"scatterPlot" : {
				"dotDiameter" : 8
			},
			"candlestickChart" : {
				"margin" : 0.4,
				"unfilledNegativeBoxes" : false
			},
			"histogram" : {
				"margin" : 2
			},
			"heatmap" : {
				"margin" : 0,
				"segments" : 4
			}
		}],
	defaultTemplate = 0,
	chartConfig = {
	    data : {
			chartName : "",
			selected : "",
			random : {
				categories : {
					enabled : true,
					name : "",
					value : 1
				},
				items : {
        			enabled : true,
					name : "",
					value : 1
				},
				randType : "0",
				range : true,
				min : 0,
				max : 100,
				data : []
			},
			csv : {
				name : null,
				type : null,
				data : [],
				headers : false,
				columns : [],
				header : []
			},
			json : {
				jsonLink : null,
				jsonName : null,
				data : null,
				keys : [],
				header : []
			}
		}
	};

// GENERAL
    function generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
			var r = Math.random() * 16 | 0;
			return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
		} );
	}
	// nice nums
	function calculateNiceNum(minNum, maxNum, height){
		// Nice max and min functions
		let minPoint,
			maxPoint,
			maxTicks = 10,
			minStep = 30,
			range,
			tickSpacing,
			niceMin,
			niceMax;
		/**
		 * Instantiates a new instance of the NiceScale class.
		 *
		 *  min the minimum data point on the axis
		 *  max the maximum data point on the axis
		 */
		function niceScale( min, max) {
		    minPoint = min;
		    maxPoint = max;
		    calculate();
		    if (height != false) {
		    	let range = niceMax - niceMin,
		    		maxNumTicks = Math.floor(height / minStep),
		    		dividers = [0.1, 0.2, 0.5];

				let step = dividers[0],
					numLines = Math.ceil(range/step),
					i = 0,
					count = 1;

				while(numLines >= maxNumTicks){
					step = dividers[i] * count;
					numLines = Math.ceil(range/step);
					if(i === 2){
						i = 0;
						count = count * 10;
					} else{
						i++;
					}
				}

				niceMax = niceMin + step * numLines;
		    }
		    return {
		        niceMinimum: niceMin,
		        niceMaximum: niceMax
		    };
		}

		/**
		 * Calculate and update values for tick spacing and nice
		 * minimum and maximum data points on the axis.
		 */
		function calculate() {
		    range = niceNum(maxPoint - minPoint, false);
		    tickSpacing = niceNum(range / (maxTicks - 1), true);
		    niceMin =
		      Math.floor(minPoint / tickSpacing) * tickSpacing;
		    niceMax =
		      Math.ceil(maxPoint / tickSpacing) * tickSpacing;
		}

		/**
		 * Returns a "nice" number approximately equal to range Rounds
		 * the number if round = true Takes the ceiling if round = false.
		 *
		 *  localRange the data range
		 *  round whether to round the result
		 *  a "nice" number to be used for the data range
		 */
		function niceNum( localRange,  round) {
		    var exponent; /** exponent of localRange */
		    var fraction; /** fractional part of localRange */
		    var niceFraction; /** nice, rounded fraction */

		    exponent = Math.floor(Math.log10(localRange));
		    fraction = localRange / Math.pow(10, exponent);

		    if (round) {
		        if (fraction < 1.5)
		            niceFraction = 1;
		        else if (fraction < 3)
		            niceFraction = 2;
		        else if (fraction < 7)
		            niceFraction = 5;
		        else
		            niceFraction = 10;
		    } else {
		        if (fraction <= 1)
		            niceFraction = 1;
		        else if (fraction <= 2)
		            niceFraction = 2;
		        else if (fraction <= 5)
		            niceFraction = 5;
		        else
		            niceFraction = 10;
		    }

		    return niceFraction * Math.pow(10, exponent);
		}

		return niceScale(minNum, maxNum);
	}

    // return the status of subscription
    async function checkSubscribtion(email){
		const API = "https://chart.pavelkuligin.ru/auth?email=" + email;

		let connectionStable = true;
		let subscrption;
		let response = await fetch(API).catch((error) => {
			  connectionStable = false;
			});

		if(connectionStable){
			subscrption = await response.json();
			subscrption.email = email;

			const folder = await fs.getDataFolder(),
			    entries = await folder.getEntries();

			let settingsExist = false,
	            settingsFile,
	            settingsJSON,
	            settings = null;

		    entries.forEach(entry => {
		        if (entry.name === "settings.json") {
		        	settingsExist = true
	          		settingsFile = entry
		        }
		    });

		    if(settingsExist){
		    	settingsJSON = await settingsFile.read();
				settings = JSON.parse(settingsJSON)

				settings.email = subscrption.email;
				settings.status = subscrption.status;
				settings.type = subscrption.type;
				settingsFile.write(JSON.stringify(settings));
		    }
		} else {
			subscrption = null;
		}

      	return subscrption;
    }

    // return template
    async function checkTemplate(email){
    	const API = "https://chart.pavelkuligin.ru/settings/" + email;

    	let response = await fetch(API),
          	data = await response.json(),
          	templates = [];

        if(data.settings != undefined){
        	templates = data.settings.data;
        }

        return templates;
    }

    // collect stats
	function collectStats(userId, email, appVersion, option, meta){
		let date = Math.floor(Date.now()/1000),
			stats = {
				"userId": userId,
				"email": email,
				"date": date,
				"app": "Chart",
				"appVersion": appVersion,
				"option": option,
				"platform": "Adobe",
				"meta": meta
			};

		fetch('https://chart.pavelkuligin.ru/collect', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(stats)
		})
	}

    // function that returns all parameters of canvases
    function getCanvas(selection){
        let canvasArr = new Array(),
            error = false,
            canvas;

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        if(selection.length > 0){
          let type = "Group"
          selection.forEach(layer => {
            if(layer instanceof Rectangle || layer instanceof Ellipse){
                layer.fill = null
                layer.stroke = null

                if(layer instanceof Rectangle){
                	type = "Rectangle"
                } else {
                	type = "Oval"
                }
                
            }

            let startNum = ((isNumeric(layer.name)) ? parseFloat(layer.name) : "false");
            let setting = layer.pluginData;

            canvas = {
              layer : layer,
              height : layer.globalBounds.height,
              width : layer.globalBounds.width,
              x : layer.topLeftInParent.x,
              y : layer.topLeftInParent.y,
              layerType : type,
              startNum : startNum,
              parent : layer.parent,
              conf : setting
            }

            canvasArr.push(canvas); 
          })
        }

        return [canvasArr, error]
    }

    // default configuration
    async function defaultConf(){
      const folder = await fs.getDataFolder()
      let template = {
        email : 'undefined',
        status : false,
        type : 'FREE',
        userId : generateUUID(),
        template : [
				{
					"name" : "Default template",
					"id" : 0,
					"colors" : {
						"common" : ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],
						"progressChart" : ["#e31a1c"],
						"sparkline" : ["#343434"],
						"scatterPlot" : ["#1f78b4"],
						"candlestickChart" : ["#33a02c", "#e31a1c"],
						"heatmap" : ["#a6cee3"]
					},
					"grid" : {
						"type" : 1,
						"lineWidth" : 1,
						"color" : "#F0F0F0"
					},
					"labels" : {
						"type" : 1,
						"fontName" : "Roboto",
						"fontStyle" : "Regular",
						"textCase" : "ORIGINAL",
						"fontSize" : 10,
						"lineHeight" : 10,
						"letterSpacing" : 0,
						"color" : "#a3a3a3",
						"yAxisPosition" : "left",
						"xAxisPosition" : "bottom"
					},
					"beginAtZero" : 0,
					"lineType" : 0,
					"sorting" : 0,
					"typeOfCircle" : 0,
					"lineChart" : {
						"lineWidth" : 2,
						"dotType" : 1,
						"dotDiameter" : 8
					},
					"areaChart" : {
						"lineWidth" : 0,
						"opacity" : 0.8
					},
					"verticalBarChart" : {
						"margin" : 0.4,
						"roundTop" : 0,
						"useOneColor" : true
					},
					"horizontalBarChart" : {
						"margin" : 0.4,
						"roundTop" : 0,
						"useOneColor" : true
					},
					"groupedBarChart" : {
						"margin" : 0.4,
						"roundTop" : 0
					},
					"groupedHorizontalBarChart" : {
						"margin" : 0.4,
						"roundTop" : 0
					},
					"donutChart" : {
						"thicknessOfDonut" : 30
					},
					"progressChart" : {
						"backgroundColor" : "#f7f7f7",
						"thicknessOfProgress" : 10,
						"endOfLine" : 0
					},
					"sparkline" : {
						"lineWidth" : 1,
						"dotDiameter" : 4
					},
					"scatterPlot" : {
						"dotDiameter" : 8
					},
					"candlestickChart" : {
						"margin" : 0.4,
						"unfilledNegativeBoxes" : false
					},
					"histogram" : {
						"margin" : 2
					},
					"heatmap" : {
						"margin" : 0,
						"segments" : 4
					}
				}]}

      const newFile = await folder.createEntry("settings.json", {overwrite: true});
      newFile.write(JSON.stringify(template));

      return template;
    }

    // colorPalette index
    function colorIndex(i, colorPalette){
      let colorLength = colorPalette.length;
      if (i + 1 > colorLength) {
        let rest = (i + 1) % colorLength;
        if (rest == 0) {
          return colorLength - 1;
        } else {
          return rest - 1;
        }
      } else {
        return i;
      }
    }

    // get settings from the store
    async function getSettings(){
      const folder = await fs.getDataFolder(),
            entries = await folder.getEntries();

        let settingsExist = false,
            settingsFile,
            settingsJSON,
            settings = null;

      entries.forEach(entry => {
        if (entry.name === "settings.json") { 
          settingsExist = true
          settingsFile = entry
        }
      });

      if(settingsExist){
        settingsJSON = await settingsFile.read()
        settings = JSON.parse(settingsJSON)
      } else {
        settings = await defaultConf()
      }

      return settings;
    }

    function setTemplate(template, email){
		let settings = {
				email : email,
				settings : {
				  	data : template
				}
			}
		fetch('https://chart.pavelkuligin.ru/settings/', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(settings)
		})
	}

    async function setSettings(newSettings){
    	const folder = await fs.getDataFolder(),
            entries = await folder.getEntries();

        entries.forEach(entry => {
	        if (entry.name === "settings.json") {
	        	entry.write(JSON.stringify(newSettings));
	        }
	    });

        setTemplate(newSettings.template, newSettings.email)
    }

    // margins
	function calculateMargins(canvas, data, conf, chartType){
		let originalWidth = canvas.width,
			xLabelsWidth = [],
			yLabelsWidth = [],
			realLabelsIndex = [],
			realLabelsX = [],
			minMaxArray = [data.niceMin, data.niceMax],
			margins = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			};
		
		// Y labels
		for(let i = 0; i < minMaxArray.length; i++){
			let text = new Text();                  
	    		text.text = (minMaxArray[i]).toString() + data.symbol;
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

			canvas.parent.addChild(text);
		  	yLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minW = 11 + Math.max(...yLabelsWidth)
		
		// X labels
		for(let i = 0; i < data.header.length; i++){
		  	let text = new Text();                  
	    		text.text = (data.header[i]).toString();
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	xLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minX = Math.max( ...xLabelsWidth ) + 20;
		if(minX < 60){minX = 60}
		else if(minX > 100){minX = 100}

		if(conf.labels.type === 1){
			(minW > xLabelsWidth[0]/2) ? margins.left = minW : margins.left = Math.ceil(xLabelsWidth[0]/2);
			margins.top = conf.labels.fontSize/2;
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(xLabelsWidth[xLabelsWidth.length-1]/2);

			if(chartType == "verticalBarChart" || chartType == "groupedBarChart"){
				margins.right = 0;
			}
		} else if(conf.labels.type === 2){
			margins.left = minW;
			margins.top = conf.labels.fontSize/2;
			margins.bottom = conf.labels.fontSize/2;
		} else if(conf.labels.type === 3){
			margins.left = Math.ceil(xLabelsWidth[0]/2);
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(xLabelsWidth[xLabelsWidth.length-1]/2);

			if(chartType == "verticalBarChart" || chartType == "groupedBarChart"){
				margins.left = 0;
				margins.right = 0;
			}
		}

		canvas.x = canvas.x + margins.left;
		canvas.y = canvas.y + margins.top;
		canvas.width = canvas.width - margins.left - margins.right;
		canvas.height = canvas.height - margins.top - margins.bottom;

		// helpers
		let initialStep = canvas.width / (data.columns - 1),
			counter = Math.ceil(minX / initialStep),
			numLabels = Math.floor((data.columns - 1) / counter),
			step = initialStep * counter;
		
		if(chartType === "candlestickChart"){
			initialStep = Math.floor(canvas.width / data.columns);
			counter = Math.ceil(minX / initialStep);
			numLabels = Math.ceil(data.columns / counter) - 1;
			step = initialStep * counter;
		}
		
		// workaround for first and last label case
		if(data.header != false){
			data.header.forEach(header => {
				if (header === "") {
					counter = 1;
					numLabels = data.header.length - 1;
					step = canvas.width / (data.columns - 1);

					if(chartType === "candlestickChart"){
						step = initialStep;
					}
				}
			})
		}

		// positions of all labels
		for (let i=0; i < numLabels + 1; i++) {
			let positionX = canvas.x + step * i;
			realLabelsIndex.push(i*counter)
			realLabelsX.push(Math.floor(positionX) + xLabelsWidth[i*counter])
		}

		let actualWidth = canvas.width + canvas.x,
			lastLabelX = realLabelsX[realLabelsX.length-1] - xLabelsWidth[realLabelsIndex[realLabelsIndex.length-1]]/2;
			
		if(actualWidth > lastLabelX){
			canvas.width += margins.right;
			if(chartType === "candlestickChart"){
				initialStep = Math.floor(canvas.width / data.columns);
			} else {
				initialStep = canvas.width / (data.columns - 1);
			}
			step = initialStep * counter;
		}

		if(canvas.width % 2){
			canvas.width = canvas.width - 1;
		}

		return {
			minX : minX,
			minW : minW,
			numLabels : numLabels,
			step : step, 
			counter : counter,
			initialStep : initialStep
		}
	}

	function calculateMarginsHorizontal(canvas, data, conf, chartType){
		let originalWidth = canvas.width,
			xLabelsWidth = [],
			yLabelsWidth = [],
			minMaxArray = [data.niceMin, data.niceMax],
			margins = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			};
		
		// X labels
		for(let i = 0; i < minMaxArray.length; i++){
			let text = new Text();                  
	    		text.text = (minMaxArray[i]).toString() + data.symbol;
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	yLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minX = Math.max( ...yLabelsWidth ) + 20;
		if(minX < 60){minX = 60}
		else if(minX > 100){minX = 100}
		
		// Y labels
		for(let i = 0; i < data.header.length; i++){
			let text = new Text();                  
	    		text.text = (data.header[i]).toString();
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	xLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minW = 11 + Math.max(...xLabelsWidth)

		if(conf.labels.type === 1){
			margins.left = minW;
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(yLabelsWidth[yLabelsWidth.length-1]/2);
		} else if(conf.labels.type === 2){
			margins.left = Math.ceil(yLabelsWidth[0]/2);
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(yLabelsWidth[yLabelsWidth.length-1]/2);
		} else if(conf.labels.type === 3){
			margins.left = minW;
		}

		canvas.x = canvas.x + margins.left;
		canvas.y = canvas.y + margins.top;
		canvas.width = canvas.width - margins.left - margins.right;
		canvas.height = canvas.height - margins.top - margins.bottom;

		// helpers
		let initialStep = canvas.width / (data.columns - 1),
			counter = Math.ceil(minX / initialStep),
			numLabels = Math.floor((data.columns - 1) / counter),
			step = initialStep * counter;

		return {
			minX : minX,
			minW : minW,
			numLabels : numLabels,
			step : step, 
			counter : counter
		}
	}

	function calculateMarginsHistogram(canvas, data, conf, chartType){
		let originalWidth = canvas.width,
			xLabelsWidth = [],
			yLabelsWidth = [],
			realLabelsIndex = [],
			realLabelsX = [],
			minMaxArrayX = [data.xNiceMin, data.xNiceMax],
			minMaxArrayY = [data.yNiceMin, data.yNiceMax],
			margins = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			};
		
		// X labels
		for(let i = 0; i < minMaxArrayX.length; i++){
			let text = new Text();                  
	    		text.text = (minMaxArrayX[i]).toString() + data.symbol;
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	xLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minX = Math.max( ...xLabelsWidth ) + 20;
		if(minX < 60){minX = 60}
		else if(minX > 100){minX = 100}
		
		// Y labels
		for(let i = 0; i < minMaxArrayY.length; i++){
			let text = new Text();                  
	    		text.text = (minMaxArrayY[i]).toString() + data.symbol;
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	yLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minW = 11 + Math.max(...yLabelsWidth)

		if(conf.labels.type === 1){
			margins.top = conf.labels.fontSize/2;
			margins.left = minW;
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(xLabelsWidth[xLabelsWidth.length-1]/2);
		} else if(conf.labels.type === 2){
			margins.left = minW;
			margins.top = conf.labels.fontSize/2;
			margins.bottom = conf.labels.fontSize/2;
		} else if(conf.labels.type === 3){
			margins.left = Math.ceil(xLabelsWidth[0]/2);
			margins.bottom = 10 + conf.labels.fontSize;
			margins.right = Math.ceil(xLabelsWidth[xLabelsWidth.length-1]/2);
		}

		canvas.x = canvas.x + margins.left;
		canvas.y = canvas.y + margins.top;
		canvas.width = canvas.width - margins.left - margins.right;
		canvas.height = canvas.height - margins.top - margins.bottom;

		// helpers
		let initialStep = canvas.width / (data.columns - 1),
			counter = Math.ceil(minX / initialStep),
			numLabels = Math.floor((data.columns - 1) / counter),
			step = initialStep * counter;

		return {
			minX : minX,
			minW : minW,
			numLabels : numLabels,
			step : step, 
			counter : counter
		}
	}

	function calculateMarginsHeatmap(canvas, data, conf, chartType){
		let originalWidth = canvas.width,
			xLabelsWidth = [],
			yLabelsWidth = [],
			minMaxArray = [data.niceMin, data.niceMax],
			margins = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			};
		
		// X labels
		for(let i = 0; i < data.horizontalHeaders.length; i++){
			let text = new Text();                  
	    		text.text = (data.horizontalHeaders[i]).toString();
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	xLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minX = Math.max( ...xLabelsWidth ) + 20;
		if(minX < 60){minX = 60}
		else if(minX > 100){minX = 100}
		
		// Y labels
		for(let i = 0; i < data.header.length; i++){
		  	let text = new Text();                  
	    		text.text = (data.horizontalHeaders[i]).toString();
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = "ALIGN_CENTER";
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

	    	canvas.parent.addChild(text);
		  	yLabelsWidth.push(text.globalBounds.width);
		  	text.removeFromParent();
		}
		let minW = 11 + Math.max(...yLabelsWidth)

		if(conf.labels.type === 1){
			margins.left = minW;
			margins.bottom = 10 + conf.labels.fontSize;
		} else if(conf.labels.type === 2){
			margins.bottom = 10 + conf.labels.fontSize;
		} else if(conf.labels.type === 3){
			margins.left = minW;
		}

		canvas.x = canvas.x + margins.left;
		canvas.y = canvas.y + margins.top;
		canvas.width = canvas.width - margins.left - margins.right;
		canvas.height = canvas.height - margins.top - margins.bottom;

		// helpers
		let initialStep = canvas.width / (data.columns - 1),
			counter = Math.ceil(minX / initialStep),
			numLabels = Math.floor((data.columns - 1) / counter),
			step = initialStep * counter;

		return {
			minX : minX,
			minW : minW,
			numLabels : numLabels,
			step : step, 
			counter : counter
		}
	}

    function createGroup(selection, nodes, name){
    	selection.items = nodes;
    	commands.group();
    	let group = selection.items[0];
    	group.name = name;
    }

// Helper SVG functions
	function moveToPoint(x,y){
		return "M " + Math.floor(x) + " " + Math.floor(y);
	}

	function lineToPoint(x,y){
		return " L " + Math.floor(x) + " " + Math.floor(y);
	}

	function curveToPoint(points){
		return " C " + Math.floor(points.c1x) + " " + Math.floor(points.c1y) + " " + Math.floor(points.c2x) + " " + Math.floor(points.c2y) + " " + Math.floor(points.x) + " " + Math.floor(points.y);
	}

	function path(canvas, data, conf, i, dir){
		let x0 = canvas.x,
			y = 0,
			yAxe = data.niceMax - data.niceMin,
			zero = canvas.y + canvas.height,
			xStep = canvas.width / (data.columns - 1),
			y0 = zero - (( canvas.height / yAxe ) * (Number(data.table[i][0]) - data.niceMin) );

		if(dir === "back"){
			x0 = canvas.x + canvas.width;
			y0 = zero - (( canvas.height / yAxe ) * (Number(data.table[i][data.columns - 1]) - data.niceMin) )
		}

		let xLast = x0,
			yLast = y0,
			xNext = 0,
			pathData = moveToPoint(x0,y0),
			m = 0,
	        dx1 = 0,
	        dy1 = 0,
	        dx2 = 0,
	        dy2 = 0,
	        preP = {
	        	x : x0,
	        	y : y0
	        },
	        nexP = {},
	        f,
	        t;

	    function gradient(a, b) {
	        return (b.y-a.y)/(b.x-a.x);
	    }

	    if(dir === "forward"){
	    	for (let j = 1; j < data.columns; j++) {

				if(conf.lineType === 0){
					f = 0.5;
					t = 0;
				} else if(conf.lineType === 1){
					f = 0;
					t = 0;
				} else {
					f = 0.3;
					t = 0.5;
				}

				xNext = xLast + xStep;
				y = zero - (( canvas.height / yAxe ) * (Number(data.table[i][j]) - data.niceMin) );

				let curP = {
						x : xNext,
						y : y
					};
				if(j == data.columns - 1){
					dx2 = 0;
		            dy2 = 0;
				} else {
					nexP = {
		            	x : xNext + xStep,
		            	y : zero - (( canvas.height / yAxe ) * (Number(data.table[i][j+1]) - data.niceMin) )
		            };
		            m = gradient(preP, nexP);
		            dx2 = (nexP.x - curP.x) * -f;
		            dy2 = dx2 * m * t;
				}

				let points = {
					x : curP.x,
					y : curP.y,
					c1x : preP.x - dx1,
					c1y : preP.y - dy1,
					c2x : curP.x + dx2,
					c2y : curP.y + dy2
				}
				pathData += curveToPoint(points);

				dx1 = dx2;
		        dy1 = dy2;
		        preP = curP;


				xLast = xNext;
				yLast = y;
			}
	    } else {
	    	pathData = "";

	    	for (let j = data.columns - 2; j >= 0 ; j--) {

				if(conf.lineType === 0){
					f = 0.5;
					t = 0;
				} else if(conf.lineType === 1){
					f = 0;
					t = 0;
				} else {
					f = 0.3;
					t = 0.5;
				}

				xNext = xLast - xStep;
				y = zero - (( canvas.height / yAxe ) * (Number(data.table[i][j]) - data.niceMin) );

				let curP = {
						x : xNext,
						y : y
					};
				if(j == 0){
					dx2 = 0;
		            dy2 = 0;
				} else {
					nexP = {
		            	x : xNext - xStep,
		            	y : zero - (( canvas.height / yAxe ) * (Number(data.table[i][j-1]) - data.niceMin) )
		            };
		            m = gradient(preP, nexP);
		            dx2 = (nexP.x - curP.x) * -f;
		            dy2 = dx2 * m * t;
				}

				let points = {
					x : curP.x,
					y : curP.y,
					c1x : preP.x - dx1,
					c1y : preP.y - dy1,
					c2x : curP.x + dx2,
					c2y : curP.y + dy2
				}
				pathData += curveToPoint(points);

				dx1 = dx2;
		        dy1 = dy2;
		        preP = curP;


				xLast = xNext;
				yLast = y;
			}
	    }

		return pathData;
	}

	function createOval(cx,cy,r){
		let oval = "M " + cx + " " + cy + " m -" + r + ", 0 a " + r + "," + r + " 0 1,0 " + r*2 + ",0 a " + r + "," + r + " 0 1,0 -" + r*2 + ",0";
		return oval;
	}

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	  return {
	    x: centerX + (radius * Math.cos(angleInRadians)),
	    y: centerY + (radius * Math.sin(angleInRadians))
	  };
	}

// PROCESS DATA
	// Create random data set
	function createRandomData(rows, columns, min, max, distr, type){
		let dataRow = new Array(),
			dataTable = new Array(),
			dataMax = new Array(),
			dataMin = new Array(),
			headers = [];

		function randNum(min, max, col){
			min = Number(min);
		  	max = Number(max);
		  	col = Number(col);
		    let data = new Array();

		    for (let i=0; i<col; i++){
		        data[i] = Number(Math.random() * (max - min) + min).toFixed(0)
		    }

		    return data
		}

		function trendUp(min, max, col){
		  min = Number(min);
		  max = Number(max);
		  col = Number(col);
		  let step = ( max - min ) / col,
		      data = new Array();

		  for (let i=0; i<col; i++){
		  	  let tempNum = min + step * (Math.random() * (1.3 - 0.5) + 0.5)
		  	  min += tempNum - min
		      data[i] = tempNum.toFixed(0);
		  }
		  return data
		}

		function trendDown(min, max, col){
		  min = Number(min);
		  max = Number(max);
		  col = Number(col);
		  let step = ( max - min ) / col,
		      data = new Array();

		  for (let i=0; i<col; i++){
		      let tempNum = max - step * (Math.random() * (1.3 - 0.5) + 0.5);
		      max -= max - tempNum;
		      data[i] = tempNum.toFixed(0)
		  }
		  return data
		}

		function normalDistr(min, max, col){
			max = Number(max);
		    min = Number(min);
		    col = Number(col-1);

			let data = new Array(),
			    originalMax = max;

			for(let i = 0; i <= col; i++){
				max = max * Math.random();
				let c = min,
			    	b = 4*(max-min)/col,
			    	a = -b/col;
			    let tempNum = a*(i**2) + b*i + c;
			    data[i] = tempNum.toFixed(0);
			    max = originalMax;
			}
			return data
		}

		let funcArr = [
		  randNum,
		  trendUp,
		  trendDown,
		  normalDistr
		]

		if(type == "candlestickChart"){
			function newRandom(min, max) {
				return Math.random() * (max - min) + min;
			}

			let range = max - min,
				minTrend = min + newRandom(range*0.1, range*0.3),
				maxTrend = max - newRandom(range*0.1, range*0.3),
				trendStep = (maxTrend - minTrend) / columns,
				startUp = minTrend,
				startDown = maxTrend,
				centerPoint,
				high,
				close,
				open,
				low,
				delta,
				highArr = new Array(),
				closeArr = new Array(),
				openArr = new Array(),
				lowArr = new Array();

			for (var j = 0; j < columns; j++) {
		      if (distr == "1") {
		        // Up
		        centerPoint = Number(startUp) + trendStep * newRandom(0.7, 1.3);
		        startUp = centerPoint;
		      } else if(distr == "2") {
		        // Down
		        centerPoint = Number(startDown) - trendStep * newRandom(0.7, 1.3);
		        startDown = centerPoint;
		      } else {
		        // Noise
		        centerPoint = newRandom(range*0.1, range*0.9);
		      }

		      high = centerPoint * newRandom(1.1, 1.3);
		      low = centerPoint * newRandom(0.7, 0.9);
		      delta = high - low;
		      close = newRandom(Number(low) + 0.2 * delta, Number(high) - 0.2 * delta);

		      if (close < high - (high - low) / 2) {
		        var openDelta = high - close;
		        open = newRandom(Number(close) + 0.2 * openDelta, Number(high) - 0.2 * openDelta);
		      } else {
		        var openDelta = close - low;
		        open = newRandom(Number(low) + 0.2 * openDelta, Number(close) - 0.2 * openDelta);
		      }

		      highArr[j] = high.toFixed(0);
		      closeArr[j] = close.toFixed(0);
		      openArr[j] = open.toFixed(0);
		      lowArr[j] = low.toFixed(0);
		    }

		    dataTable[0] = highArr;
		    dataTable[1] = closeArr;
		    dataTable[2] = openArr;
		    dataTable[3] = lowArr;
		} else {
			for(let i = 0; i < rows; i++){
				if(distr == "0"){
					dataRow = randNum(min, max, columns)
				} else if(distr == "1"){
					dataRow = trendUp(min, max, columns)
				} else if(distr == "2"){
					if (type == "scatterPlot" && i == 0) {
						dataRow = trendUp(min, max, columns)
					} else {
						dataRow = trendDown(min, max, columns)
					}
				} else if(distr == "3"){
					if (type == "scatterPlot" && i == 0) {
						dataRow = trendUp(min, max, columns)
					} else {
						dataRow = normalDistr(min, max, columns)
					}
				} else {
					let randNum = Number(Math.random() * (funcArr.length - 1)).toFixed(0);
					dataRow = funcArr[randNum](min, max, columns)
				}
				dataTable[i] = dataRow;
				dataMax[i] = Math.max( ...dataRow )
				dataMin[i] = Math.min( ...dataRow )
			}
		}

		for (let h = 0; h < columns; h++) {
			headers[h] = "Text"
		}

		let dataObj = {
			table : dataTable,
			max : Math.max( ...dataMax ),
			min : Math.min( ...dataMin ),
			rows : dataTable.length,
			columns : dataTable[0].length,
			header : headers,
			symbol : ""
		}

		return dataObj;
	}

	// Create data set from real data
	function processData(csv){
		function transpose(a) {
			return Object.keys(a[0]).map(function(c) {
				return a.map(function(r) { return r[c]; });
			});
		}

		function isNumeric(n) {
		    return !isNaN(parseFloat(n)) && isFinite(n);
		}

		function tableMin(N) {
		    let min = new Array();
		    for(let i in N){
		      min[i] = Math.min(...N[i]);
		    }
		    return Math.min(...min);
		}

		function tableMax(N) {
		    let max = new Array();
		    for(let i in N){
		      max[i] = Math.max(...N[i]);
		    }
		    return Math.max(...max);
		}

		function parseNumber(num){
			let numText = num.toString(), 
				commaIndex = numText.lastIndexOf(','),
				dotIndex = numText.lastIndexOf('.'),
				cleanNumber;
				symbol = numText.match(/[%$£€]/)
			
			if(symbol === null){
				symbol = ""
			} else {
				symbol = symbol[0]
			}

			if(commaIndex >= 0 && commaIndex > dotIndex){
				cleanNumber = numText.replace(/[^\d,-]/g, '').replace(/[,]/g, '.');
			} else if(dotIndex >= 0 && dotIndex > commaIndex){
				cleanNumber = numText.replace(/[^\d.-]/g, '');
			} else if(commaIndex < 0){
				cleanNumber = numText.replace(/[^\d.-]/g, '');
			} else if(dotIndex < 0){
				cleanNumber = numText.replace(/[^\d,-]/g, '').replace(/[,]/g, '.');
			}

			return cleanNumber
		}

		let dataObj,
			symbol;

		if(csv.type === null){
			let col = csv.data[0].length,
				row = csv.data.length,
				newData = csv.data,
				header;

			if (csv.headers == true) {
				header = newData[0];
				newData.splice(0, 1);
				for(let i = 0; i < row-1; i++){
					for(let j = 0; j < col; j++){
						newData[i][j] = parseFloat(parseNumber(newData[i][j]));
					}
				}
				row = row - 1;

			} else {
				header = false;
				for(let i = 0; i < row; i++){
					for(let j = 0; j < col; j++){
						newData[i][j] = parseFloat(parseNumber(newData[i][j]));
					}
				}
			}
			
			dataObj = {
				table : newData,
				rows : row,
				columns : col,
				min : tableMin(newData),
				max : tableMax(newData),
				header : header,
				symbol : symbol
			}
		} else {
			let newData = new Array(),
				selectedRows = new Array(),
				headerIndex,
				transposedTable = transpose(csv.data)

			csv.columns.forEach(column => {
				if(column.checked){
					selectedRows.push(column.index);
				}
			})
			selectedRows.forEach(row => {
				newData.push(transposedTable[row])
			})
			for(let i = 0; i < newData.length; i++){
				for(let j = 0; j < newData[0].length; j++){
					newData[i][j] = parseFloat(parseNumber(newData[i][j]));
				}
			}

			csv.header.forEach(header => {
				if(header.checked){
					headerIndex = header.index;
				}
			})

			dataObj = {
				table : newData,
				rows : newData.length,
				columns : newData[0].length,
				min : tableMin(newData),
				max : tableMax(newData),
				header : transposedTable[headerIndex],
				symbol : symbol
			}
		}

		return dataObj;
	}

	// Create data set from JSON
	function processJSON(JSON, rawKeys, rawHeader){
		let keys = new Array(),
			headerKey = "",
			dataTable = new Array(),
			dataMax = new Array(),
			dataMin = new Array();

		function getValues(obj, key) {
			var objects = [];
			for (var i in obj) {
			    if (!obj.hasOwnProperty(i)) continue;
			    if (typeof obj[i] == 'object') {
			        objects = objects.concat(getValues(obj[i], key));
			    } else if (i == key) {
			        objects.push(obj[i]);
			    }
			}
			return objects;
		}

		function parseNumber(num){
			let numText = num.toString(), 
				commaIndex = numText.lastIndexOf(','),
				dotIndex = numText.lastIndexOf('.'),
				cleanNumber;
				symbol = numText.match(/[%$£€]/)
			
			if(symbol === null){
				symbol = ""
			} else {
				symbol = symbol[0]
			}

			if(commaIndex >= 0 && commaIndex > dotIndex){
				cleanNumber = numText.replace(/[^\d,-]/g, '').replace(/[,]/g, '.');
			} else if(dotIndex >= 0 && dotIndex > commaIndex){
				cleanNumber = numText.replace(/[^\d.-]/g, '');
			} else if(commaIndex < 0){
				cleanNumber = numText.replace(/[^\d.-]/g, '');
			} else if(dotIndex < 0){
				cleanNumber = numText.replace(/[^\d,-]/g, '').replace(/[,]/g, '.');
			}

			return cleanNumber
		}

		rawKeys.forEach(key => {
			if(key.checked == true){
				keys.push(key.name)
			}
		})

		rawHeader.forEach(header => {
			if(header.checked == true){
				headerKey = header.name
			}
		})

		let headers = getValues(JSON, headerKey),
			symbol;

		for(let i in keys){
			let row = getValues(JSON, keys[i]);
			for (let j in row) {
				row[j] = parseFloat(parseNumber(row[j]));
			}
			dataTable[i] = row;
			dataMax[i] = Math.max( ...dataTable[i] );
			dataMin[i] = Math.min( ...dataTable[i] );
		}

		let dataObj = {
			table : dataTable,
			max : Math.max( ...dataMax ),
			min : Math.min( ...dataMin ),
			rows : dataTable.length,
			columns : dataTable[0].length,
	        header : headers,
	        symbol : symbol
		}

		return dataObj;
	}

// GRIDS
	function xAxisGrid(conf, canvas, data, group, chartType, marginsData){
		let numLines = marginsData.numLabels,
			step = marginsData.step,
			counter = marginsData.counter,
			lineCounter;

		if(chartType === "candlestickChart"){
			let gridLine = new Path();
				gridLine.pathData = moveToPoint(canvas.x, canvas.y) + lineToPoint(canvas.x, canvas.y + canvas.height);
				gridLine.stroke = new Color(conf.grid.color);
				gridLine.strokeWidth = conf.grid.lineWidth;
				gridLine.name = "Grid_v_0";

				canvas.parent.addChild(gridLine);
				group.push(gridLine);
		}

		for(let i=0; i < numLines + 1; i++){
			let positionX = canvas.x + step * i;
			if(chartType === "candlestickChart"){
				positionX = canvas.x + marginsData.initialStep / 2 + step * i;
			}
			let gridLine = new Path();
				gridLine.pathData = moveToPoint(positionX, canvas.y) + lineToPoint(positionX, canvas.y + canvas.height);
				gridLine.stroke = new Color(conf.grid.color);
				gridLine.strokeWidth = conf.grid.lineWidth;
				gridLine.name = "Grid_v_" + (i+1);

				canvas.parent.addChild(gridLine);
				group.push(gridLine);
			    lineCounter = i;
		}

		if (canvas.width > step*numLines) {
			let gridLine = new Path();
				gridLine.pathData = moveToPoint(canvas.x + canvas.width, canvas.y) + lineToPoint(canvas.x + canvas.width, canvas.y + canvas.height);
				gridLine.stroke = new Color(conf.grid.color);
				gridLine.strokeWidth = conf.grid.lineWidth;
				gridLine.name = "Grid_v_" + (lineCounter+1);

				canvas.parent.addChild(gridLine);
				group.push(gridLine);
		}
	}

	function yAxisGrid(conf, canvas, data, group, dir, chartType){
		let minStepPx = 30,
		    range = data.niceMax - data.niceMin,
		    maxNumTicks = Math.floor(canvas.height / minStepPx),
		    dividers = [0.1, 0.2, 0.5],
		    axisNum = data.niceMin;

		if((chartType === "scatterPlot" && dir === "vertical") || (chartType === "histogram" && dir === "vertical")){
			range = data.yNiceMax - data.yNiceMin;
			axisNum = data.yNiceMin;
		} else if((chartType === "scatterPlot" && dir === "horizontal") || (chartType === "histogram" && dir === "horizontal")){
			range = data.xNiceMax - data.xNiceMin;
			axisNum = data.xNiceMin;
		}

		if(dir === "horizontal"){
			minStepPx = 40;
			maxNumTicks = Math.floor(canvas.width / minStepPx)
		}

		let step = dividers[0],
			numLines = Math.ceil(range/step),
			i = 0,
			count = 1;

		while(numLines >= maxNumTicks){
			step = dividers[i] * count;
			numLines = Math.ceil(range/step);
			if(i === 2){
				i = 0;
				count = count * 10;
			} else{
				i++;
			}
		}

		let textStep = step;
		step = canvas.height / numLines;

		if(dir === "horizontal"){ step = canvas.width / numLines }

		for(let i=0; i < numLines + 1; i++){
			let positionY = canvas.y + canvas.height - (step * i),
				path = moveToPoint(canvas.x, positionY) + lineToPoint(canvas.x + canvas.width, positionY);

			if(dir === "horizontal"){ 
				positionY = canvas.x + (step * i);
				path = moveToPoint(positionY, canvas.y) + lineToPoint(positionY, canvas.y + canvas.height);
			}

			let gridLine = new Path();
				gridLine.pathData = path;
				gridLine.stroke = new Color(conf.grid.color);
				gridLine.strokeWidth = conf.grid.lineWidth;
				gridLine.name = "Grid_" + (i+1);

				canvas.parent.addChild(gridLine);
				group.push(gridLine);
		}
	}

	function xAxisDistrGrid(conf, canvas, data, group, dir){
		if(dir === "horizontal"){
			let xStep = canvas.width / data.columns,
				x0x = canvas.x,
				y0x = canvas.y,
				y1x = canvas.y + canvas.height;

			for(let i=0; i < data.columns + 1; i++){
				let gridLine = new Path();
					gridLine.pathData = moveToPoint(x0x,y0x) + lineToPoint(x0x,y1x);
					gridLine.stroke = new Color(conf.grid.color);
					gridLine.strokeWidth = conf.grid.lineWidth;
					gridLine.name = "Grid_v_" + (i+1);

					canvas.parent.addChild(gridLine);
					group.push(gridLine);

				    x0x = x0x + xStep;
			}
		} else {
			let yStep = canvas.height / data.columns,
				y0x = canvas.y,
				x0x = canvas.x,
				x1x = canvas.x + canvas.width;

			for(let i=0; i < data.columns+1; i++){
				let gridLine = new Path();
					gridLine.pathData = moveToPoint(x0x,y0x) + lineToPoint(x1x,y0x);
					gridLine.stroke = new Color(conf.grid.color);
					gridLine.strokeWidth = conf.grid.lineWidth;
					gridLine.name = "Grid_v_" + (i+1);

					canvas.parent.addChild(gridLine);
					group.push(gridLine);

				    y0x = y0x + yStep;
			}
		}
	}

// LABELS
	function xAxisLabels(canvas, data, group, conf, marginsData, chartType){
		let numLabels = marginsData.numLabels,
			step = marginsData.step,
			counter = marginsData.counter;

		for (let i=0; i < numLabels + 1; i++) {
			let positionX = canvas.x + step * i;

			if(chartType === "candlestickChart"){
				positionX = canvas.x + marginsData.initialStep / 2 + step * i;
			}

			if (data.header != false && data.header[i] != "") {
			  	let text = new Text();                  
		    		text.text = (data.header[i * counter]).toString();
		    		text.fontSize = conf.labels.fontSize;
		    		text.fontFamily = conf.labels.fontName;
		    		text.fontStyle = conf.labels.fontStyle;
		    		text.charSpacing = conf.labels.letterSpacing;
		    		text.textTransform = "none";
		    		text.textAlign = Text.ALIGN_CENTER;
		    		text.lineSpacing = conf.labels.lineHeight;
		    		text.fill = new Color(conf.labels.color);

			  	group.push(text);
			  	canvas.parent.addChild(text);
			  	text.translation = {x: Math.floor(positionX), y: Math.floor(canvas.y + canvas.height + 10) - text.localBounds.y}
		    }
		}
	}

	function yAxisLabels(canvas, data, group, conf, dir, chartType, minW){
		let minStepPx = 30,
		    range = data.niceMax - data.niceMin,
		    maxNumTicks = Math.floor(canvas.height / minStepPx),
		    dividers = [0.1, 0.2, 0.5],
		    axisNum = data.niceMin;

		if((chartType === "scatterPlot" && dir === "vertical") || (chartType === "histogram" && dir === "vertical")){
			range = data.yNiceMax - data.yNiceMin;
			axisNum = data.yNiceMin;
		} else if((chartType === "scatterPlot" && dir === "horizontal") || (chartType === "histogram" && dir === "horizontal")){
			range = data.xNiceMax - data.xNiceMin;
			axisNum = data.xNiceMin;
		}

		if(dir === "horizontal"){
			minStepPx = 40;
			maxNumTicks = Math.floor(canvas.width / minStepPx)
		}

		let step = dividers[0],
			numLines = Math.ceil(range/step),
			i = 0,
			count = 1;

		while(numLines >= maxNumTicks){
			step = dividers[i] * count;
			numLines = Math.ceil(range/step);
			if(i === 2){
				i = 0;
				count = count * 10;
			} else{
				i++;
			}
		}

		let textStep = step;
		step = canvas.height / numLines;

		if(dir === "horizontal"){ step = canvas.width / numLines }

		for(let i=0; i < numLines + 1; i++){
			let textFrame = new Rectangle(Math.floor(canvas.x - minW), Math.floor(canvas.y + canvas.height - (step * i) - conf.labels.lineHeight/2), 50, conf.labels.lineHeight),
				textAlignment = Text.ALIGN_RIGHT;

			if(dir === "horizontal"){
				textAlignment = Text.ALIGN_CENTER;
			}

			let textValue;
			if(data.symbol === "%"){
				textValue = (Math.round(axisNum * 100)/100).toString() + data.symbol;
			} else {
				textValue = data.symbol + (Math.round(axisNum * 100)/100).toString();
			}

			let text = new Text();                  
	    		text.text = textValue;
	    		text.fontSize = conf.labels.fontSize;
	    		text.fontFamily = conf.labels.fontName;
	    		text.fontStyle = conf.labels.fontStyle;
	    		text.charSpacing = conf.labels.letterSpacing;
	    		text.textTransform = "none";
	    		text.textAlign = textAlignment;
	    		text.lineSpacing = conf.labels.lineHeight;
	    		text.fill = new Color(conf.labels.color);

		    group.push(text);
		    canvas.parent.addChild(text);

		    if(dir == "vertical"){ 
		    	text.translation = {x: Math.floor(canvas.x - minW), y: Math.floor(canvas.y + canvas.height - (step * i) - conf.labels.lineHeight/2) - text.localBounds.y};
		    	text.areaBox = {width: minW - 10, height: text.localBounds.height};
		    }
		    if(dir == "horizontal"){ text.translation = {x: Math.floor(canvas.x + (step * i)), y: Math.floor(canvas.y + canvas.height + conf.labels.lineHeight) - text.localBounds.y} }
		    axisNum = Math.round(axisNum * 100)/100 + textStep;
		}
	}

	function xAxisDistrLabels(canvas, data, group, conf, dir, chartType, minW){
		if(dir === "horizontal"){
			let xStep = canvas.width / data.columns,
				x0x = canvas.x,
				numberColumns = data.columns;

			if(chartType === "heatmap"){
				let margin = conf.heatmap.margin;
				data.header = data.horizontalHeaders;
				numberColumns = data.rows;
				xStep = (canvas.width - (margin * (numberColumns-1))) / numberColumns
				x0x = canvas.x
			}

			for (let i=0; i < numberColumns; i++) {
				if (data.header != false) {
					let text = new Text();                  
			    		text.text = data.header[i];
			    		text.fontSize = conf.labels.fontSize;
			    		text.fontFamily = conf.labels.fontName;
			    		text.fontStyle = conf.labels.fontStyle;
			    		text.charSpacing = conf.labels.letterSpacing;
			    		text.textTransform = "none";
			    		text.textAlign = Text.ALIGN_CENTER;
			    		text.lineSpacing = conf.labels.lineHeight;
			    		text.fill = new Color(conf.labels.color);

			    	group.push(text);
		    		canvas.parent.addChild(text);

			    	text.translation = {x: Math.floor(x0x), y: Math.floor(canvas.y + canvas.height + 10) - text.localBounds.y};
			    	text.areaBox = {width: xStep, height: text.localBounds.height};
			    }
			    x0x = x0x + xStep;
			    if(chartType === "heatmap"){ x0x += conf.heatmap.margin; }
			}
		} else {
			let yStep = canvas.height / data.columns,
				y0x = canvas.y + ( yStep - 10 ) / 2;

			for (let i=0; i < data.columns; i++) {
				if (data.header != false) {
					let text = new Text();                  
			    		text.text = data.header[i];
			    		text.fontSize = conf.labels.fontSize;
			    		text.fontFamily = conf.labels.fontName;
			    		text.fontStyle = conf.labels.fontStyle;
			    		text.charSpacing = conf.labels.letterSpacing;
			    		text.textTransform = "none";
			    		text.textAlign = Text.ALIGN_CENTER;
			    		text.lineSpacing = conf.labels.lineHeight;
			    		text.fill = new Color(conf.labels.color);

			    	group.push(text);
		    		canvas.parent.addChild(text);

			    	text.translation = {x: Math.floor(canvas.x - minW + 10), y: Math.floor(y0x) - text.localBounds.y};
			    }
			    y0x = y0x + yStep;
			}
		}
	}

// CHARTS
	// Line chart
		function createDots(canvas, conf, data, i, group){				
			let x = canvas.x,
				y = 0,
				yAxe = data.niceMax - data.niceMin,
				zero = canvas.y + canvas.height,
				xStep = canvas.width / (data.columns - 1),
				radius = conf.lineChart.dotDiameter;

			for (let j = 0; j < data.columns; j++) {
				y = zero - (( canvas.height / yAxe ) * (Number(data.table[i][j]) - data.niceMin) );

				let dot = new Ellipse();
					dot.radiusX = radius/2;
					dot.radiusY = radius/2;
					dot.name = "Dot_" + (i + 1) + (j + 1);
					dot.translation = {x: Math.floor(x) - radius/2, y: Math.floor(y) - radius/2}

				if (conf.lineChart.dotType == 1) {
					dot.fill = new Color(conf.colors.common[colorIndex(i, conf.colors.common)]);
				} else {
					dot.fill = new Color("#fff");
					dot.stroke = new Color(conf.colors.common[colorIndex(i, conf.colors.common)]);
					dot.strokeWidth = conf.lineChart.lineWidth;
				}
				group.push(dot);
				canvas.parent.addChild(dot);
				x = x + xStep;
			}
		}

		function createLineChart(canvas, conf, data, i, group){
			let pathData = path(canvas, data, conf, i, "forward");

			let line = new Path();
				line.pathData = pathData;
				line.stroke = new Color(conf.colors.common[colorIndex(i, conf.colors.common)]);
				line.strokeWidth = conf.lineChart.lineWidth;
				line.name = "Line_" + (i+1);

			canvas.parent.addChild(line);
			group.push(line);

			// Dots
			if (conf.lineChart.dotType != 0) {  createDots(canvas, conf, data, i, group) }
		}
	
	// Area chart
		function createAreaChart(canvas, conf, data, i, group){
			let pathData = path(canvas, data, conf, i, "forward"),
				zero;

			if(data.niceMin < 0){
				zero = canvas.y + canvas.height * data.niceMax / (data.niceMax - data.niceMin);
			} else {
				zero = canvas.y + canvas.height;
			}

			pathData += lineToPoint(canvas.x + canvas.width, zero);
			pathData += lineToPoint(canvas.x, zero);
			pathData += " Z";

			let area = new Path();
				area.pathData = pathData;
				area.fill = new Color(conf.colors.common[colorIndex(i, conf.colors.common)]);
				area.opacity = conf.areaChart.opacity;
				area.name = "Area_" + (i+1);

			canvas.parent.addChild(area);
			group.push(area);

			if(conf.areaChart.lineWidth > 0){
				let topLine = path(canvas, data, conf, i, "forward");
				let line = new Path();
					line.pathData = topLine;
					line.stroke = new Color(conf.colors.common[colorIndex(i, conf.colors.common)]);
					line.strokeWidth = conf.areaChart.lineWidth;
					line.name = "Line";

				canvas.parent.addChild(line);
				group.push(line);
			}
		}

	// Stacked area chart
		function createStackedAreaChart(canvas, conf, data, i, group){
			let pathData = path(canvas, data, conf, i, "forward"),
				zero;

			if(data.niceMax < 0){
				zero = canvas.y;
			} else {
				zero = canvas.y + canvas.height;
			}

			let yAxe = data.niceMax - data.niceMin,
				yEnd = zero - (( canvas.height / yAxe ) * (Number(data.table[i - 1][data.columns - 1]) - data.niceMin) );

			pathData += lineToPoint(canvas.x + canvas.width, yEnd);
			pathData += path(canvas, data, conf, i-1, "back");

			pathData += " Z";

			let area = new Path();
				area.pathData = pathData;
				area.fill = new Color(conf.colors.common[colorIndex(i-1, conf.colors.common)]);
				area.name = "Area_" + (i+1);

			canvas.parent.addChild(area);
			group.push(area);
		}

	// Vertical bar chart
		function createVerticalBarChart(canvas, conf, data, i, group){
			let xStep = canvas.width / data.columns,
				margin = (conf.verticalBarChart.margin / 2) * xStep,
				x0 = canvas.x + margin,
				x1,
				y0,
				y1,
				y = 0,
				n = 0,
				yAxe = data.niceMax - data.niceMin,
				zero = canvas.y + canvas.height;

			for (let j = 0; j < data.columns; j++) {
				x0 = x0 + xStep * n;
				x1 = x0 + xStep - 2 * margin;
				y0 = zero - (( canvas.height / yAxe ) * (Number(data.table[i-1][j]) - data.niceMin) );
				y1 = zero - (( canvas.height / yAxe ) * (Number(data.table[i][j]) - data.niceMin) );

				let pathData = moveToPoint(x0,y0);
					pathData += lineToPoint(x0, y1)
					pathData += lineToPoint(x1, y1)
					pathData += lineToPoint(x1, y0)
					pathData += " Z"

				let bar = new Path();
					bar.pathData = pathData;
					bar.fill = new Color(conf.colors.common[colorIndex(i-1, conf.colors.common)]);
					bar.name = "Bar_" + (i) + "_" + (j + 1);

				canvas.parent.addChild(bar);
				group.push(bar);

				// if(i === data.rows - 1 && bar.frame.height > conf.verticalBarChart.roundTop * 2 && bar.frame.height > 4){
				// 	bar.points[1].cornerRadius = conf.verticalBarChart.roundTop;
				// 	bar.points[2].cornerRadius = conf.verticalBarChart.roundTop;
				// }

				n = n + 1;
				x0 = canvas.x + margin;

			}
	  	}

	// Horizontal bar chart
		function createHorizontalBarChart(canvas, conf, data, i, group){
			let xStep = canvas.height / data.columns,
				margin = (conf.horizontalBarChart.margin / 2) * xStep,
				y0 = canvas.y + margin,
				x1,
				x0,
				y1,
				y = 0,
				n = 0,
				yAxe = data.niceMax - data.niceMin,
				zero = canvas.x;

			for (let j = 0; j < data.columns; j++) {
				y0 = y0 + xStep * n;
				y1 = y0 + xStep - 2 * margin;
				x0 = zero + (( canvas.width / yAxe ) * (Number(data.table[i-1][j]) - data.niceMin) );
				x1 = zero + (( canvas.width / yAxe ) * (Number(data.table[i][j]) - data.niceMin) );

				let pathData = moveToPoint(x0,y0);
					pathData += lineToPoint(x0, y1)
					pathData += lineToPoint(x1, y1)
					pathData += lineToPoint(x1, y0)
					pathData += " Z"

				let bar = new Path();
					bar.pathData = pathData;
					bar.fill = new Color(conf.colors.common[colorIndex(i-1, conf.colors.common)]);
					bar.name = "Bar_" + (i) + "_" + (j + 1);

				canvas.parent.addChild(bar);
				group.push(bar);

				// if(i === data.rows - 1 && bar.frame.width > conf.horizontalBarChart.roundTop * 2 && bar.frame.width > 4){
				// 	bar.points[2].cornerRadius = conf.horizontalBarChart.roundTop;
				// 	bar.points[3].cornerRadius = conf.horizontalBarChart.roundTop;
				// }

				n = n + 1;
				y0 = canvas.y + margin;

			}
	  	}

	// Grouped bar chart
		function createGroupBarChart(canvas, conf, data, group){
			let xStep = canvas.width / data.columns,
				margin = xStep * Number(conf.groupedBarChart.margin) / 2,
				barWidth = xStep * (1 - Number(conf.groupedBarChart.margin)) / data.rows,
				x0 = canvas.x + margin,
				x1,
				y0,
				y1,
				y = 0,
				n = 0,
				yAxe = data.niceMax - data.niceMin,
				zero = canvas.y + Math.abs(data.niceMax)/yAxe * canvas.height;

			for (let j = 0; j < data.columns; j++) {
				for(let n = 0; n < data.rows; n++){
					x1 = x0 + barWidth;
					y0 = zero;
					y1 = zero - ( canvas.height / yAxe  * Number(data.table[n][j]) );

					let pathData = moveToPoint(x0,y0);
						pathData += lineToPoint(x0, y1)
						pathData += lineToPoint(x1, y1)
						pathData += lineToPoint(x1, y0)
						pathData += " Z"

					let bar = new Path();
						bar.pathData = pathData;
						bar.fill = new Color(conf.colors.common[colorIndex(n, conf.colors.common)]);
						bar.name = "Bar_" + (n + 1) + "_" + (j + 1);

					canvas.parent.addChild(bar);
					group.push(bar);

					// if(bar.frame.height > conf.groupedBarChart.roundTop * 2 && bar.frame.height > 4){
					// 	bar.points[1].cornerRadius = conf.groupedBarChart.roundTop;
					// 	bar.points[2].cornerRadius = conf.groupedBarChart.roundTop;
					// }

					x0 = x0 + barWidth;
				}

				x0 = x0 + margin*2;
			}
	  	}

	// Grouped horizontal bar chart
		function createGroupHorizontalBarChart(canvas, conf, data, group){
			let xStep = canvas.height / data.columns,
				margin = xStep * Number(conf.groupedHorizontalBarChart.margin) / 2,
				barWidth = xStep * (1 - Number(conf.groupedHorizontalBarChart.margin)) / data.rows,
				y0 = canvas.y + margin,
				x1,
				x0,
				y1,
				y = 0,
				n = 0,
				yAxe = data.niceMax - data.niceMin,
				zero = canvas.x + Math.abs(data.niceMin)/yAxe * canvas.width;

			for (let j = 0; j < data.columns; j++) {
				for(let n = 0; n < data.rows; n++){
					x1 = zero + ( canvas.width / yAxe  * Number(data.table[n][j]) );
					x0 = zero;
					y1 = y0 + barWidth;

					let pathData = moveToPoint(x0,y0);
						pathData += lineToPoint(x0, y1)
						pathData += lineToPoint(x1, y1)
						pathData += lineToPoint(x1, y0)
						pathData += " Z"

					let bar = new Path();
						bar.pathData = pathData;
						bar.fill = new Color(conf.colors.common[colorIndex(n, conf.colors.common)]);
						bar.name = "Bar_" + (n + 1) + "_" + (j + 1);

					canvas.parent.addChild(bar);
					group.push(bar);

					// if(bar.frame.width > conf.groupedHorizontalBarChart.roundTop * 2 && bar.frame.width > 4){
					// 	bar.points[2].cornerRadius = conf.groupedHorizontalBarChart.roundTop;
					// 	bar.points[3].cornerRadius = conf.groupedHorizontalBarChart.roundTop;
					// }	

					y0 = y0 + barWidth;
				}

				y0 = y0 + margin*2;
			}
	  	}

	// Scatter plot
		function createScatterPlot(canvas, conf, data, i, group){
			let x = 0,
				y = 0,
				yAxe = data.yNiceMax - data.yNiceMin,
				xAxe = data.xNiceMax - data.xNiceMin,
				yZero = canvas.y + canvas.height,
				xZero = canvas.x,
				radius = conf.scatterPlot.dotDiameter;

			if(data.rows > 2){
				let maxRad = conf.scatterPlot.dotDiameter;
				let valMax = Math.max( ...data.table[2] );
				radius = Math.ceil(maxRad * data.table[2][i] / valMax);
			}

			x = xZero + (( canvas.width / xAxe ) * (Number(data.table[0][i]) - data.xNiceMin) );
			y = yZero - (( canvas.height / yAxe ) * (Number(data.table[1][i]) - data.yNiceMin) );

			let dot = new Ellipse();
				dot.radiusX = radius/2;
				dot.radiusY = radius/2;
				dot.name = "Dot_" + (i + 1);
				dot.fill = new Color(conf.colors.scatterPlot[0]);
				dot.translation = {x: Math.round(x - radius/2), y: Math.round(y - radius/2)}
			
			group.push(dot);
			canvas.parent.addChild(dot);
		}

	// Candlestick chart
		function createCandlestickChart(canvas, conf, data, group){
	  		let yAxe = data.niceMax - data.niceMin,
				zero = canvas.y + canvas.height,
				step = Math.floor(canvas.width / data.columns),
				margin = ((1 - Number(conf.candlestickChart.margin)) / 2) * step,
				xBar = step - 2 * margin,
				x0 = canvas.x + margin,
				y0 = 0,
				x1 = 0,
				y1 = 0,
				x0line = canvas.x + step / 2,
				y0line = 0,
				y1line = 0,
				n = 0,
				candleColor;

			for (let z = 0; z < data.columns; z++){
				x0line = x0line + step * n;
				x0 = x0line - Math.floor(xBar / 2);
				x1 = x0line + Math.floor(xBar / 2);

				if (data.table[1][z] > data.table[2][z]) {
					y0 = zero - (canvas.height / yAxe) * (Number(data.table[2][z]) - data.niceMin);
					y1 = zero - (canvas.height / yAxe) * (Number(data.table[1][z]) - data.niceMin);
					y0line = zero - (canvas.height / yAxe) * (Number(data.table[3][z]) - data.niceMin);
					y1line = zero - (canvas.height / yAxe) * (Number(data.table[0][z]) - data.niceMin);
					candleColor = conf.colors.candlestickChart[0]
				} else {
					y0 = zero - (canvas.height / yAxe) * (Number(data.table[1][z]) - data.niceMin);
					y1 = zero - (canvas.height / yAxe) * (Number(data.table[2][z]) - data.niceMin);
					y0line = zero - (canvas.height / yAxe) * (Number(data.table[3][z]) - data.niceMin);
					y1line = zero - (canvas.height / yAxe) * (Number(data.table[0][z]) - data.niceMin);
					candleColor = conf.colors.candlestickChart[1]
				}

				let lineData = moveToPoint(x0line,y0line);
					lineData += lineToPoint(x0line, y1line);

				let line = new Path();
					line.pathData = lineData;
					line.stroke = new Color(candleColor);
					line.strokeWidth = 1;
					line.name = "Line";

				canvas.parent.addChild(line);
				group.push(line);

				let barData = moveToPoint(x0,y0);
					barData += lineToPoint(x0, y1)
					barData += lineToPoint(x1, y1)
					barData += lineToPoint(x1, y0)
					barData += " Z"

				let bar = new Path();
					bar.pathData = barData;
					bar.fill = new Color(candleColor);
					bar.name = "Candle";

					canvas.parent.addChild(bar);
					group.push(bar);

				n = 1;
			}
	  	}

	// Pie chart
		function createPieChart(canvas, conf, data, i, group){
	  		let radius = canvas.width/2,
	  			xCenter = canvas.x + radius,
	  			yCenter = canvas.y + radius,
	  			pathData,
	  			sum = data.table[i].reduce((partial_sum, a) => Number(partial_sum) + Number(a)),
	  			startAngle,
	  			endAngle,
	  			multi;

	  		if (sum == 100) {
	  			multi = 3.6;
	  		} else {
	  			multi = 360 / sum;
	  		}

	  		if (conf.sorting == 0) {
	  			let sortedItems = data.table[i];

				function compareNumeric(a, b) {
				  return b - a;
				}

				sortedItems.sort(compareNumeric);
				data.table[i] = sortedItems;
	  		}

	  		if (conf.typeOfCircle == 0) {
	  			startAngle = 0;
	  			endAngle = data.table[i][0] * multi;
	  		} else {
	  			multi = multi / 2;
	  			startAngle = -90;
	  			endAngle = Number(data.table[i][0]) * multi - 90;
	  		}

	  		for (let j = 0; j < data.columns; j++) {
				let start = polarToCartesian(xCenter, yCenter, radius, endAngle),
			    	end = polarToCartesian(xCenter, yCenter, radius, startAngle),
					arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

			    pathData = [
			        "M", start.x, start.y, 
			        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
			        "L", xCenter, yCenter,
			        "L", start.x, start.y
			    ].join(" ");

			    let pie = new Path();
					pie.pathData = pathData;
					pie.fill = new Color(conf.colors.common[colorIndex(j, conf.colors.common)]);
					pie.name = "Pie_" + j;

				canvas.parent.addChild(pie);
				group.push(pie);

			    startAngle = startAngle + Number(data.table[i][j]) * multi;
			    endAngle = endAngle + Number(data.table[i][j+1]) * multi;
			}
	  	}

	// Donut chart
		function createDonutChart(canvas, conf, data, i, group){
			if(conf.donutChart.thicknessOfDonut > canvas.width/2){
				conf.donutChart.thicknessOfDonut = canvas.width/4
			}

	  		let radius = canvas.width/2 - conf.donutChart.thicknessOfDonut / 2,
	  			xCenter = canvas.x + radius + conf.donutChart.thicknessOfDonut / 2,
	  			yCenter = canvas.y + radius + conf.donutChart.thicknessOfDonut / 2,
	  			pathData,
	  			sum = data.table[i].reduce((partial_sum, a) => Number(partial_sum) + Number(a)),
	  			startAngle,
	  			endAngle,
	  			multi;

	  		if (sum == 100) {
	  			multi = 3.6;
	  		} else {
	  			multi = 360 / sum;
	  		}

	  		if (conf.sorting == 0) {
	  			let sortedItems = data.table[i];

				function compareNumeric(a, b) {
				  return b - a;
				}

				sortedItems.sort(compareNumeric);
				data.table[i] = sortedItems;
	  		}

	  		if (conf.typeOfCircle == 0) {
	  			startAngle = 0;
	  			endAngle = data.table[i][0] * multi;
	  		} else {
	  			multi = multi / 2;
	  			startAngle = -90;
	  			endAngle = Number(data.table[i][0]) * multi - 90;
	  		}

	  		for (let j = 0; j < data.columns; j++) {
				let start = polarToCartesian(xCenter, yCenter, radius, endAngle),
			    	end = polarToCartesian(xCenter, yCenter, radius, startAngle),
					arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

			    pathData = [
			        "M", start.x, start.y, 
			        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
			    ].join(" ");

				let pie = new Path();
					pie.pathData = pathData;
					pie.stroke = new Color(conf.colors.common[colorIndex(j, conf.colors.common)]);
					pie.strokeWidth = conf.donutChart.thicknessOfDonut;
					pie.name = "Donut_" + j;

				canvas.parent.addChild(pie);
				group.push(pie);

			    startAngle = startAngle + Number(data.table[i][j]) * multi;
			    endAngle = endAngle + Number(data.table[i][j+1]) * multi;
			}	
	  	}

	// Progress chart
		function createProgressChart(canvas, conf, data, i, group){
			let progress,
				pathData;

			let bgColor,
				bgColorType = typeof conf.progressChart.backgroundColor,
				bgLayer;

			if(bgColorType === 'object'){
				bgColor = conf.progressChart.backgroundColor[0]
			} else {
				bgColor = conf.progressChart.backgroundColor
			}

			if (canvas.layerType == "Oval") {
				let radius = canvas.width/2 - conf.progressChart.thicknessOfProgress / 2,
		  			xCenter = canvas.x + radius + conf.progressChart.thicknessOfProgress / 2,
		  			yCenter = canvas.y + radius + conf.progressChart.thicknessOfProgress / 2,
		  			startAngle,
		  			endAngle,
		  			multi = 3.6;

				if (conf.typeOfCircle == 0) {
		  			startAngle = 0;
		  			endAngle = data.table[i][0] * multi;
		  		} else {
		  			multi = multi / 2;
		  			startAngle = -90;
		  			endAngle = Number(data.table[i][0]) * multi - 90;
		  		}

				let start = polarToCartesian(xCenter, yCenter, radius, endAngle),
			    	end = polarToCartesian(xCenter, yCenter, radius, startAngle),
					arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

				pathData = [
			        "M", start.x, start.y, 
			        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
			    ].join(" ");

			    progress = new Path();
				progress.pathData = pathData;
				progress.stroke = new Color(conf.colors.progressChart[0]);
				progress.strokeWidth = conf.progressChart.thicknessOfProgress;

				if (conf.typeOfCircle == 0) {
					canvas.layer.stroke = new Color(bgColor);
					canvas.layer.strokeWidth = conf.progressChart.thicknessOfProgress;
					canvas.layer.strokePosition = GraphicNode.INNER_STROKE;
				} else {
					startAngle = -90;
		  			endAngle = 90;

					let start = polarToCartesian(xCenter, yCenter, radius, endAngle),
			    		end = polarToCartesian(xCenter, yCenter, radius, startAngle),
						arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

					pathData = [
				        "M", start.x, start.y, 
				        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
				    ].join(" ");

				    bgLayer = new Path();
					bgLayer.pathData = pathData;
					bgLayer.stroke = new Color(bgColor);
					bgLayer.strokeWidth = conf.progressChart.thicknessOfProgress;
					bgLayer.name = "Background";

					canvas.parent.addChild(bgLayer);
					group.push(bgLayer);
				}
			} else {
				let xStart = canvas.x,
					xEnd = canvas.x + (canvas.width / 100) * data.table[i][0],
					y = canvas.y + canvas.height / 2;

				if (conf.progressChart.endOfLine == 1) {
					xStart = xStart + canvas.height / 2;
				}

				xStart = xStart + canvas.height / 2;

				pathData = [
					"M", xStart, y,
					"L", xEnd, y
				].join(" ");

				progress = new Path();
				progress.pathData = pathData;
				progress.stroke = new Color(conf.colors.progressChart[0]);
				progress.strokeWidth = canvas.height;

				canvas.layer.fill = new Color(bgColor);
			}
		    
			if (conf.progressChart.endOfLine == 0) {
				progress.strokeEndCaps = GraphicNode.STROKE_CAP_SQUARE;
			} else {
				progress.strokeEndCaps = GraphicNode.STROKE_CAP_ROUND;
				// canvas.layer.points.forEach(point => {
		  //           point.cornerRadius = canvas.height / 2;
		  //       })
			}

			progress.name = "Progress bar";
			canvas.parent.addChild(progress);
			group.push(progress);	
	  	}

	// Sparkline
		function createSparkline(canvas, conf, data, max, min, i, group){
	  		let x0 = canvas.x,
				y = 0,
				yAxe = max - min,
				zero = canvas.y + canvas.height,
				xStep = canvas.width / (data.columns - 1);

			let y0 = zero - (( canvas.height / yAxe ) * (Number(data.table[i][0]) - min) ),
				xLast = x0,
				yLast = y0,
				xNext = 0,
				pathData = moveToPoint(x0,y0);

			for (let j = 1; j < data.columns; j++) {

				xNext = xLast + xStep;
				y = zero - (( canvas.height / yAxe ) * (Number(data.table[i][j]) - min) );
				pathData += lineToPoint(xNext,y); 
				xLast = xNext;
				yLast = y;

			}

			let line = new Path();
				line.pathData = pathData;
				line.stroke = new Color(conf.colors.sparkline[0]);
				line.strokeWidth = conf.sparkline.lineWidth;
				line.name = "Sparkline";

			canvas.parent.addChild(line);
			group.push(line);

			let dot = new Ellipse();
				dot.radiusX = conf.sparkline.dotDiameter/2;
				dot.radiusY = conf.sparkline.dotDiameter/2;
				dot.fill = new Color(conf.colors.sparkline[0]);
				dot.name = "Dot";
				dot.translation = {x: Math.round(xLast - conf.sparkline.dotDiameter/2), y: Math.round(yLast - conf.sparkline.dotDiameter/2)}

			canvas.parent.addChild(dot);
			group.push(dot);
		}

	// Histogram
		function createHistogram(canvas, conf, data, group){
			let xStep = canvas.width / data.table[1].length,
				margin = conf.histogram.margin,
				x0 = canvas.x + margin,
				x1,
				y0,
				y1,
				y = 0,
				n = 0,
				yAxe = data.yNiceMax - data.yNiceMin,
				zero = canvas.y + canvas.height,
				barArray = new Array();
			
			for(let j = 0; j < data.table[1].length; j++){
				x0 = x0 + xStep * n;
				x1 = x0 + xStep - 2 * margin;
				y0 = zero;
				y1 = zero - (( canvas.height / yAxe ) * (Number(data.table[1][j]) - data.yNiceMin) );

				let pathData = moveToPoint(x0,y0);
					pathData += lineToPoint(x0, y1)
					pathData += lineToPoint(x1, y1)
					pathData += lineToPoint(x1, y0)
					pathData += " Z";


				let bar = new Path();
					bar.pathData = pathData;
					bar.fill = new Color(conf.colors.common[0]);
					bar.name = "Bar_" + (j + 1);

				canvas.parent.addChild(bar);
				group.push(bar);

				n = n + 1;
				x0 = canvas.x + margin;
			}

			return barArray;
		}

	// Heatmap
		function createHeatmap(canvas, conf, data, group){
			function isInteger(num) {
				return (num ^ 0) === num;
			}

			let division = conf.heatmap.segments,
				margin = conf.heatmap.margin,
				xStep = (canvas.width - margin * (data.rows - 1)) / data.rows,
				yStep = (canvas.height - margin * (data.columns - 1)) / data.columns,
				x0 = canvas.x,
				y0 = canvas.y,
				x1,
				y1, 
				barArray = new Array();
			
			let niceScales = calculateNiceNum(data.min, data.max, false);
				data.niceMax = niceScales.niceMaximum;
				data.niceMin = niceScales.niceMinimum;
			
			if(data.niceMin > 0){
				data.niceMin = 0;
			}
			
			let opacityStep = 1 / division;

			for(let i = 0; i < data.rows; i++){
				for (let j = 0; j < data.columns; j++) {

					x1 = x0 + xStep
					y1 = y0 + yStep

					let pathData = moveToPoint(x0, y0);
						pathData += lineToPoint(x0, y1)
						pathData += lineToPoint(x1, y1)
						pathData += lineToPoint(x1, y0)
						pathData += " Z"
					
					let rangeStep,
						opacity,
						textRangeMax,
						textRangeMin,
						color;

					if(data.table[i][j] >= 0){
						rangeStep = data.niceMax / division;
						color = conf.colors.heatmap[0];

						if(isInteger(data.table[i][j] / rangeStep)){
							opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep + 1)
							textRangeMin = Math.ceil(data.table[i][j] / rangeStep) * rangeStep
							textRangeMax = (Math.ceil(data.table[i][j] / rangeStep) + 1) * rangeStep;
	
							if(Number(data.table[i][j]) === data.niceMax){
								opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep)
								textRangeMin = (Math.ceil(data.table[i][j] / rangeStep) - 1) * rangeStep
								textRangeMax = Math.ceil(data.table[i][j] / rangeStep) * rangeStep;
							}
						} else {
							opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep)
							textRangeMin = (Math.ceil(data.table[i][j] / rangeStep) - 1) * rangeStep
							textRangeMax = Math.ceil(data.table[i][j] / rangeStep) * rangeStep;
						}
					} else {
						rangeStep = data.niceMin / division;
						if(conf.colors.heatmap.length > 1){
							color = conf.colors.heatmap[1]
						} else {
							color = conf.colors.heatmap[0]
						}

						if(isInteger(data.table[i][j] / rangeStep)){
							opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep + 1)
							textRangeMin = Math.ceil(data.table[i][j] / rangeStep) * rangeStep
							textRangeMax = (Math.ceil(data.table[i][j] / rangeStep) + 1) * rangeStep;
	
							if(Number(data.table[i][j]) === data.niceMin){
								opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep)
								textRangeMin = (Math.ceil(data.table[i][j] / rangeStep) - 1) * rangeStep
								textRangeMax = Math.ceil(data.table[i][j] / rangeStep) * rangeStep;
							}
						} else {
							opacity = opacityStep * Math.ceil(data.table[i][j] / rangeStep)
							textRangeMin = (Math.ceil(data.table[i][j] / rangeStep) - 1) * rangeStep
							textRangeMax = Math.ceil(data.table[i][j] / rangeStep) * rangeStep;
						}
					}

					let bar = new Path();
						bar.pathData = pathData;
						bar.fill = new Color(color);
						bar.opacity = opacity;
						bar.name = "Value: " + data.table[i][j] + ", range: " + textRangeMin + "—" + textRangeMax;

					canvas.parent.addChild(bar);
					group.push(bar);

					y0 += yStep + margin;
				}
				y0 = canvas.y
				x0 += xStep + margin
			}

			return barArray;
		}

// CREATE CHART
	function createChart(canvas, configuration, selection, settings){
		function isNumeric(n) {
		    return !isNaN(parseFloat(n)) && isFinite(n);
		}

		let data,
			dataFromPopup = configuration,
			conf = dataFromPopup.settings,
			strConfig = JSON.stringify(configuration),
			editableConfig = JSON.stringify(configuration),
			chartType = dataFromPopup.data.chartName;

		// COLLECT STATS
			collectStats(settings.userId, settings.email, "0.0.1", chartType, settings.type);

		canvas.forEach((canvas, index) => {
			let numParam = (conf.labels.type != 0) ? canvas.height : false,
				numWidthParam = (conf.labels.type != 0) ? canvas.width : false;

			// PREPARE DATA
				if (dataFromPopup.data.selected == "random") {
			  		var random = dataFromPopup.data.random;
			  		data = createRandomData(random.categories.value, random.items.value, random.min, random.max, random.randType, chartType);

			  		let tempData = JSON.parse(strConfig);
			  		tempData.data.random.data = [data.header, ...data.table];
			  		strConfig = JSON.stringify(tempData)
			  	} else if (dataFromPopup.data.selected == "table") {
			  		data = processData(dataFromPopup.data.csv)
			  	} else {
			  		data = processJSON(dataFromPopup.data.json.data, dataFromPopup.data.json.keys, dataFromPopup.data.json.header)
			  	}

		  	// PREPARE STACKED DATA
				if(chartType === "stackedAreaChart" || chartType === "verticalBarChart" || chartType === "horizontalBarChart" || chartType === "streamGraph"){
					for(let i = 1; i < data.rows; i++){
						for(let j = 0; j < data.columns; j++){
							data.table[i][j] = Number(data.table[i-1][j]) + Number(data.table[i][j]);
						}
					}

					let zeroArray = new Array();
					for (let i = 0; i < data.columns; i++){
						zeroArray[i] = 0;
					};
					data.table.unshift(zeroArray);
					data.rows = data.rows + 1;
					// New min and max
					data.max = Math.max( ... data.table[data.rows-1] );
					data.min = Math.min( ... data.table[data.rows-1] );
				} 

			// REMOVE LABELS AND GRIDS FOR SMALL CHARTS
				if(canvas.width < 200 && canvas.height < 100){
					conf.labels.type = 0;
					conf.grid.type = 0;
					conf.lineChart.dotType = 0;
					numParam = false;
					numWidthParam = false;
				}

			// CREATE NODES ARRAY
				let nodes = [canvas.layer];

			// SELECT CHART
				if(chartType == "lineChart"){
					if(conf.beginAtZero === 0){ 
						if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 } 
					}
			
					// Scale Y axis
					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisLabels(canvas, data, nodes, conf, marginsData, chartType) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisGrid(conf, canvas, data, nodes, chartType, marginsData) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

					// Chart
				  	for (let i = 0; i < data.rows; i++) { createLineChart(canvas, conf, data, i, nodes) }
				} else if(chartType == "areaChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

				  	let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisLabels(canvas, data, nodes, conf, marginsData, chartType) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisGrid(conf, canvas, data, nodes, chartType, marginsData) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

				  	for (let i = 0; i < data.rows; i++) { createAreaChart(canvas, conf, data, i, nodes); }
				} else if(chartType == "stackedAreaChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisLabels(canvas, data, nodes, conf, marginsData, chartType) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisGrid(conf, canvas, data, nodes, chartType, marginsData) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

				  	for (let i = 1; i < data.rows; i++) { createStackedAreaChart(canvas, conf, data, i, nodes) }
				} else if(chartType == "streamGraph"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 } 

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					for(let i = 0; i < data.rows; i++){
						for(let j = 0; j < data.columns; j++){
							data.table[i][j] = Number(data.table[i][j]) + (data.niceMax - Number(data.table[data.rows - 1][j])) / 2;
						}
					}

					// Margins
					if (conf.labels.type == 1 || conf.labels.type == 2) { conf.labels.type = 3 }
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisLabels(canvas, data, nodes, conf, marginsData, chartType) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisGrid(conf, canvas, data, nodes, chartType, marginsData) }

				  	for (let i = 1; i < data.rows; i++) { createStackedAreaChart(canvas, conf, data, i, nodes) }
				} else if(chartType == "verticalBarChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisDistrLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisDistrGrid(conf, canvas, data, nodes, "horizontal") }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

				  	for (let i = 1; i < data.rows; i++) {
				  		createVerticalBarChart(canvas, conf, data, i, nodes);
					}
				} else if(chartType == "horizontalBarChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMarginsHorizontal(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisDistrLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "horizontal", chartType) }
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisDistrGrid(conf, canvas, data, nodes, "vertical") }

				  	for (let i = 1; i < data.rows; i++) {
				  		createHorizontalBarChart(canvas, conf, data, i, nodes);
					}
				} else if(chartType == "groupedBarChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisDistrLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisDistrGrid(conf, canvas, data, nodes, "horizontal") }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

				  	createGroupBarChart(canvas, conf, data, nodes);
				} else if(chartType == "groupedHorizontalBarChart"){
					if (data.min > 0) { data.min = 0 } else if(data.max < 0){ data.max = 0 }

					let niceScales = calculateNiceNum(data.min, data.max, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMarginsHorizontal(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisDistrLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "horizontal", chartType) }
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisDistrGrid(conf, canvas, data, nodes, "vertical") }

				  	createGroupHorizontalBarChart(canvas, conf, data, nodes);
				} else if(chartType == "scatterPlot"){
				  	let xMin = Math.min( ...data.table[0] ),
				  		xMax = Math.max( ...data.table[0] ),
				  		yMin = Math.min( ...data.table[1] ),
				  		yMax = Math.max( ...data.table[1] );

				  	if(conf.beginAtZero === 0){ 
				  		if (xMin > 0) { xMin = 0 }
				  		if (yMin > 0) { yMin = 0 }
				  	}

				  	let xNiceScales = calculateNiceNum(xMin, xMax, numWidthParam),
				  		yNiceScales = calculateNiceNum(yMin, yMax, numParam);
						data.xNiceMax = xNiceScales.niceMaximum;
						data.xNiceMin = xNiceScales.niceMinimum;
						data.yNiceMax = yNiceScales.niceMaximum;
						data.yNiceMin = yNiceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.yNiceMin = canvas.yMin;
						data.yNiceMax = canvas.yMax;
					}
					if(canvas.xMin != null && canvas.xMax != null){
						data.xNiceMin = canvas.xMin;
						data.xNiceMax = canvas.xMax;
					}

					// Margins
					let marginsData = calculateMarginsHistogram(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { yAxisLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { yAxisGrid(conf, canvas, data, nodes, "horizontal", chartType) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

					for (let i = 0; i < data.columns; i++) {
						createScatterPlot(canvas, conf, data, i, nodes);
					}
				} else if(chartType == "candlestickChart"){
				  	let maxLine = Math.max( ...data.table[0] ),
				  		minLine = Math.min( ...data.table[3] );

				  	if(conf.beginAtZero === 0){ if (minLine > 0) { minLine = 0 } }

				  	let niceScales = calculateNiceNum(minLine, maxLine, numParam);
						data.niceMax = niceScales.niceMaximum;
						data.niceMin = niceScales.niceMinimum;

					if(canvas.yMin != null && canvas.yMax != null){
						data.niceMin = canvas.yMin;
						data.niceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMargins(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisLabels(canvas, data, nodes, conf, marginsData, chartType) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { xAxisGrid(conf, canvas, data, nodes, chartType, marginsData) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

					createCandlestickChart(canvas, conf, data, nodes);
				} else if(chartType == "pieChart"){
					createPieChart(canvas, conf, data, index, nodes);
				} else if(chartType == "donutChart"){
					createDonutChart(canvas, conf, data, index, nodes);
				} else if(chartType == "progressChart"){
				  	createProgressChart(canvas, conf, data, index, nodes);
				} else if(chartType == "sparkline"){
					let max = Math.max( ...data.table[index] ),
						min = Math.min( ...data.table[index] ),
						niceScales = calculateNiceNum(min, max, false);

					max = niceScales.niceMaximum;
					min = niceScales.niceMinimum;

					createSparkline(canvas, conf, data, max, min, index, nodes);
				} else if(chartType == "histogram"){
					function inRange(x, min, max) {
						return ((x-min)*(x-max) <= 0);
					}

					function transformData(data){
						let minStepPx = 10;

						if(canvas.width < 200 && canvas.height < 100){
							minStepPx = 5;
						}

						let range = data.xNiceMax - data.xNiceMin,
							maxNumTicks = Math.floor(canvas.width / minStepPx),
							dividers = [0.1, 0.2, 0.5];
						
						let step = dividers[0],
							numLines = Math.ceil(range/step),
							i = 0,
							count = 1;
				
						while(numLines >= maxNumTicks){
							step = dividers[i] * count;
							numLines = Math.ceil(range/step);
							if(i === 2){
								i = 0;
								count = count * 10;
							} else{
								i++;
							}
						}

						let newData = [];
						for(let i = 0; i < data.xNiceMax / step; i++){
							let countOfNums = 0;
							data.table[0].forEach(num => {
								if(inRange(num, step*i, step*(i+1))){
									countOfNums += 1
								}
							})
							newData.push(countOfNums)
						}
						return newData
					}

					let min = Math.min( ...data.table[0] ),
						max = Math.max( ...data.table[0] );
						data.xNiceMin = calculateNiceNum(min, max, numWidthParam).niceMinimum;
						data.xNiceMax = calculateNiceNum(min, max, numWidthParam).niceMaximum;

					let newData = transformData(data),
						yMin = Math.min( ...newData ),
						yMax = Math.max( ...newData );
						data.table[1] = newData;

					if(conf.beginAtZero === 0){ 
						if (yMin > 0) { yMin = 0 }
					}

					data.yNiceMax = calculateNiceNum(yMin, yMax, numParam).niceMaximum;
					data.yNiceMin = calculateNiceNum(yMin, yMax, numParam).niceMinimum;
				
					if(canvas.yMin != null && canvas.yMax != null){
						data.yNiceMin = canvas.yMin;
						data.yNiceMax = canvas.yMax;
					}

					// Margins
					let marginsData = calculateMarginsHistogram(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { yAxisLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { yAxisLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }

					// Grid
					if (conf.grid.type == 1 || conf.grid.type == 3) { yAxisGrid(conf, canvas, data, nodes, "horizontal", chartType) }
					if (conf.grid.type == 1 || conf.grid.type == 2) { yAxisGrid(conf, canvas, data, nodes, "vertical", chartType) }

					createHistogram(canvas, conf, data, nodes)
				} else if(chartType == "heatmap"){
					let horizontalHeaders = [];
					if(dataFromPopup.data.selected == "table" && (dataFromPopup.data.csv.type === "google" || dataFromPopup.data.csv.type === "csv")){
						dataFromPopup.data.csv.columns.forEach(column => {
							if(column.checked){
								horizontalHeaders.push(column.name)
							}
						})
					} else if(dataFromPopup.data.selected == "json"){
						dataFromPopup.data.json.keys.forEach(key => {
							if(key.checked){
								horizontalHeaders.push(key.name)
							}
						})
					} else {
						for(let i = 0; i < data.rows; i++){
							horizontalHeaders[i] = "Text"
						}
					}
					data.horizontalHeaders = horizontalHeaders

					// Margins
					let marginsData = calculateMarginsHeatmap(canvas, data, conf, chartType)

					// Labels
					if (conf.labels.type == 1 || conf.labels.type == 3) { xAxisDistrLabels(canvas, data, nodes, conf, "vertical", chartType, marginsData.minW) }
					if (conf.labels.type == 1 || conf.labels.type == 2) { xAxisDistrLabels(canvas, data, nodes, conf, "horizontal", chartType, marginsData.minW) }

					createHeatmap(canvas, conf, data, nodes)
				}

			// CREATE GROUP
				createGroup(selection, nodes, dataFromPopup.data.fullChartName)

			// UPDATE DATA
				dataFromPopup = JSON.parse(strConfig);
		})
	}

async function createChartCommand(selection) {
    let canvas = getCanvas(selection.items)[0],
        settings = await getSettings();

    if(canvas.length === 0){
    	await alert("Select layer to create a chart",
    				"The plugin must understand the boundaries of the canvas (rectangle or ellipse) in order to draw beautiful looking chart.");

    } else {
    	if(settings.status){
			settings.template = await checkTemplate(settings.email);
			setSettings(settings)
			templates = settings.template;
		}

		checkSubscribtion(settings.email)
	    
	    // Create modal window
		    document.body.innerHTML = `
				<style type="text/css">
					a{
						text-decoration: none !important;
						color: #248CF1 !important;
						cursor: pointer;
						font-family: sans-serif;
					}
					a:hover{
						color: #FD466E !important;
					}
					.link{
						color: #248CF1;
						cursor: pointer;
						font-family: sans-serif;
					}
					.link:hover{
						color: #FD466E;
					}
					p{
						margin: 4px 0px !important;
						padding: 0 !important;
						font-family: sans-serif;
					    font-size: 12px;
					}
					input{
						margin: 0 !important;
					    padding: 0 !important;
					    width: 100%;
					}
					select{
						margin: 0 !important;
					    padding: 0 !important;
					    width: 100%;
					}
					textarea{
						margin: 0 !important;
					    padding: 0 !important;
					    width: 100%;
					}
					.checkbox-wraper{
						height: 100px;
						overflow-y: scroll;
						padding: 3px;
						box-sizing: border-box;
						border: 1px solid #E4E4E4;
						border-radius: 3px;
						background-color: #fafafa;
					}
					.checkbox-box{
						margin: 0 !important;
						width: 16px; 
						margin-right: 4px;
					}
					.checkbox-item{
						font-size: 12px !important;
						margin-bottom: 5px;
					}
					.left_2_input{
						width: 48%;
						margin-right: 24px;
					}
					.right_2_input{
						width: 48%;
					}
					.webview{
						display: flex;
						opacity: 1;
					}
					.tools{
						display: flex;
						flex-direction: columns;
						width: 96px;
						height: 100vh;
						padding: 4px;
						box-sizing: border-box;
					}
					.icon_tools{
						height: 28px;
						width: 28px;
						opacity: 0.3;
						border-radius: 8px;
						margin: 4px;
						cursor: pointer;
						transition: opacity 0.2s ease-in-out;
					}
					.icon_tools:hover{
						opacity: 1;
					}
					.icon_active{
						box-shadow: 0 4px 8px 0 rgba(57,36,109,0.1);
						background-color: #fff;
						opacity: 1;
					}
					.modal_header{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: baseline;
					}
					.content{
					    width: 100%;
					    height: 350px;
					    display: flex;
					    flex-direction: column;
					    justify-content: space-between;
					    background-color: #fff;
					    padding: 0 20px;
					    box-sizing: border-box;
					    border-radius: 4px;
					}
					.chart_name{
						font-family: sans-serif;
						font-size: 20px;
						font-weight: 700;
						margin: 10px 0 10px 0;
					}
					.popup_name{
						font-family: sans-serif;
						font-size: 20px;
						font-weight: 700;
						margin: 10px 0 10px 0;
					}
					.button_group{
						border-radius: 4px;
						border: 1px solid #d7d7d7;
						font-family: sans-serif;
						display: flex;
						overflow: hidden;
						margin-bottom: 15px;
					}
					.radio{
						font-size: 14px;
						padding: 7px 12px 7px 12px;
						color: #343434;
						text-align: center;
						background-color: #fff;
						border-right: 1px solid #d7d7d7;
						flex-direction: row;
						flex: 1;
					}
					.radio:last-child{
						font-size: 14px;
						color: #343434;
						background-color: #fff;
						border-right: none;
						flex-direction: row;
					}
					.active{
						background-color: #ececec !important;
						cursor: default;
					}
					.radio:hover{
						background-color: #f9f9f9;
						cursor: pointer;
					}
					.active:hover{
						cursor: default;
						background-color: #ececec !important;
					}
					.data_form{
						display: none;
					}
					.form_active{
						display: flex;
						flex-direction: column;
					}
					#tableData, #jsonData{
						display: none;
					}
					.grid_inputs{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-bottom: 10px;
					}
					.jsonLink, .tableLink{
						font-family: sans-serif;
						font-size: 14px;
						padding: 6px 12px 7px 12px;
						border-radius: 4px;
						background-color: #ececec;
					}
					.complex_title{
						display: flex;
						flex-direction: row;
						align-items: baseline;
						justify-content: space-between;
						font-size: 12px;
					}
					.complex_title_text{
						display: flex;
						flex-direction: row;
						align-items: baseline;
						margin: 4px 0px;
					}
					.span_text{
						margin-left: 2px !important;
						margin-right: 2px !important;
					}
					.footer{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						margin-top: 16px;
						margin-bottom: 16px;
						font-size: 14px;
					}
					.second_actions{
						display: flex;
						flex-direction: row;
					}
					#help{
						margin-right: 24px;
					}
					.button{
						font-size: 14px;
						padding: 8px 12px 8px 12px;
						color: #fff;
						background-color: #FD466E;
						border: none;
						border-radius: 4px;
						outline: none;
					}
					.button:hover{
						cursor: pointer;
						background-color: #e23158;
					}
					.small_button{
						font-size: 12px;
						padding: 4px 8px 4px 8px;
						color: #fff;
						background-color: #FD466E;
						border: none;
						border-radius: 4px;
						outline: none;
					}
					.small_button:hover{
						cursor: pointer;
						background-color: #e23158;
					}
					.linkGS{
						display: none;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 1000;
						width: 100%;
						height: 100%;
						background-color: #fff;
						padding: 10px 20px 20px 20px;
						box-sizing: border-box;
						overflow-y: scroll;
					}
					.linkHTTP{
						display: none;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 1000;
						width: 100%;
						height: 100%;
						background-color: #fff;
						padding: 0 20px 20px 20px;
						box-sizing: border-box;
						overflow-y: scroll;
					}
					.popup_header{
						display: flex;
						flex-direction: row;
						align-items: baseline;
						justify-content: space-between;
					}
					.settings{
					    -webkit-user-select: none;
					    display: none;
					    position: absolute;
					    top: 0;
					    left: 0;
					    z-index: 1000;
					    width: 100%;
					    height: 100%;
					    /*height: 300px;*/
					    background-color: #fff;
					    padding: 10px 20px 20px 20px;
					    box-sizing: border-box;
					    overflow-y: scroll;
					}
					.form-element{
						width: 100%;
						margin-bottom: 12px;
					}
					.save_template{
						display: flex;
						font-size: 12px;
						font-family: sans-serif;
						margin-top: 6px;
					}
					.description{
						display: inline-block;
						color: #a3a3a3;
						font-size: 10px;
						font-family: sans-serif;
						font-style: italic;
					}
					.settings_inputs{
						display: flex;
						flex-wrap: wrap;
					}
					.settings_input_item{
						flex: 1 1 260px;
						margin: 0px 10px;
					}
					.color_item{
						width: 40px;
						height: 30px;
						border-radius: 4px;
						margin-right: 5px;
						cursor: pointer;
					}
					.colors_preview{
						display: flex;
						margin-top: 4px;
					}
					.color_input_group{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}
					.color_input{
						width: 100%;
					}
					.color_input_wrap{
						flex: 1;
						margin-right: 10px;
					}
					#httpJSON{
						margin-right: 2px;
					}

					.chart_disabled{
					  	cursor: not-allowed;
					}

					/**
					 * wenk - Lightweight tooltip for the greater good
					 * @version v1.0.6
					 * (c) 2018 Tiaan du Plessis @tiaanduplessis |
					 * @link https://tiaanduplessis.github.io/wenk/
					 * @license MIT
					 */
					 [data-wenk] {
					    position: relative
					}

					[data-wenk]:after {
					    position: absolute;
					    font-size: 11px;
					    font-family: sans-serif;
					    border-radius: 4px;
					    /*content: attr(data-wenk);*/
					    content: "Available in Pro. Upgrade in My account";
					    width: 230px;
					    padding: 4px 8px;
					    background-color: rgba(17, 17, 17, .8);
					    -webkit-box-shadow: 0 0 14px rgba(0, 0, 0, .1);
					            box-shadow: 0 0 14px rgba(0, 0, 0, .1);
					    color: #fff;
					    line-height: 16px;
					    text-align: left;
					    z-index: 1;
					    pointer-events: none;
					    display: block;
					    opacity: 0;
					    visibility: hidden;
					    -webkit-transition: all .3s;
					    transition: all .3s;
					    bottom: 100%;
					    left: 50%;
					    -webkit-transform: translate(-50%, 10px);
					            transform: translate(-50%, 10px);
					    white-space: pre;
					}

					[data-wenk]:after {
					    opacity: 0;
					}

					[data-wenk]:hover {
					    overflow: visible
					}

					[data-wenk]:hover:after {
					    display: block;
					    opacity: 1;
					    visibility: visible;
					    -webkit-transform: translate(-50%, -10px);
					            transform: translate(-50%, -10px);
					}

					[data-wenk].wenk--bottom:after, [data-wenk][data-wenk-pos="bottom"]:after {
					    bottom: auto;
					    top: 100%;
					    left: 50%;
					    -webkit-transform: translate(-50%, -10px);
					            transform: translate(-50%, -10px);
					}

					[data-wenk].wenk--bottom:hover:after, [data-wenk][data-wenk-pos="bottom"]:hover:after {
					    -webkit-transform: translate(-50%, 10px);
					            transform: translate(-50%, 10px);
					}

					[data-wenk].wenk--left:after, [data-wenk][data-wenk-pos="left"]:after {
					    bottom: auto;
					    left: auto;
					    top: 50%;
					    right: 100%;
					    -webkit-transform: translate(10px, -50%);
					            transform: translate(10px, -50%);
					}

					[data-wenk].wenk--left:hover:after, [data-wenk][data-wenk-pos="left"]:hover:after {
					    -webkit-transform: translate(-10px, -50%);
					            transform: translate(-10px, -50%);
					}

					[data-wenk].wenk--right:after, [data-wenk][data-wenk-pos="right"]:after {
					    bottom: auto;
					    top: 50%;
					    left: 100%;
					    -webkit-transform: translate(-10px, -50%);
					            transform: translate(-10px, -50%);
					}

					[data-wenk].wenk--right:hover:after, [data-wenk][data-wenk-pos="right"]:hover:after {
					    -webkit-transform: translate(10px, -50%);
					            transform: translate(10px, -50%);
					}

					[data-wenk][data-wenk-length="small"]:after, [data-wenk].wenk-length--small:after {
					    white-space: normal;
					    width: 80px;
					}

					[data-wenk][data-wenk-length="medium"]:after, [data-wenk].wenk-length--medium:after {
					    white-space: normal;
					    width: 150px;
					}

					[data-wenk][data-wenk-length="large"]:after, [data-wenk].wenk-length--large:after {
					    white-space: normal;
					    width: 260px;
					}

					[data-wenk][data-wenk-length="fit"]:after, [data-wenk].wenk-length--fit:after {
					    white-space: normal;
					    width: 100%;
					}

					[data-wenk][data-wenk-align="right"]:after, [data-wenk].wenk-align--right:after {
					    text-align: right;
					}

					[data-wenk][data-wenk-align="center"]:after, [data-wenk].wenk-align--center:after {
					    text-align: center;
					}

					[data-wenk=""]:after {
					    visibility: hidden !important;
					}
				</style>
				<dialog>
					<div class="webview">
						<div class="tools">
							<div>
								<div class="icon_tools icon_active" data-action="lineChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M2.978 16.567c3.306 0 2.885 4.154 7.362 4.154 4.476 0 2.22-13.41 7.605-13.41 5.384 0 2.903 10.897 7.024 10.897" stroke="#39246D" />
								          <path d="M2.978 21.567c3.877 0 3.25-11.846 7.362-11.846 4.111 0 3.576 6.59 7.605 6.59 4.028 0 2.903-8.103 7.024-8.103" stroke="#F74D71" />
								          <circle fill="#F74D71" cx="24.5" cy="8.5" r="1.5" />
								          <circle fill="#39246D" cx="24.5" cy="18.5" r="1.5" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="stackedAreaChart">
								  <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M10 14.398c3.314 0 4.906 1.602 8 1.602 3.094 0 3.69-2 7-2v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-1c2.525 0 3.686-3.602 7-3.602z" fill="#39246D" />
								          <path d="M10 11.398c3.314 0 4.906-7.398 8-7.398 3.094 0 3.69 5 7 5v5c-2.956 0-3.331 3-7 3s-4.387-2-8-2c-3.613 0-4.019 3-7 3V8c2.525 0 3.686 3.398 7 3.398z" fill="#F74D71" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="verticalBarChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path fill="#F74D71" d="M5 18h4v4H5zM19 11h4v11h-4zM12 6h4v16h-4z" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="groupedBarChart">
								    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
								      <g fill-rule="nonzero" fill="none">
								          <path fill="#F48AB9" d="M5 18h4v4H5z" />
								          <path fill="#39246D" d="M19 11h4v11h-4z" />
								          <path fill="#F74D71" d="M12 6h4v16h-4z" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="pieChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M14 23a9 9 0 0 0 0-18" fill="#39246D" />
								          <path d="M14 23a9 9 0 0 1 0-18" fill="#F48AB9" />
								          <path d="M14 23a9 9 0 0 1-8.136-12.853L14 14v9z" fill="#F74D71" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="progressChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <circle stroke="#ECECEC" stroke-width="4" cx="14" cy="14" r="7" />
								          <path d="M9.05 18.95a7 7 0 1 0 5.925-11.881" stroke="#F74D71" stroke-width="4" stroke-linecap="round" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="scatterPlot">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <circle fill="#39246D" cx="9" cy="9" r="4" />
								          <circle fill="#39246D" cx="19" cy="19" r="3" />
								          <circle fill="#39246D" cx="14.5" cy="14.5" r="1.5" />
								          <circle fill="#F74D71" cx="8.5" cy="19.5" r="2.5" />
								          <circle fill="#F74D71" cx="20" cy="9" r="3" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="histogram">
							        <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
							          <g fill="none" fill-rule="evenodd">
							              <path d="M4 24V9h5v5h5V9h5V4h5v20H4z" fill="#F74D71" />
							          </g>
							        </svg>
							    </div>
							</div>
							<div>
								<div class="icon_tools" data-action="areaChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M10 4.398c3.314 0 4.906 8.602 8 8.602 3.094 0 3.69 3 7 3v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2c2.525 0 3.686-12.602 7-12.602z" fill="#F74D71" opacity=".8" />
								          <path d="M10 19.398c3.314 0 4.906-3.398 8-3.398 3.094 0 3.69-7 7-7v10a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-7c2.525 0 3.686 7.398 7 7.398z" fill="#39246D" opacity=".8" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="streamGraph">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M3 9.474c2.807 0 4.16-3.183 6.94-3.183 2.78 0 4.468 4.149 7.028 4.147 2.559-.002 5.049-4.147 8.032-4.147v7.167c-3.592.754-6.27 1.131-8.032 1.131-2.645 0-4.855-4.131-7.028-4.131-2.172 0-4.568 1.66-6.94 1.66V9.473z" fill="#F74D71" />
								          <path d="M3 21.474c2.807 0 4.16-5.183 6.94-5.183 2.78 0 4.468 7.149 7.028 7.147 2.559-.002 5.049-8.147 8.032-8.147v-1.833c-3.592.754-6.27 1.131-8.032 1.131-2.645 0-4.855-4.131-7.028-4.131-2.172 0-4.568 1.66-6.94 1.66v9.356z" fill="#39246D" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="horizontalBarChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path fill="#39246D" d="M6 5h16v4H6zM6 19h12v4H6zM6 12h8v4H6z" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="groupedHorizontalBarChart">
								    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path fill="#F48AB9" fill-rule="nonzero" d="M10 5v4H6V5z" />
								          <path fill="#39246D" fill-rule="nonzero" d="M17 19v4H6v-4z" />
								          <path fill="#F74D71" fill-rule="nonzero" d="M22 12v4H6v-4z" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="donutChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M14 23a9 9 0 0 0 0-18" fill="#39246D" />
								          <path d="M14 23a9 9 0 0 1 0-18" fill="#F48AB9" />
								          <path d="M14 23a9 9 0 0 1-8.136-12.853L14 14v9z" fill="#F74D71" />
								          <circle fill="#FFF" cx="14" cy="14" r="5" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="sparkline">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path d="M3.072 9.14l1.832-.48 1.987.974 1-.974 2.044-.775.747 1.255 2.492-.946 1.06-1.227 2.472-.653 1.89 1.217 1.713-.564 1.627-.653 2.606.296" stroke="#F74D71" />
								          <circle fill="#F74D71" cx="24.5" cy="6.5" r="1.5" />
								          <circle fill="#F74D71" cx="24.5" cy="12.5" r="1.5" />
								          <circle fill="#F74D71" cx="24.5" cy="20.5" r="1.5" />
								          <path stroke="#F74D71" d="M3.072 14.14l1.832.52.987-.026 2 1.026 2.044-.775.747-.745 2.492.054 1.06 1.773 2.472-3.653 1.89-.783 1.713 1.436 1.617.782 2.63-1.175M3.072 20.14l1.832-1.48 1.987-.026 1 1.026 2.044 2.225 1.747.255 1.492.054 1.06-.227 2.472-.653 1.89-1.783 1.713.436 1.683 1.347 2.649-.9" />
								      </g>
								  </svg>
								</div>
								<div class="icon_tools" data-action="candlestickChart">
								    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
								      <g fill="none" fill-rule="evenodd">
								          <path fill="#F74D71" d="M12 5h4v9h-4z" />
								          <path d="M5 11h4v7H5v-7zm14 2h4v10h-4V13z" fill="#39246D" fill-rule="nonzero" />
								      </g>
								  </svg>
								</div>
							    <div class="icon_tools" data-action="heatmap">
									<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
										<g fill="none" fill-rule="evenodd">
											<path fill="#F74D71" d="M4 4h6v6H4z" />
											<path fill-opacity=".25" fill="#F74D71" d="M18 4h6v6h-6z" />
											<path fill-opacity=".75" fill="#F74D71" d="M4 18h6v6H4z" />
											<path fill-opacity=".5" fill="#F74D71" d="M4 11h6v6H4z" />
											<path fill-opacity=".25" fill="#F74D71" d="M18 18h6v6h-6z" />
											<path fill="#F74D71" d="M11 18h6v6h-6z" />
											<path fill-opacity=".75" fill="#F74D71" d="M11 11h6v6h-6z" />
											<path fill-opacity=".5" fill="#F74D71" d="M11 4h6v6h-6z" />
											<path fill="#F74D71" d="M18 11h6v6h-6z" />
										</g>
									</svg>
								</div>
							</div>
						</div>
						<div class="content">
							<div class="main_content">
								<div class="modal_header">
									<div class="chart_name">Line chart</div>
									<span class="link" id="close">Close</span>
								</div>
								<div class="button_group">
									<div class="radio active" data-name="random">Random</div>
									<div class="radio" data-name="table">Table</div>
									<div class="radio" data-name="json">JSON</div>
								</div>

								<!-- Random form -->
								<div class="data_form random_form form_active" id="random">
									<div class="grid_inputs">
										<div class="left_2_input" id="categories">
											<div class="settings_input">
												<p class="random_categories">Number of lines</p>
												<input id="categoriesInput" spellcheck="false" autocomplete="off" type="number" name="categories" value="1" min="1">
											</div>
										</div>
										<div class="right_2_input" id="items">
											<div class="settings_input" >
												<p class="random_items">Number of points</p>
												<input id="itemsInput" spellcheck="false" autocomplete="off" type="number" name="items" value="5" min="1">
											</div>
										</div>
									</div>
									<div class="grid_inputs">
										<div class="left_2_input">
											<div class="settings_input" id="randomType">
												<p>Select data distribution</p>
												<div class="select-wraper">
													<select class="select_height" name="randomType">
														<option value="0" selected>Random</option>
														<option value="1">Trend up</option>
														<option value="2">Trend down</option>
														<option value="3">Normal distribution</option>
														<option value="4">Mixed</option>
													</select>
												</div>
											</div>
										</div>
										<div class="right_2_input">
											<div class="grid_inputs">
												<div class="left_2_input">
													<div class="settings_input small_input" id="randomMin">
														<p>Min value</p>
														<input id="minInput" spellcheck="false" autocomplete="off" type="number" name="randomMin" value="0">
													</div>
												</div>
												<div class="right_2_input">
													<div class="settings_input small_input" id="randomMax">
														<p>Max value</p>
														<input id="maxInput" spellcheck="false" autocomplete="off" type="number" name="randomMax" value="100">
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Table form -->
								<div class="data_form new_columns" id="table">
									<div class="settings_input" id="tableLink">
										<div class="complex_title">
											<div class="complex_title_text">Upload data from  <span id="gs" class="link span_text">Google Sheets</span> or <span id="csv" class="link span_text">CSV file</span></div>
											<a href="https://docs.google.com/spreadsheets/d/1UFptXqmtFexYAyX9CKIYr0x7XMtltog8_kUnrCxoRBo/edit#gid=0" target="_blank" class="csv_help">Example</a>
										</div>
										<div class="tableLink">Load table data first...</div>
									</div>
									<div class="grid_inputs" id="tableData">
										<div class="left_2_input">
											<div class="settings_input" id="tableHeader">
												<p>Labels</p>
												<div class="select-wraper">
												 	<select class="select_height" name="tableHeader">
												 	</select>
												</div>
											</div>
										</div>
										<div class="right_2_input">
											<div class="settings_input" id="tableKeys">
												<p>Data for chart</p>
												<div class="checkbox-wraper" id="tableKeysCheck">
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- JSON form -->
								<div class="data_form" id="json">
									<div class="settings_input" id="jsonLink">
										<div class="complex_title">
											<div class="complex_title_text"><span id="httpJSON" class="link">HTTPS link</span> to remote JSON or <span id="localJSON" class="link span_text">Local JSON</span></div>
											<a href="https://pavel-kuligin.gitbook.io/chart/json-data#what-is-valid-json" target="_blank" class="json_help">Example</a>
										</div>
										<div class="jsonLink">Load JSON first...</div>
									</div>
									<div class="grid_inputs" id="jsonData">
										<div class="left_2_input">
											<div class="settings_input" id="jsonHeader">
												<p>Labels</p>
												<div class="select-wraper">
												 	<select class="select_height" name="jsonHeader">
												 	</select>
												</div>
											</div>
										</div>
										<div class="right_2_input">
											<div class="settings_input" id="jsonKeys">
												<p>Data for chart</p>
												<div class="checkbox-wraper" id="jsonKeysCheck">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="footer">
								<div class="button create-chart">Create chart</div>
								<div class="second_actions">
								    <a id="help" target="_blank" href="https://pavel-kuligin.gitbook.io/chart/">Help</a>
								    <a id="settings" href="#">Settings</a>
								</div>
							</div>
						</div>
					</div>
					<div class="linkGS">
						<div class="popup_header">
							<div class="popup_name">Link with Google Sheet</div>
							<a href="#" class="closeGS">Close</a>
						</div>
						<textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="linkGS" placeholder="https://docs.google.com/spreadsheets/d/sheetID/edit#gid=0"></textarea>
						<p>Share Google Sheet and copy URL from the address bar. Do not use special symbols in sheet names (e.g. /, &, =).</p>
						<div class="footer">
							<div class="button" id="syncGS">Sync with GS</div>
						</div>
					</div>
					<div class="linkHTTP">
						<div class="popup_header">
							<div class="popup_name">HTTPS link to JSON</div>
							<a href="#" class="closeHTTP">Close</a>
						</div>
						<textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="linkHTTP" placeholder="https://..."></textarea>
						<p>Type here link to remote JSON or REST API call that returns valid JSON.</p>
						<div class="footer">
							<div class="button" id="syncHTTP">Sync JSON</div>
						</div>
					</div>
					<div class="settings">
							<div class="popup_header">
								<div class="popup_name">Settings</div>
								<a href="#" class="close">Save and close</a>
							</div>
							<div class="form-element">
								<p>Select template or create settings from scratch</p>
								<select class="select_height" name="template" id="template"></select>
								<div class="save_template"><input id="updateTemplate" style="width: 16px;" type="checkbox" name="updateTemplate" checked>Save changes to template</div>
							</div>
							<div class="form-element">
								<div class="complex_title">
									<p>Colors for chart</p>
								</div>
								<div class="colors_preview drag-container" id="colorContainer">
								</div>
								<span class="description">You can edit colors in Templates</span>
							</div>
							<div class="settings_inputs">
								<div class="settings_input settings_input_item" id="grid">
									<p>Grid</p>
									<div class="select-wraper">
										<select class="select_height" name="grid">
											<option value="0" selected>Without grid</option>
											<option value="1">Full grid</option>
											<option value="2">Horizontal lines</option>
											<option value="3">Vertical lines</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="labels">
									<p>Labels</p>
									<div class="select-wraper">
										<select class="select_height" name="labels">
											<option value="0" selected>Without labels</option>
											<option value="1">Y & X labels</option>
											<option value="2">Y labels</option>
											<option value="3">X labels</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="lineType">
									<p>Type of lines</p>
									<div class="select-wraper">
										<select class="select_height" name="lineType">
											<option value="0" selected>Curved</option>
											<option value="1">Straight</option>
											<option value="2">Spline</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="dotType">
									<p>Dots</p>
									<div class="select-wraper">
										<select class="select_height" name="dotType">
											<option value="0" selected>Without dots</option>
											<option value="1">Filled dots</option>
											<option value="2">Unfilled dots</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="lineWidth">
									<p>Thickness of lines</p>
									<input spellcheck="false" autocomplete="off" type="number" name="lineWidth" value="2">
					    		</div>
								<div class="settings_input settings_input_item" id="sparkLineWidth">
									<p>Thickness of lines</p>
									<input spellcheck="false" autocomplete="off" type="number" name="sparkLineWidth" value="1">
								</div>
								<div class="settings_input settings_input_item" id="dotDiameter">
									<p>Diameter of dots</p>
									<input spellcheck="false" autocomplete="off" type="number" name="dotDiameter" value="8">
					      		</div>
								<div class="settings_input settings_input_item" id="sparkDotDiameter">
									<p>Diameter of dots</p>
									<input spellcheck="false" autocomplete="off" type="number" name="sparkDotDiameter" value="4">
								</div>
								<div class="settings_input settings_input_item" id="marginV">
									<p>Margin between bars (0..1)</p>
									<input spellcheck="false" autocomplete="off" type="number" name="marginV" value="0.2">
								</div>
								<div class="settings_input settings_input_item" id="marginH">
									<p>Margin between bars (0..1)</p>
									<input spellcheck="false" autocomplete="off" type="number" name="marginH" value="0.2">
								</div>
								<div class="settings_input settings_input_item" id="groupMarginV">
									<p>Margin between groups (0..1)</p>
									<input spellcheck="false" autocomplete="off" type="number" name="groupMarginV" value="0.2">
								</div>
								<div class="settings_input settings_input_item" id="groupMarginH">
									<p>Margin between groups (0..1)</p>
									<input spellcheck="false" autocomplete="off" type="number" name="groupMarginH" value="0.2">
								</div>
								<div class="settings_input settings_input_item" id="marginHist">
									<p>Margin between bars in px</p>
									<input spellcheck="false" autocomplete="off" type="number" name="marginHist" value="2">
								</div>
								<div class="settings_input settings_input_item" id="marginHeat">
									<p>Margin between cells in px</p>
									<input spellcheck="false" autocomplete="off" type="number" name="marginHeat" value="0">
								</div>
								<div class="settings_input settings_input_item" id="heatSegments">
									<p>Number of color segments</p>
									<input spellcheck="false" autocomplete="off" type="number" name="heatSegments" value="4">
								</div>
								<div class="settings_input settings_input_item" id="sorting">
									<p>Sorting</p>
									<div class="select-wraper">
										<select class="select_height" name="sorting">
											<option value="0" selected>Descending</option>
											<option value="1">Without sorting</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="typeOfCircle">
									<p>Type of circle</p>
									<div class="select-wraper">
										<select class="select_height" name="typeOfCircle">
											<option value="0" selected>Full circle</option>
											<option value="1">Half of circle</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="thicknessOfDonut">
									<p>Thickness of donut, px</p>
									<input spellcheck="false" autocomplete="off" type="number" name="thicknessOfDonut" value="30">
								</div>
								<div class="settings_input settings_input_item" id="thicknessOfProgress">
									<p>Thickness of progress, px</p>
									<input spellcheck="false" autocomplete="off" type="number" name="thicknessOfProgress" value="10">
								</div>
								<div class="settings_input settings_input_item" id="endOfLine">
									<p>End of line</p>
									<div class="select-wraper">
										<select class="select_height" name="endOfLine">
											<option value="0" selected>Default</option>
											<option value="1">Round</option>
										</select>
									</div>
								</div>
								<div class="settings_input settings_input_item" id="scatterDotDiameter">
									<p>Diameter of dots</p>
									<input spellcheck="false" autocomplete="off" type="number" name="scatterDotDiameter" value="8">
								</div>
								<div class="settings_input settings_input_item" id="candleMargin">
									<p>Margin between candles (0..1)</p>
									<input spellcheck="false" autocomplete="off" type="number" name="candleMargin" value="0.2">
								</div>
								<div class="settings_input settings_input_item" id="beginAtZero">
									<p>Begin at zero</p>
									<div class="select-wraper">
										<select class="select_height" name="beginAtZero">
											<option value="0" selected>Yes</option>
											<option value="1">No</option>
										</select>
									</div>
								</div>
							</div>
					</div>
				</dialog>
			`

			let dialog = document.querySelector("dialog")
			Object.assign(dialog.style, {
				width: 600
			});

			// UI variables
			let status = settings.status;

			if(status === false){
				$('.icon_tools').each(function(){
					if($(this).attr('data-action') === "lineChart" || $(this).attr('data-action') === "areaChart"){
						// do nothing
					} else{
						$(this).addClass('chart_disabled')
						$(this).attr('data-wenk', 'Available in Pro. Upgrage in My account')
						$(this).attr('data-wenk-pos', 'right')
					}
				})
			}

			// Plugin → UI
				$('#template').empty()
				templates.forEach((template, index) => {
					if(index === 0){
						defaultTemplate = template.id;
						$('#template').append('<option value="'+template.id+'" selected>'+template.name+'</option>')
					} else {
						$('#template').append('<option value="'+template.id+'">'+template.name+'</option>')
					}
				})
				var chartName = $('.icon_active').attr('data-action')
				applySettings(chartName, defaultTemplate)

			// Common functions
				// RANDOM DATA
					function applyRandomData(chart){
						if(chart === "lineChart"){
							$('.chart_name').text("Line chart")
							$('.random_categories').text("Number of lines")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "areaChart"){
							$('.chart_name').text("Area chart")
							$('.random_categories').text("Number of areas")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "stackedAreaChart"){
							$('.chart_name').text("Stacked area chart")
							$('.random_categories').text("Number of areas")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(2)
							$('input[name=items]').val(5)
					    } else if(chart === "streamGraph"){
							$('.chart_name').text("Stream graph")
							$('.random_categories').text("Number of areas")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(2)
							$('input[name=items]').val(5)
					    } else if(chart === "verticalBarChart"){
							$('.chart_name').text("Vertical bar chart")
							$('.random_categories').text("Number of categories")
							$('.random_items').text("Number of bars")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "horizontalBarChart"){
							$('.chart_name').text("Horizontal bar chart")
							$('.random_categories').text("Number of categories")
							$('.random_items').text("Number of bars")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "groupedBarChart"){
							$('.chart_name').text("Grouped bar chart")
							$('.random_categories').text("Number of categories")
							$('.random_items').text("Number of bars")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(2)
							$('input[name=items]').val(5)
					    } else if(chart === "groupedHorizontalBarChart"){
							$('.chart_name').text("Grouped horizontal bar chart")
							$('.random_categories').text("Number of categories")
							$('.random_items').text("Number of bars")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(2)
							$('input[name=items]').val(5)
					    } else if(chart === "pieChart"){
							$('.chart_name').text("Pie chart")
							$('.random_categories').text("Number of pie charts")
							$('.random_items').text("Number of slices")
							$('#categories').css("display", "none")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "donutChart"){
							$('.chart_name').text("Donut chart")
							$('.random_categories').text("Number of donut charts")
							$('.random_items').text("Number of slices")
							$('#categories').css("display", "none")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(5)
					    } else if(chart === "progressChart"){
							$('.chart_name').text("Progress chart")
							$('.random_categories').text("Number of progress charts")
							$('.random_items').text("Number of slices")
							$('#categories').css("display", "none")
							$('#items').css("display", "none")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(1)
					    } else if(chart === "sparkline"){
							$('.chart_name').text("Sparkline")
							$('.random_categories').text("Number of sparklines")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "none")
							$('#items').css("display", "block")
							$('input[name=categories]').val(1)
							$('input[name=items]').val(20)
					    } else if(chart === "scatterPlot"){
							$('.chart_name').text("Scatter plot")
							$('.random_categories').text("Dimensions (3 for Bubbles)")
							$('.random_items').text("Number of points")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
							$('input[name=categories]').val(2)
							$('input[name=items]').val(20)
					    } else if(chart === "candlestickChart"){
							$('.chart_name').text("Candlestick chart")
							$('.random_categories').text("Data parameters")
							$('.random_items').text("Number of candles")
							$('#categories').css("display", "none")
							$('#items').css("display", "block")
							$('input[name=categories]').val(4)
							$('input[name=items]').val(20)
					    } else if(chart === "histogram"){
					        $('.chart_name').text("Histogram")
					        $('.random_categories').text("Data parameters")
					        $('.random_items').text("Number of data points")
							$('#categories').css("display", "none")
							$('#items').css("display", "block")
					        $('input[name=categories]').val(1)
					        $('input[name=items]').val(100)
				        } else if(chart === "heatmap"){
					        $('.chart_name').text("Heatmap")
					        $('.random_categories').text("Number of columns")
					        $('.random_items').text("Number of rows")
							$('#categories').css("display", "block")
							$('#items').css("display", "block")
					        $('input[name=categories]').val(6)
					        $('input[name=items]').val(4)
				        }
					}

				// SETTINGS
					function applySettings(chart, selectedTemplate){
						$('.settings_input_item').css("display", "none")
						let template;

						templates.forEach((templateItem, index) => {
							if(Number(templateItem.id) === Number(selectedTemplate)){
								template = templateItem;
							}
						})

						applyColors(template.colors.common);

						// APPLY COMMON SETTINGS
						$('#grid option:eq('+template.grid.type+')').prop('selected', true)
						$('#labels option:eq('+template.labels.type+')').prop('selected', true)
						$('#lineType option:eq('+template.lineType+')').prop('selected', true)
						$('#sorting option:eq('+template.sorting+')').prop('selected', true)
						$('#typeOfCircle option:eq('+template.typeOfCircle+')').prop('selected', true)
						$('#beginAtZero option:eq('+template.beginAtZero+')').prop('selected', true)

						$('#dotType option:eq('+template.lineChart.dotType+')').prop('selected', true)
						$('input[name=lineWidth]').val(template.lineChart.lineWidth)
						$('input[name=dotDiameter]').val(template.lineChart.dotDiameter)

						$('input[name=marginV]').val(template.verticalBarChart.margin)
						$('input[name=marginH]').val(template.horizontalBarChart.margin)
						$('input[name=groupMarginV]').val(template.groupedBarChart.margin)
						$('input[name=groupMarginH]').val(template.groupedHorizontalBarChart.margin)

						$('input[name=thicknessOfDonut]').val(template.donutChart.thicknessOfDonut)
						$('input[name=thicknessOfProgress]').val(template.progressChart.thicknessOfProgress)
						$('#endOfLine option:eq('+template.progressChart.endOfLine+')').prop('selected', true)
						$('input[name=sparkLineWidth]').val(template.sparkline.lineWidth)
						$('input[name=sparkDotDiameter]').val(template.sparkline.dotDiameter)
						$('input[name=scatterDotDiameter]').val(template.scatterPlot.dotDiameter)
						$('input[name=candleMargin]').val(template.candlestickChart.margin)
						$('input[name=marginHist]').val(template.histogram.margin)
						$('input[name=marginHeat]').val(template.heatmap.margin)
		      			$('input[name=heatSegments]').val(template.heatmap.segments)

						if(chart === "lineChart"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#lineType').css("display", "block")
							$('#dotType').css("display", "block")
							$('#lineWidth').css("display", "block")
							$('#dotDiameter').css("display", "block")
							$('#beginAtZero').css("display", "block")
						} else if(chart === "areaChart" || chart === "stackedAreaChart" || chart === "streamGraph"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#lineType').css("display", "block")
						} else if(chart === "verticalBarChart"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#marginV').css("display", "block")
						} else if(chart === "horizontalBarChart"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#marginH').css("display", "block")
						} else if(chart === "groupedBarChart"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#groupMarginV').css("display", "block")
						} else if(chart === "groupedHorizontalBarChart"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#groupMarginH').css("display", "block")
						} else if(chart === "pieChart"){
							$('#sorting').css("display", "block")
							$('#typeOfCircle').css("display", "block")
						} else if(chart === "donutChart"){
							$('#sorting').css("display", "block")
							$('#typeOfCircle').css("display", "block")
							$('#thicknessOfDonut').css("display", "block")
						} else if(chart === "progressChart"){
							applyColors(template.colors.progressChart);

							$('#thicknessOfProgress').css("display", "block")
							$('#endOfLine').css("display", "block")
							$('#typeOfCircle').css("display", "block")
						} else if(chart === "sparkline"){
							applyColors(template.colors.sparkline);

							$('#sparkLineWidth').css("display", "block")
							$('#sparkDotDiameter').css("display", "block")
						} else if(chart === "scatterPlot"){
							applyColors(template.colors.scatterPlot);

							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#scatterDotDiameter').css("display", "block")
							$('#beginAtZero').css("display", "block")
						} else if(chart === "candlestickChart"){
							applyColors(template.colors.candlestickChart);

							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#candleMargin').css("display", "block")
							$('#beginAtZero').css("display", "block")
						} else if(chart === "histogram"){
							$('#grid').css("display", "block")
							$('#labels').css("display", "block")
							$('#marginHist').css("display", "block")
						} else if(chart === "heatmap"){
							$('#marginHeat').css("display", "block")
							$('#heatSegments').css("display", "block")
						}
					}

				// APPLY COLORS
					function applyColors(colors){
						$('#colorContainer').html("")
						colors.forEach(color => {
							$('#colorContainer').append('<div dragobj=\"0\" title=\"'+color+'\" class=\"color_item drag-box\" style=\"background-color:'+color+'\"></div>')
						})
					}

			// UI functions
				// TABS
				$('.radio').click(function(){
					var tab_id = $(this).attr('data-name');

					$('.radio').removeClass('active');
					$('.data_form').removeClass('form_active');

					$(this).addClass('active');
					$("#"+tab_id).addClass('form_active');
				})

				// ICON BUTTONS
				$('.icon_tools').click(function(){
					if(status === false){
						if($(this).attr('data-action') === "lineChart" || $(this).attr('data-action') === "areaChart"){
							$('.icon_tools').removeClass('icon_active');
							$(this).addClass('icon_active');
						}
					} else {
						$('.icon_tools').removeClass('icon_active');
						$(this).addClass('icon_active');
					}
				})

				// SWITCH CHARTS
				$('.icon_tools').click(function(){
					if(status === false){
						if($(this).attr('data-action') === "lineChart" || $(this).attr('data-action') === "areaChart"){
							var chart_id = $(this).attr('data-action');
							applySettings(chart_id, defaultTemplate)
				    		applyRandomData(chart_id)
						}
					} else {
						var chart_id = $(this).attr('data-action');
						applySettings(chart_id, defaultTemplate)
				    	applyRandomData(chart_id)
					}
				})

				// CHANGE TEMPLATE
				$('#template').on('change', function() {
					let chart = $('.icon_active').attr('data-action');
					applySettings(chart, this.value);
				});

				// GOOGLE POPUP
					$('#gs').click(function(){
						$('.linkGS').css("display", "block");
					})
					$('.closeGS').click(function(){
						$('.linkGS').css("display", "none");
					})

				// JSON POPUP
					$('#httpJSON').click(function(){
						$('.linkHTTP').css("display", "block");
					})
					$('.closeHTTP').click(function(){
						$('.linkHTTP').css("display", "none");
					})

				// SETTINGS
					$('#settings').click(function(){
						$('.settings').css("display", "block");
					})
					$('.close').click(function(){
						$('.settings').css("display", "none");
					})

			// Data functions
				// GRAB DATA
					function collectTableData(tableObject){
						if(tableObject.type === "csv"){
							$('.tableLink').html(tableObject.name)
						} else {
							var link = '<a class="link" href="'+tableObject.name+'" target="_blank">Open uploaded Google Sheet</a>';
							$('.tableLink').html(link)
						}

						var columns = tableObject.table[0],
						options = "",
						htmlOptions = "";

						columns.forEach((column, i) => {
							options += "<div class='checkbox-item'><input class='checkbox-box tableCheckbox' type='checkbox' id='dataTable_"+i+"' name='dataTable_"+i+"' value='"+column+"'><label>"+column+"</label></div>"

							if(i === 0){
								htmlOptions += "<option value=\""+i+"\" selected>"+column+"</option>"
							} else {
								htmlOptions += "<option value=\""+i+"\">"+column+"</option>"
							}
						})
						$('#tableKeysCheck').html(options);
						$('select[name=tableHeader]').html(htmlOptions);
						$('#tableData').css("display", "flex");

						$('.linkGS').css("display", "none");
						$('.closeGS').css("display", "block");
						$('textarea[name=linkGS]').prop('disabled',false);
						$('textarea[name=linkGS]').val('');
						$('#syncGS').text("Sync with GS");

						// Store data
						chartConfig.data.csv.name = tableObject.name;
						chartConfig.data.csv.type = tableObject.type;
						tableObject.table.shift()
						chartConfig.data.csv.data = tableObject.table;
					}

					function collectJSONData(jsonObject){
						$('.jsonLink').text(jsonObject.name)

						var keys = Object.keys(jsonObject.json[0]),
						options = "",
						htmlOptions = "";

						keys.forEach((key, i) => {
							options += "<div class='checkbox-item'><input class='checkbox-box jsonCheckbox' type='checkbox' id='dataJSON_"+i+"' name='dataJSON_"+i+"' value='"+key+"'><label>"+key+"</label></div>"

							if(i === 0){
								htmlOptions += "<option value=\""+i+"\" selected>"+key+"</option>"
							} else {
								htmlOptions += "<option value=\""+i+"\">"+key+"</option>"
							}
						})

						$('#jsonKeysCheck').html(options);
						$('select[name=jsonHeader]').html(htmlOptions)
						$('#jsonData').css("display", "flex");

						$('.linkHTTP').css("display", "none");
						$('.closeHTTP').css("display", "block");
						$('textarea[name=linkHTTP]').prop('disabled',false);
						$('textarea[name=linkHTTP]').val('');
						$('#syncHTTP').text("Sync JSON");

						// Store data
						chartConfig.data.json.jsonName = jsonObject.name;
						chartConfig.data.json.data = jsonObject.json;
					}



				// UPLOAD CSV
					$('#csv').click(function(){
						readCSV()
					})

					async function readCSV() {
						const file = await fs.getFileForOpening({ types: ["csv"] });
		    			if (!file) return;

		    			const result = await file.read();
		    			let newText = result.replace(/[\n]/g, ";").split('"'),
							cuttedText = new Array(),
							counter = 1;

						for(let i = 0; i < newText.length; i++){
							if(counter % 2 == 0){
								cuttedText[i] = newText[i].replace(/,/g,"")
							} else {
								cuttedText[i] = newText[i]
							}
							counter += 1;
						}

						let dataTable = cuttedText.join("").split(";");
						for (let i in dataTable) {
							dataTable[i] = dataTable[i].split(",")
						}

						let tableObject = {
							name : file.name,
							type : "csv",
							table : dataTable
						}
						collectTableData(tableObject)
					}

				// UPLOAD JSON
					$('#localJSON').click(function(){
						readJSON()
					})

					async function readJSON() {
						const file = await fs.getFileForOpening({ types: ["json"] });
		    			if (!file) return;

		    			let resultTemp = await file.read();
		    			let result = JSON.parse(resultTemp);
		      			let jObject = {
								name : file.name,
								json : result
							}

						collectJSONData(jObject)
					}

				// SYNC WITH GS
					$('#syncGS').click(function(){
						var link = $('textarea[name=linkGS]').val();
						var regexSheet = /d\/([a-zA-Z0-9-_]+)/g;
						var regexId = /gid=([0-9]+)/g;
						var sheets = regexSheet.exec(link);
						var ids = regexId.exec(link);
						if(sheets != null){
							var parsedLink = {
								sheet : sheets[1],
								id : ids[1],
								original : link
							}
							tableGS(parsedLink)
							$('#syncGS').text("Syncing in progress...")
							$('.closeGS').css("display", "none");
							$('textarea[name=linkGS]').prop('disabled', true)
						} else {
							// alert("Link to Google Sheet is not valid")
						}
					})

					function tableGS(gsData){
						var sheetsLink = "https://sheets.googleapis.com/v4/spreadsheets/" + gsData.sheet + "?&fields=sheets.properties&key=AIzaSyAOyxH85I1NqnV2Ta-rHKn7_MZpwVBTzmk";
						fetch(sheetsLink)
						.then(res => res.json())
						.then(data => {
							data.sheets.forEach(sheet => {
								if(sheet.properties.sheetId === Number(gsData.id)){
									var title = sheet.properties.title.replace(/ /g, "%20")
									var valuesLink = "https://sheets.googleapis.com/v4/spreadsheets/" + gsData.sheet + "/values/%27" + title + "%27%21A1:BZ100?key=AIzaSyAOyxH85I1NqnV2Ta-rHKn7_MZpwVBTzmk";
									fetch(valuesLink)
									.then(res => res.json())
									.then(valuesArray => {
										let tableObject = {
											name : gsData.original,
											type : "google",
											table : valuesArray.values
										}
										collectTableData(tableObject)
									})
								}
							})
						})
					}

				// SYNC WITH JSON
					$('#syncHTTP').click(function(){
						var link = $('textarea[name=linkHTTP]').val();
						chartConfig.data.json.jsonLink = link;
						loadJSON(link)
						$('#syncHTTP').text("Syncing in progress...")
						$('.closeHTTP').hide();
						$('textarea[name=linkHTTP]').prop('disabled', true)
					})

					function loadJSON(link){
						fetch(link)
						.then(res => res.json())
						.then(json => {
							let jsonObject = {
								name: link,
								json: json
							}
							let shortName = jsonObject.name.split("/")

							let jObject = {
								name : shortName[shortName.length-1],
								json : jsonObject.json
							}
							collectJSONData(jObject)
						})
					}

			// Collect data
				$('.create-chart').click(function(){

					// common data
						let chartName = $('.icon_active').attr('data-action'),
							randTypeArr = $('select[name=randomType]').prop('value');
						chartConfig.data.chartName = chartName
						chartConfig.data.fullChartName = $('.chart_name').text();
						chartConfig.data.selected = $('.button_group .active').attr('data-name');

					// random data
						chartConfig.data.random.categories.value = $('input[name=categories]').val();
						chartConfig.data.random.items.value = $('input[name=items]').val();
						chartConfig.data.random.min = $('input[name=randomMin]').val();
						chartConfig.data.random.max = $('input[name=randomMax]').val();
						chartConfig.data.random.randType = randTypeArr;
						chartConfig.data.random.categories.name = $('.random_categories').text();
						chartConfig.data.random.items.name = $('.random_items').text();

						// if(chartName === "pieChart" || chartName === "donutChart" || chartName === "progressChart" || chartName === "sparkline"){
						// 	chartConfig.data.random.categories.value = canvasData.length
						// }

					// table data
						let tableHeaders = new Array(),
							selectedTableHeader = $('select[name=tableHeader]').prop('value');

						$('select[name=tableHeader] option').each(function(){
							let newHeader = {
								name : $(this).text(),
								checked : false,
								index : Number($(this).val())
							}
							if(newHeader.index === Number(selectedTableHeader)){
								newHeader.checked = true
							}
							tableHeaders.push(newHeader)
						})
						chartConfig.data.csv.header = tableHeaders;

						let tableColumns = new Array(),
							tableIndex = 0;

						$('.tableCheckbox').each(function(){
							let newKey = {
								name    : $(this).val(),
								checked : false,
								index : tableIndex
							}
							if ($(this).is(":checked")) {
								newKey.checked = true;
							}
							tableIndex += 1;
							tableColumns.push(newKey)
						})
						
						chartConfig.data.csv.columns = tableColumns;

					// json data
						let jsonHeaders = new Array(),
							selectedJSONHeader = $('select[name=jsonHeader]').prop('value');

						$('select[name=jsonHeader] option').each(function(){
							let newHeader = {
								name : $(this).text(),
								checked : false,
								index : Number($(this).val())
							}
							if(newHeader.index === Number(selectedJSONHeader)){
								newHeader.checked = true
							}
							jsonHeaders.push(newHeader)
						})
						chartConfig.data.json.header = jsonHeaders;

						let jsonKeys = new Array(),
							jsonIndex = 0;

						$('.jsonCheckbox').each(function(){
							let newKey = {
								name    : $(this).val(),
								checked : false,
								index : jsonIndex
							}
							if ($(this).is(":checked")) {
								newKey.checked = true;
							}
							jsonIndex += 1;
							jsonKeys.push(newKey)
						})
						
						chartConfig.data.json.keys = jsonKeys;

					// settings
						let selectedTemplate = $('select[name=template]').prop('value'),
							newTemplate;

						console.log(selectedTemplate)

						templates.forEach((templateItem, index) => {
							if(Number(templateItem.id) === Number(selectedTemplate)){
								newTemplate = templateItem;
							}
						})

						newTemplate.grid.type = Number($('select[name=grid]').prop('value'));
						newTemplate.labels.type = Number($('select[name=labels]').prop('value'));
						newTemplate.lineType = Number($('select[name=lineType]').prop('value'));
						newTemplate.sorting = Number($('select[name=sorting]').prop('value'));
						newTemplate.typeOfCircle = Number($('select[name=typeOfCircle]').prop('value'));
						newTemplate.beginAtZero = Number($('select[name=beginAtZero]').prop('value'));
						newTemplate.lineChart.lineWidth = Number($('input[name=lineWidth]').val());
						newTemplate.lineChart.dotType = Number($('select[name=dotType]').prop('value'));
						newTemplate.lineChart.dotDiameter = Number($('input[name=dotDiameter]').val());
						newTemplate.verticalBarChart.margin = Number($('input[name=marginV]').val());
						newTemplate.horizontalBarChart.margin = Number($('input[name=marginH]').val());
						newTemplate.groupedBarChart.margin = Number($('input[name=groupMarginV]').val());
						newTemplate.groupedHorizontalBarChart.margin = Number($('input[name=groupMarginH]').val());
						newTemplate.donutChart.thicknessOfDonut = Number($('input[name=thicknessOfDonut]').val());
						newTemplate.progressChart.thicknessOfProgress = Number($('input[name=thicknessOfProgress]').val());
						newTemplate.progressChart.endOfLine = Number($('select[name=endOfLine]').prop('value'));
						newTemplate.sparkline.lineWidth = Number($('input[name=sparkLineWidth]').val());
						newTemplate.sparkline.dotDiameter = Number($('input[name=sparkDotDiameter]').val());
						newTemplate.scatterPlot.dotDiameter = Number($('input[name=scatterDotDiameter]').val());
						newTemplate.candlestickChart.margin = Number($('input[name=candleMargin]').val());
						newTemplate.histogram.margin = Number($('input[name=marginHist]').val());
						newTemplate.heatmap.margin = Number($('input[name=marginHeat]').val());
			    		newTemplate.heatmap.segments = Number($('input[name=heatSegments]').val());

			    		chartConfig.settings = newTemplate;
				})
			
			$('#close').click(function(){
				dialog.close()
			})

		document.querySelector(".create-chart").addEventListener("click", () => {
		    dialog.close()

			createChart(canvas, chartConfig, selection, settings)	    
		});

		return dialog.showModal()
    }
}

async function manageTemplates(selection) {
    let settings = await getSettings();
    if(settings.status){
		settings.template = await checkTemplate(settings.email);
		setSettings(settings)
	}

    // Create modal window
    	document.body.innerHTML = `
			<style type="text/css">
				.chart_name{
					font-family: sans-serif;
					font-size: 20px;
					font-weight: 700;
				}
				p{
					margin: 4px 0px !important;
					padding: 0 !important;
					font-family: sans-serif;
				    font-size: 12px;
				}
				a{
					text-decoration: none !important;
					color: #248CF1;
					cursor: pointer;
				}
				a:hover{
					color: #FD466E;
				}
				textarea{
					width: 100%;
					height: 300px;
					font-size: 14px !important;
					background: #f7f7f7;
					border-radius: 5px;
					border: 1px solid #f7f7f7;
					margin: 10px 0px !important;
					padding: 8px 12px !important;
					outline: none;
					transition: background 0.3s, border 0.3s;
				}
				textarea:focus{
					background: #fff;
					border: 1px solid #d7d7d7;
				}
				.link{
					color: #248CF1;
					cursor: pointer;
				}
				.link:hover{
					color: #FD466E;
				}
				.link_red{
					color: #FD466E;
					cursor: pointer;
				}
				.link_red:hover{
					color: #A11735;
				}
				#templates{
					margin-top: 4px;
				}
				.template{
					display: flex;
					justify-content: space-between;
					background: #FFFFFF;
					box-shadow: 0 3px 5px 0 rgba(0,0,0,0.05);
					border-radius: 5px;
					padding: 8px 12px 8px 12px;
					margin-bottom: 8px;
					transition: box-shadow 0.3s;
				}
				.template:hover{
					box-shadow: 0 3px 5px 0 rgba(0,0,0,0.1);
					cursor: pointer;
				}
				.template_name{
					font-weight: 700;
					margin-right: 20px;
				}
				.modal_header{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.new_template{
					display: flex;
					justify-content: space-between;
					padding: 4px 12px 4px 12px;
					margin-bottom: 16px;
				}
				.edit_template{
					position: fixed;
					display: none;
					flex-direction: column;
					justify-content: space-between;
					top: 0;
					left: 0;
					z-index: 1000;
					background: #fff;
					width: 100vw;
					height: 100vh;
					padding: 20px;
				}
				.footer{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin-top: 16px;
					font-size: 14px;
				}
				.button{
					font-size: 14px;
					padding: 8px 12px 8px 12px;
					color: #fff;
					background-color: #FD466E;
					border: none;
					border-radius: 4px;
					outline: none;
				}
				.button:hover{
					cursor: pointer;
					background-color: #e23158;
				}
				.template_name{
					flex: 1;
				}
				.alert{
					width: calc(100% - 16px);
					display: none;
					justify-content: space-between;
					z-index: 10000;
					position: absolute;
					top: 8px;
					left: 8px;
					height: 40px;
					background: #343434;
					color: #fff;
					border-radius: 4px;
					padding: 8px 12px 8px 16px;
					box-sizing: border-box;
					box-shadow: 0 2px 4px 0 rgba(0,0,0,0.21);
				}
				#alert_text{
					font-size: 16px;
					line-height: 24px;
					font-family: sans-serif;
				}
				.close_alert{
					margin-top: 4px;
					cursor: pointer;
				}
				/* LOADER */
				.loader{
					width: 100%;
					height: 100vh;
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 100000;
					background: rgb(106, 44, 119);
					background: linear-gradient(
						312deg,
						rgba(248, 134, 185, 1) 0%,
						rgba(253, 71, 109, 1) 100%
						);
					display: none;
					align-items: center;
					justify-content: center;
				}
				.spinner{
					width: 75px;
					height: 75px;
					border-radius: 100%;
					border-width: 8px;
					border-color: transparent;
					border-style: solid;
					border-top-color: rgba(255, 255, 255, 0.75);
					box-sizing: border-box;
					animation: opacity 0.5s linear infinite;
				}
				@keyframes opacity {
					0% {
						opacity: 1;
						transform: rotate(0deg);
					}
					50% {
						transform: rotate(180deg);
						opacity: 0.4;
					}
					100% {
						opacity: 1;
						transform: rotate(360deg);
					}
				}
				.flex{
					display: flex;
				}
			</style>
			<dialog>
				<!-- <div class="loader">
					<div class="spinner"></div>
				</div> -->
				<div class="alert">
					<div id="alert_text"></div>
					<div class="close_alert">
						<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-2-2h16v16H-2z"/><path d="M7.414 6l4.243 4.243-1.414 1.414L6 7.414l-4.243 4.243-1.414-1.414L4.586 6 .343 1.757 1.757.343 6 4.586 10.243.343l1.414 1.414L7.414 6z" fill="#FFF"/></g></svg>
					</div>
				</div>
				<div class="modal_header">
					<div class="chart_name">Templates</div>
					<span class="link" id="close">Close</span>
				</div>
				<p>The first template will be used as default.</p>
				<div id="templates">
				</div>
				<div class="new_template">
					<span class="link" id="createTemplate">+ Add new template</span>
				</div>
				<div class="edit_template">
					<div>
						<div class="chart_name">New template</div>
						<p>Need a reference for template? <a href="https://pavel-kuligin.gitbook.io/chart/templates" target="_blank">See an example with comments</a></p>
						<textarea id="templateJSON" spellcheck="false" autocomplete="off" name="templateJSON" placeholder="Paste template here..."></textarea>
					</div>
					<div class="footer">
						<div class="button">Save template</div>
						<div class="second_actions">
							<span class="link" id="settings">Cancel</span>
						</div>
					</div>
				</div>
			</dialog>
    	`

    	let dialog = document.querySelector("dialog")
		Object.assign(dialog.style, {
			width: 600,
			height: 450
		});

		// CHART DATA STORAGE
			let templates = settings.template,
				email,
				openedTemplate = null;

		// ALERTS
			// ALERT
			function showAlert(message){
				$('#alert_text').html(message);
				$('.alert').css('display','flex')
	        	setTimeout(closeAlert, 5000)
			}
			$('.close_alert').click(closeAlert())

			function closeAlert(){
				$('.alert').css('display','none')
			}

		// MAIN FUNCTIONS
			function getDataFromPlugin(){
				templates.forEach((template, index) => {
					let html;
					if(index === 0){
						html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag">Default</span></div>'
					} else {
						html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag"></span></div>'
					}
					$('#templates').append(html)
				})
			}
			getDataFromPlugin()

			$('#templates').on("mouseenter", ".template", function(){
				if($(this).children(".tag").html() != "Default"){
					$(this).children(".tag").html('<span class="link make_def">Make default</span>')
				}
			})
			$('#templates').on("mouseleave", ".template", function(){
				if($(this).children(".tag").html() != "Default"){
					$(this).children(".tag").html("")
				}
			})
			$('#templates').on("click", ".make_def", function(){
				let parent = $(this).parent()
				let template = parent.parent();
				$('.tag').html("")
				parent.html("Default")
				template.prependTo("#templates")
				let newTemplatesArray = new Array();
				$('.template').each(function(){
					newTemplatesArray.push(Number($(this).attr("data-templid")))
				})
				let orderedTemplates = new Array();
				newTemplatesArray.forEach(index => {
					templates.forEach(template => {
						if(template.id === index){
							orderedTemplates.push(template)
						}
					})
				})
				settings.template = orderedTemplates;
				setSettings(settings)
			})
			$('#templates').on("click", ".template_name", function(){
				templates.forEach(template => {
					if(template.id === Number($(this).parent().attr("data-templid"))){
						$("#templateJSON").val(JSON.stringify(template, null, 4))
						$(".edit_template").css("display", "flex")
						$(".edit_template .chart_name").text(template.name)
						$("#settings").text("Delete")
						$('.button').text("Save template")
						openedTemplate = template.id;
					}
				})
			})
			$('#createTemplate').click(function(){
				$("#templateJSON").val("")
				$(".edit_template").css("display", "flex")
				$(".edit_template .chart_name").text("Add new template")
				$('.button').text("Create template")
				$("#settings").text("Cancel")
			})
			$('#settings').click(function(){
				if($(this).text() === "Delete"){
					for(let i = 0; i < templates.length; i++){
						if (templates[i].id === openedTemplate){
							templates.splice(i, 1)
						}
					}

					$('#templates').html("")

					templates.forEach((template, index) => {
						let html;
						if(index === 0){
							html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag">Default</span></div>'
						} else {
							html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag"></span></div>'
						}
						$('#templates').append(html)
					})

					settings.template = templates;
					setSettings(settings)
				}
				$('.edit_template').hide();
			})
			$('.button').click(function(){
				function validatingJSON(json) {
					let checkedjson = null,
						pattern = /(\/\*[\S\s]*?\*\/)|(\/\/[^\n]*)/mg;
						
					try {
						checkedjson = JSON.parse(json.replace(pattern, ""))
					} catch(e) {
						showAlert(e.message)
					}

					return checkedjson 
				}

				let newTemplate = validatingJSON($('#templateJSON').val());
				if(newTemplate != null){
					if($(this).text() === "Save template"){
						for(let i = 0; i < templates.length; i++){
							if (templates[i].id === openedTemplate){
								templates[i] = newTemplate;
								$('#templateJSON').val("")
								templates[i].id = openedTemplate;
							}
						}
						$('.template').each(function(){
							if(Number($(this).attr("data-templid")) === openedTemplate){
								$(this).children(".template_name").text(newTemplate.name)
							}
						})
					} else {
						let minID = 0;
						if(templates.length > 0){
							templates.forEach(template => {
								if(template.id > minID){
									minID = template.id;
								}
							})
						}
						newTemplate.id = minID + 1;
						templates.push(newTemplate)
						$('#templates').html("")
						templates.forEach((template, index) => {
							let html;
							if(index === 0){
								html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag">Default</span></div>'
							} else {
								html = '<div class="template" data-templid="'+template.id+'"><span class="template_name">'+template.name+'</span><span class="tag"></span></div>'
							}
							$('#templates').append(html)
						})
					}
					$('.edit_template').hide();
					settings.template = templates;
					setSettings(settings)	
				}
			})
			$('#close').click(function(){
				dialog.close()
			})

	return dialog.showModal()
}

async function manageAccount(selection){
	let settings = await getSettings(),
		account = {
			email : settings.email,
			type : settings.type
		};

	function setAccountState(account){
		if(account.type === 'PRO'){
			account.type = "Pro account"
		} else if(account.type === 'TEAM'){
			account.type = "Team account"
		} else if(account.type === undefined && settings.status === true){
			account.type = "Pro account"
		} else {
			account.type = "Free account"
		}

		document.getElementsByClassName("input")[0].value = account.email;
		document.getElementsByClassName("status")[0].textContent = account.type;
		document.getElementById("update").className = "button";
		if(account.type === "Free account"){
			document.getElementById("buy").className = "";
		} else {
			document.getElementById("buy").className = "show_buy";
		}
	}

	// Create modal window
		document.body.innerHTML = `
			<style type="text/css">
				.chart_name{
					font-family: sans-serif;
					font-size: 20px;
					font-weight: 700;
				}
				p{
					margin: 4px 0px !important;
					padding: 0 !important;
					font-family: sans-serif;
				    font-size: 12px;
				}
				a{
					text-decoration: none !important;
					color: #248CF1;
					cursor: pointer;
				}
				a:hover{
					color: #FD466E;
				}
				input{
					margin: 5px 0px 10px 0px !important;
				    padding: 0 !important;
				    width: 100%;
				}
				.link{
					color: #248CF1;
					cursor: pointer;
				}
				.link:hover{
					color: #FD466E;
				}
				.status{
					font-family: sans-serif;
					font-size: 14px;
				}
				.test_file{
					color: #248CF1;
					cursor: pointer;
				}
				.test_file:hover{
					color: #FD466E;
				}
				.enabled{
					color: #343434;
					cursor: default;
				}
				.enabled:hover{
					color: #343434;
				}
				.content{
					width: 380px;
					height: 170px;
					background-color: #fff;
					padding: 20px;
					box-sizing: border-box;
				}
				.settings_popup{
					position: absolute;
					top: 0;
					left: 0;
					z-index: 1000;
					width: 420px;
					height: 300px;
					background-color: #fff;
					padding: 0 20px;
					box-sizing: border-box;
					overflow-y: scroll;
				}
				.button_group{
					border-radius: 4px;
					border: 1px solid #d7d7d7;
					font-family: sans-serif;
					display: flex;
					overflow: hidden;
					margin-bottom: 15px;
				}
				.radio{
					font-size: 14px;
					padding: 7px 12px 7px 12px;
					color: #343434;
					text-align: center;
					background-color: #fff;
					border-right: 1px solid #d7d7d7;
					flex-direction: row;
					flex: 1;
				}
				.radio:last-child{
					font-size: 14px;
					color: #343434;
					background-color: #fff;
					border-right: none;
					flex-direction: row;
				}
				.active{
					background-color: #ececec !important;
					cursor: default;
				}
				.radio:hover{
					background-color: #f9f9f9;
					cursor: pointer;
				}
				.active:hover{
					cursor: default;
					background-color: #ececec !important;
				}
				.data_request{
					display: none;
				}
				.inline-form{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.simple-form{
					flex-direction: column;
				}
				.form-element{
					width: 100%
				}
				.button{
					font-size: 14px;
					padding: 8px 12px 8px 12px;
					color: #fff;
					background-color: #FD466E;
					border: none;
					border-radius: 4px;
					outline: none;
				}
				.button:hover{
					cursor: pointer;
					background-color: #e23158;
				}
				.button:active{
					margin-top: 1px; 
				}

				.visible{
					display: flex;
				}
				.select_height{
					height: 30px;
				}

				.footer{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin-top: 20px;
				}
				.colors_preview{
					display: flex;
				}
				.color_item{
					width: 40px;
					height: 30px;
					border-radius: 4px;
					margin-right: 5px;
					cursor: pointer;
				}
				.description{
					display: inline-block;
					color: #a3a3a3;
					font-size: 10px;
					font-family: sans-serif;
					font-style: italic;
					margin-bottom: 15px;
				}
				.popup_header{
					display: flex;
					flex-direction: row;
					align-items: baseline;
					justify-content: space-between;
					margin-top: 20px;
				}
				.show{
					display: block;
				}
				.disabled_switch{
					display: none;
				}
				#local_json_text{
					display: none;
				}
				.loader {
					width: 420px;
					height: 320px;
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 100000;

					background: rgb(106, 44, 119);
					background: linear-gradient(
						312deg,
						rgba(248, 134, 185, 1) 0%,
						rgba(253, 71, 109, 1) 100%
						);
					display: none;
					align-items: center;
					justify-content: center;
				}
				.spinner {
					width: 75px;
					height: 75px;
					border-radius: 100%;
					border-width: 8px;
					border-color: transparent;
					border-style: solid;
					border-top-color: rgba(255, 255, 255, 0.75);
					box-sizing: border-box;
					animation: opacity 0.5s linear infinite;
				}
				@keyframes opacity {
					0% {
						opacity: 1;
						transform: rotate(0deg);
					}
					50% {
						transform: rotate(180deg);
						opacity: 0.4;
					}
					100% {
						opacity: 1;
						transform: rotate(360deg);
					}
				}
				.flex{
					display: flex;
				}
				.grey_text{
					background-color: #a3a3a3;
					cursor: not-allowed;
				}
				.grey_text:hover{
					background-color: #a3a3a3;
					cursor: not-allowed;
				}
				.show_buy{
					display: none;
				}
				#buy{
					margin-left: 8px
				}
				.alert{
					width: calc(100% - 16px);
					display: none;
					justify-content: space-between;
					z-index: 10000;
					position: absolute;
					top: 8px;
					left: 8px;
					height: 40px;
					background: #343434;
					color: #fff;
					border-radius: 4px;
					padding: 8px 12px 8px 16px;
					box-sizing: border-box;
					box-shadow: 0 2px 4px 0 rgba(0,0,0,0.21);
				}
				#alert_text{
					font-size: 16px;
					line-height: 24px;
					font-family: sans-serif;
				}
				.close_alert{
					margin-top: 4px;
					cursor: pointer;
				}
			</style>
			<dialog>
				<div class="alert">
					<div id="alert_text"></div>
					<div class="close_alert">
						<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-2-2h16v16H-2z"/><path d="M7.414 6l4.243 4.243-1.414 1.414L6 7.414l-4.243 4.243-1.414-1.414L4.586 6 .343 1.757 1.757.343 6 4.586 10.243.343l1.414 1.414L7.414 6z" fill="#FFF"/></g></svg>
					</div>
				</div>
				<div class="settings_popup">
					<div class="popup_header">
						<div class="chart_name">My account</div>
					</div>
					<div class="data_request_popup visible simple-form first-block" id="colors">
					  <div  class="form-element">
					    <p>Your email on Gumroad</p>
					    <input autocomplete="off" class="input" type="text" name="email" placeholder="my_mail@mail.com">
					  </div>
					  <div class="inline-form">
					  	<div class="form-element">
							<p>Status</p>
							<span class="status">Fetching...</span><a href="https://chartplugin.com/pricing.html" target="_blank" class="show_buy" id="buy">Upgrade to Pro</a>
						</div>
					  </div>
					</div>
					<div class="footer">
						<div class="button" id="update">Update status</div>
						<div class="second_actions">
							<span class="link" id="cancel">Cancel</span>
						</div>
					</div>
				</div>
			</dialog>
		`

		let dialog = document.querySelector("dialog")
		Object.assign(dialog.style, {
			width: 420,
			height: 230
		});

		// MAIN FUNCTIONS
			// ALERT
			function showAlert(message){
				$('#alert_text').html(message);
				$('.alert').css('display','flex')
			}
			$('.alert').click(function(){
				closeAlert()
			})

			function closeAlert(){
				$('.alert').css('display','none')
			}

			setAccountState(account)
			$('#cancel').click(function(){
				dialog.close()
			})
			$('#update').click(async function(){
				let email = document.getElementsByClassName("input")[0].value;
				document.getElementById("buy").className = "show_buy";
				document.getElementsByClassName("status")[0].textContent = "Updating...";
				document.getElementById("update").className += " grey_text";

				let subscription = await checkSubscribtion(email);

				if(subscription === null){
					showAlert("Connect to the internet to update status")
					document.getElementsByClassName("status")[0].textContent = account.type;
					document.getElementById("update").className = "button";
					if(account.type === "Free account"){
						document.getElementById("buy").className = "";
					} else {
						document.getElementById("buy").className = "show_buy";
					}
				}

				let template;

				if(subscription.type){
					template = await checkTemplate(email);
				}

				settings.email = subscription.email;
				settings.type = subscription.type;
				settings.status = subscription.status;
				if(template.length > 0){
					settings.template = template;
				}

				setSettings(settings)
				setAccountState(subscription)
			})

	return dialog.showModal()
}

function supportCommand(){
	uxp.shell.openExternal("https://join.slack.com/t/chart-plugin/shared_invite/zt-61tsh8gx-C0TBYxSU8ShA~IK_v121dA")
}

module.exports = {
    commands: {
        createChart : createChartCommand,
        manageTemplates : manageTemplates,
        manageAccount : manageAccount,
        supportCommand : supportCommand
    }
};