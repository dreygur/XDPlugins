/******************************************************************************
 *
 * LTR to RTL (Hebrew)
 * ----------------
 *
 * Author: Alon Gruss
 * License: MIT
 * 
 * This Adobe XD plug-in helps you fix Hebrew text direction.
 * Converting multiline texts into point texts and back to convert soft line breaks into hard ones.
 * Building substrings of LTR and RTL chars to restructure the string.
 *  
 * Copyright (c) 2019 Alon Gruss
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ******************************************************************************/


/**
 * removed from manifest:
 * 
 */
const DEBUG_MODE = true;
const { Text } = require("scenegraph");
const { alert } = require("./lib/dialogs.js");
const CharTypes = {
    LTR: 'ltr',
    RTL: 'rtl',
    NONE: 'none',
    NUMBER: 'number'
}







function newSwitchHandlerFunction(selection) {
    if (DEBUG_MODE) {
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
        console.log("----------------");
        console.log("----------------");
        console.log("----------------");
    }

    // if the selection is empty
    if (selection.items.length == 0) {
        // alert the user
        alert("Nothing was selected!");
    } else {
        let textNodeCount = 0;

        // for each of the items in the selection...
        selection.items.forEach(node => {
            // if the node is a Text node...
            if (node instanceof Text) {



                // text in XD is kinda horrible for RTL languages
                // display character order is not the same as input order and changes after editing is done.
                // areaText is extremely difficult to work with because of uncontrollable soft line breaks.
                //
                // to trick XD we burn soft line breaks into hard line breaks:
                // "Changing area text to point text will also automatically insert hard line breaks ("\n")
                //  into the text to match the previous line wrapping's appearance exactly." 
                //
                // we do this by converting areaText to pointText
                node = toPointText(node);
                let originalText = node.text;

                if (DEBUG_MODE) {
                    console.log("Original string: ", originalText);
                }

                // We normalize and trim the text to make sure we don't have any extra whitespace
                let preprocessText = node.text.normalize().trim();

                // We use the hard breaks to split our text into lines - easier to work with.
                let lines = preprocessText.split('\n');

                let resultLines = [];
                lines.forEach(line => {
                    // decompose the line into an array of string consisting of LTR, RTL and NONE-DIRECTINAL chars.
                    let decomposedLineArray = decomposeOriginalLine(line);

                    // if we got more than one string in the array that means we need to try and fix it (do we? maybe only relevent when we have RTL chars ex: "!Hello!").
                    if (decomposedLineArray.length > 1) {
                        //let flippedDirectionsArray = flipDirections(decomposedStringArray);

                        // build an array of chained LTR and chained RTL strings.
                        let chainArray = buildChains(decomposedLineArray);

                        // reverse the order of the LTR and RTL chains. >>> Is this always needed? not sure!
                        chainArray.reverse();

                        // join the reversed array into a String.
                        let resultSingleLine = chainArray.join("");

                        //>>
                        resultSingleLine = fakeStartingWithNumbers(resultSingleLine);
                        //>>

                        //console.log("Reversed chain array: ", resultString);
                        resultLines.push(resultSingleLine);
                    } else {
                        resultLines.push(decomposedLineArray);
                    }
                });

                // We join up our fixed lines into one big string
                node.text = resultLines.join('\n');

                //console.log("joined lines", node.text);

                // If we changed something - we count it.
                if (originalText != node.text) {
                    textNodeCount++;
                }
            }
        });

        // If nothing was fixed we tell the user.
        if (textNodeCount == 0) {
            alert("There was nothing to fix!");
        }
    }

    function toPointText(node) {
        // Official way :)
        node.areaBox = null;
        return node;
    }



    function buildChains(inputArray) {
        //console.log("----------------");
        //console.log("Building Chains");
        let chainArray = [];
        let chainBuffer = "";
        // create a buffer to store trailing NONE-DIRECTIONAL strings.

        let lastStringDirection = "";
        let trailingChainBuffer = "";
        lastStringDirection = CharTypes.NONE;

        // CODE FOR CLOSED CHAINS
        // we need to build closed chains
        for (let i = 0; i < inputArray.length; i++) {
            if (i == '/') i += 2; //escape characters
            let currentStringDirection = getCharDirection(inputArray[i]);
            if (currentStringDirection == CharTypes.NONE) {
                trailingChainBuffer += inputArray[i];
            } else {
                if (currentStringDirection == lastStringDirection) {
                    chainBuffer += trailingChainBuffer + inputArray[i];
                    trailingChainBuffer = '';
                } else {
                    if (trailingChainBuffer.length > 0) chainArray.push(trailingChainBuffer);
                    trailingChainBuffer = '';
                    if (chainBuffer.length > 0) chainArray.push(chainBuffer);
                    chainBuffer = '';
                    lastStringDirection = currentStringDirection;
                    chainBuffer += inputArray[i];
                }
            }

            ////console.log("index", i, chainArray[chainArray.length - 1], "chainBuffer", chainBuffer, "trailingChainBuffer", trailingChainBuffer);
        }
        if (trailingChainBuffer.length > 0) chainArray.push(trailingChainBuffer);
        if (chainBuffer.length > 0) chainArray.push(chainBuffer);

        ////console.log("index", chainArray.length - 1, chainArray[chainArray.length - 1], "chainBuffer", chainBuffer, "trailingChainBuffer", trailingChainBuffer);
        // This flips none directional chars
        // we need this for a lot but it also flips spaces before numbers...
        // ['LTR','NONE'] or ['RTL','NONE'] or ['NONE','LTR'] or ['NONE','RTL'] ==>> ['NONE','LTR'] or ['NONE','RTL'] or ['LTR','NONE'] or ['RTL','NONE']



        console.log("=================================");
        console.log("Converted from: ", chainArray);
        for (let i = 1; i < chainArray.length; i += 2) {
            if ((getCharDirection(chainArray[i - 1]) == CharTypes.NONE &&
                getCharDirection(chainArray[i]) != CharTypes.NONE) ||
                (getCharDirection(chainArray[i - 1]) != CharTypes.NONE &&
                    getCharDirection(chainArray[i]) == CharTypes.NONE)) {
                chainArray.splice(i - 1, 2, chainArray[i], chainArray[i - 1]);
            }
        }
        console.log("To: ", chainArray);

        // ['NONE A','LTR','NONE B'] ==>> ['NONE B','LTR','NONE A']
        console.log("=================================");
        console.log("Converted from: ", chainArray);
        for (let i = 2; i < chainArray.length; i++) {
            if (getCharDirection(chainArray[i - 2]) == CharTypes.NONE &&
                getCharDirection(chainArray[i - 1]) == CharTypes.LTR &&
                getCharDirection(chainArray[i]) == CharTypes.NONE) {
                chainArray.splice(i - 2, 3, chainArray[i], chainArray[i - 1], chainArray[i - 2]);
            }
        }
        console.log("To: ", chainArray);

        //// ['?','!','א'] ==>> ['?','','!']
        // ['NONE A','NONE B','RTL'] ==>> ['NONE A','RTL','NONE B']
        console.log("=================================");
        console.log("Converted from: ", chainArray);
        for (let i = 2; i < chainArray.length; i++) {
            if (getCharDirection(chainArray[i - 2]) == CharTypes.NONE &&
                getCharDirection(chainArray[i - 1]) == CharTypes.NONE &&
                getCharDirection(chainArray[i]) == CharTypes.RTL) {
                chainArray.splice(i - 2, 3, chainArray[i - 2], chainArray[i], chainArray[i - 1]);
            }
        }
        console.log("To: ", chainArray);

        // ['LTR','RTL','NONE'] ==>> ['LTR','NONE','RTL']
        console.log("=================================");
        console.log("Converted from: ", chainArray);
        for (let i = 2; i < chainArray.length; i++) {
            if (getCharDirection(chainArray[i - 2]) == CharTypes.LTR &&
                getCharDirection(chainArray[i - 1]) == CharTypes.RTL &&
                getCharDirection(chainArray[i]) == CharTypes.NONE) {
                chainArray.splice(i - 2, 3, chainArray[i - 2], chainArray[i], chainArray[i - 1]);
            }
        }
        console.log("To: ", chainArray);

        // ['RTL','LTR','NONE'] ==>> ['RTL','NONE','LTR']
        console.log("=================================");
        console.log("Converted from: ", chainArray);
        for (let i = 2; i < chainArray.length; i++) {
            if (getCharDirection(chainArray[i - 2]) == CharTypes.RTL &&
                getCharDirection(chainArray[i - 1]) == CharTypes.LTR &&
                getCharDirection(chainArray[i]) == CharTypes.NONE) {
                chainArray.splice(i - 2, 3, chainArray[i - 2], chainArray[i], chainArray[i - 1]);
            }
        }
        console.log("To: ", chainArray);
        console.log("=================================");

        return chainArray;
    }


    function decomposeOriginalLine(inputString) {
        //console.log("----------------");
        //console.log("Decomposing Original");
        // we are trying to end up with an array of objects
        let superString = [];
        let stringBuffer = "";
        let lastCharDirection = "";
        // each object is a String which can abide by LTR or RTL
        // each object is can be padded by delimiters which are non specific to direction
        // so we need to use a buffer to store characters until pushing them to a relevent object

        stringBuffer += inputString.charAt(0);
        lastCharDirection = getCharDirection(inputString.charAt(0));
        //console.log("First char direction is: ", lastCharDirection, " for: ", inputString.charAt(0));
        for (let i = 1; i < inputString.length; i++) {
            let currentCharDirection = getCharDirection(inputString.charAt(i));
            if (currentCharDirection != lastCharDirection) {
                // push the buffer into the array
                superString.push(stringBuffer);
                // reset the buffer
                stringBuffer = "";
            }
            // add the char to the buffer
            stringBuffer += inputString.charAt(i);

            // update the lastCharDirection
            lastCharDirection = currentCharDirection;
        }
        // push the remaining buffer into the array
        superString.push(stringBuffer);

        return superString;
    }

    function getCharDirection(inputString) {
        let charCode = inputString.charCodeAt(0);
        if ((charCode >= 65 && charCode <= 122)) {
            return CharTypes.LTR;
        } else if ((charCode >= 48 && charCode <= 57) || charCode >= 222) { // We consider numbers RTL !!
            return CharTypes.RTL;
        }
        return CharTypes.NONE;
    }
}

function fakeStartingWithNumbers(inputText) {
    let firstChar = inputText.charCodeAt(0);
    if (firstChar >= 48 && firstChar <= 57) {
        // Add a dummy RTL char before it
        return '\u200F'.concat(inputText);
    }
    return inputText;
}


module.exports = {
    commands: {
        switchToRTL: newSwitchHandlerFunction
    }
};