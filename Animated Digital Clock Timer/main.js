/*
* Copyright 2018 François Le Lay <mfworx@gmail.com>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const {Text, Rectangle, Color} = require("scenegraph") ;
const commands = require("commands") ;
const h = require("./h") ;
const fs = require("uxp").storage.localFileSystem ;
const { alert, error } = require("./lib/dialogs.js");

let dialog,
    pluginDataFolder,
    settingsFile,
    settings,
    startTimeValue, 
    endTimeValue, 
    colorValue, 
    fontSizeValue, 
    fontAspectRatioValue, 
    fontFamilyValue ;

async function doSettings(){
    
    pluginDataFolder    = await fs.getDataFolder() ;
    
    try {
        settingsFile    = await pluginDataFolder.getEntry("timer-settings.txt") ;
        settings        = await settingsFile.read() ;
    } catch( e ) {
        console.log(e) ;
    } 
    
    if(settings === undefined) {
        [startTimeValue, endTimeValue, colorValue, fontSizeValue, fontAspectRatioValue, fontFamilyValue] = 
            ["23:17", "07:44", "#000000", "30", "0.66", "Arial"] ;
    } else {
        var settingsObj = JSON.parse(settings) ;
        [startTimeValue, endTimeValue, colorValue, fontSizeValue, fontAspectRatioValue, fontFamilyValue] = 
            [settingsObj.startTime, settingsObj.endTime, settingsObj.color, settingsObj.fontSize, settingsObj.fontAspectRatio, settingsObj.fontFamily] ;
    }
}

async function inconsistentTimestamps(ts, te) {
    await error("Inconsistent Timestamps ", 
        ts + " < " + te,
        "This plugin allows you to create a timelapse of a countdown between two timestamps. In order to function correctly, it requires the start time to be greater that the end time."); 
}

async function incorrectArtboardSelection() {
    await error("Incorrect number of artboards selected", 
        "Please select exactly 2 artboards in Design mode before executing this plugin.",
        "Steps you can take:",
        "* Make sure you have 2 artboards or more in your document. If not, create blank ones.",
        "* Left-click on the name of a first artboard.",
        "* While holding the SHIFT key, left-click on the \nname of a second artboard.",
        "* Launch this plugin from the Plugins menu.");
}

async function incorrectTimeFormat(t){
    await error("Wrong time format " + t, 
        "Accepted format XX:YY where:",
        "* XX between 00 and 99",
        "* YY between 00 and 59",
        "* Make sure to use a column separator between XX and YY components");
}

async function getDialog(selection) {

    if (dialog != null) {
        dialog = null ;
    } 

    if (dialog == null) {
                  
        if( selection.items.length < 2 ){
            await incorrectArtboardSelection() ;
        } else {

            async function onsubmit() {

                let values = {
                    startTime: startTime.value,
                    endTime: endTime.value,
                    color: color.value,
                    fontSize: fontSize.value,
                    fontAspectRatio: fontAspectRatio.value,
                    fontFamily: fontFamily.value
                }
                
                const JSONValues = JSON.stringify(values) ;
                
                let newFile = await pluginDataFolder.createEntry("timer-settings.txt", {overwrite: true}) ;
                await newFile.write(JSONValues) ;
    
                let timeFormat = /^\d\d:[0-5]\d$/ ;
                let ts_a = timeFormat.exec(startTime.value) ;
                let ts_b = timeFormat.exec(endTime.value) ;

                if( ts_a == null ) {
                    dialog.close() ; 
                    await incorrectTimeFormat(startTime.value) ;
                } else if( ts_b == null ) {
                    dialog.close(); 
                    await incorrectTimeFormat(endTime.value) ;
                } else if( endTime.value > startTime.value ) {
                    dialog.close(); 
                    await inconsistentTimestamps(startTime.value, endTime.value) ;
                } else {
                    await createMaskedTextStrips(   selection,
                                                    startTime.value,
                                                    endTime.value,
                                                    color.value,
                                                    Number(fontSize.value),
                                                    Number(fontAspectRatio.value),
                                                    fontFamily.value ) ;
            
                    //  dialog is automatically closed after submit unless you call e.preventDefault()
                    dialog.close(); 
                }
            }
    
            let startTime, endTime, color, fontSize, fontAspectRatio, fontFamily ;

            dialog =
                h("dialog",
                    h("form", { method:"dialog", style: { width: 320 }, onsubmit },
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Start Time (mm:ss)"),
                                startTime = h("input", { value: startTimeValue })
                            ),
                            h("label",
                                h("span", "End Time (mm:ss)"),
                                endTime = h("input", { value: endTimeValue })
                            )
                        ),
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Font Color hex #"),
                                color = h("input", { value: colorValue })
                            )
                        ),
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Font size (px)"),
                                fontSize = h("input", { value: fontSizeValue })
                            )
                        ),
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Horizontal Spacing Ratio (> 0.50)"),
                                fontAspectRatio = h("input", { value: fontAspectRatioValue })
                            )
                        ),
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Font family"),
                                fontFamily = h("input", { value: fontFamilyValue })
                            )
                        ),
                        h("div", { class: "row" },
                            h("label",
                                h("span", "Once your timer elements are added to your artboards, all you have to do " + 
                                "is to switch to Prototype mode and create a few seconds long (e.g. 5s), Ease in-out," +
                                " auto-animate transition triggered by the action of your choice. Then press play and enjoy the timelapse.")
                            )
                        ),
                        h("footer",
                            h("button", { uxpVariant: "primary", onclick(e) { dialog.close("Cancelled") } }, "Cancel"),
                            h("button", { uxpVariant: "cta", type:"submit", onclick(e) { onsubmit(); e.preventDefault() } }, "Create Timer Elements")
                    )
                )
            );

            return dialog;
        }        
    }
}

async function createMaskedTextStrips(  selection, 
                                        startTime, 
                                        endTime, 
                                        color, 
                                        fontSize, 
                                        fontAspectRatio, 
                                        fontFamily) {
    
    const x = 20 ;
    const y = 50 ;

    const start = startTime ;
    const end   = endTime ;

    const startMinuteTens   = start[0] ;
    const startMinuteUnits  = start[1] ;
    const startSecondTens   = start[3] ;
    const startSecondUnits  = start[4] ;

    const startMinute       = Number( startMinuteTens + startMinuteUnits ) ;
    const startSecond       = Number( startSecondTens + startSecondUnits) ;

    const endMinuteTens     = end[0] ;
    const endMinuteUnits    = end[1] ;
    const endSecondTens     = end[3] ;
    const endSecondUnits    = end[4] ;

    const endMinute         = Number( endMinuteTens + endMinuteUnits ) ;
    const endSecond         = Number( endSecondTens + endSecondUnits ) ;

    const minuteSpan        = startMinute - endMinute ;
    const minuteTensSpan    = Number(startMinuteTens) - Number(endMinuteTens) ;
    

    const startMinuteTensStrip  = new Text() ;
    const startMinuteUnitsStrip = new Text() ;
    const endMinuteTensStrip    = new Text() ;
    const endMinuteUnitsStrip   = new Text() ;
    const columnStart           = new Text() ;
    const columnEnd             = new Text() ;
    const startSecondTensStrip  = new Text() ;
    const startSecondUnitsStrip = new Text() ;
    const endSecondTensStrip    = new Text() ;
    const endSecondUnitsStrip   = new Text() ;

    startMinuteTensStrip.fontFamily     = fontFamily ;
    startMinuteUnitsStrip.fontFamily    = fontFamily ;
    endMinuteTensStrip.fontFamily       = fontFamily ;
    endMinuteUnitsStrip.fontFamily      = fontFamily ;
    columnStart.fontFamily              = fontFamily ;
    columnEnd.fontFamily                = fontFamily ;
    startSecondTensStrip.fontFamily     = fontFamily ;
    endSecondTensStrip.fontFamily       = fontFamily ;
    startSecondUnitsStrip.fontFamily    = fontFamily ;
    endSecondUnitsStrip.fontFamily      = fontFamily ;

    // Minutes tens 
    startMinuteTensStrip.text   = new String("") ;
    var j = Number(endMinuteTens) ;  
    while( j <  Number(startMinuteTens)) {
        startMinuteTensStrip.text += new String(j) ;
        startMinuteTensStrip.text += "\n" ;
        j += 1 ;
    }
    startMinuteTensStrip.text   += startMinuteTens ;
    endMinuteTensStrip.text     = startMinuteTensStrip.text ;  

    // Minutes units
    startMinuteUnitsStrip.text = new String("") ;
    var j = endMinute ; 
    while( j < startMinute ) {
        startMinuteUnitsStrip.text += new String(j%10) ;
        startMinuteUnitsStrip.text += "\n" ;
        j += 1 ;
    }
    startMinuteUnitsStrip.text  += startMinuteUnits ;
    endMinuteUnitsStrip.text    = startMinuteUnitsStrip.text ;  

    // Seconds tens 
    startSecondTensStrip.text   = new String("")  ;
    var cycles = 6 - Number(endSecondTens) + Number(startSecondTens) + (minuteSpan-1)*6 ; 
    for( var j=0; j< cycles; j++) {
        startSecondTensStrip.text += new String( (Number(endSecondTens)+j) % 6 ) ;
        startSecondTensStrip.text += "\n" ;
    }
    startSecondTensStrip.text   += startSecondTens ;
    endSecondTensStrip.text     = startSecondTensStrip.text ;  

    // Seconds units 
    startSecondUnitsStrip.text = new String("") ;
    var fastCycles = 10 - Number(endSecondUnits) + Number(startSecondUnits) + (cycles-1)*10 ; 
    for( var j=0; j< fastCycles; j++) {
        startSecondUnitsStrip.text += new String( (Number(endSecondUnits)+j) % 10 ) ;
        startSecondUnitsStrip.text += "\n" ;
    }
    startSecondUnitsStrip.text  += startSecondUnits ;
    endSecondUnitsStrip.text    = startSecondUnitsStrip.text ;  

    // column
    columnStart.text    = ":" ;
    columnEnd.text      = ":" ;

    // set more text properties
    let lineSpacing = Math.round(fontSize * 1.1) ;
    
    startMinuteTensStrip.fill           = new Color(color) ;   
    startMinuteTensStrip.fontSize       = fontSize ;
    startMinuteTensStrip.lineSpacing    = lineSpacing ;

    startMinuteUnitsStrip.fill          = new Color(color) ;     
    startMinuteUnitsStrip.fontSize      = fontSize ;
    startMinuteUnitsStrip.lineSpacing   = lineSpacing ;

    endMinuteTensStrip.fill             = new Color(color) ;     
    endMinuteTensStrip.fontSize         = fontSize ;
    endMinuteTensStrip.lineSpacing      = lineSpacing ;

    endMinuteUnitsStrip.fill            = new Color(color) ;     
    endMinuteUnitsStrip.fontSize        = fontSize ;
    endMinuteUnitsStrip.lineSpacing     = lineSpacing ;

    columnStart.fill                    = new Color(color) ;     
    columnStart.fontSize                = fontSize ;
    columnStart.lineSpacing             = lineSpacing ;
    
    columnEnd.fill                      = new Color(color) ;     
    columnEnd.fontSize                  = fontSize ;
    columnEnd.lineSpacing               = lineSpacing ;
    
    startSecondTensStrip.fill           = new Color(color) ;     
    startSecondTensStrip.fontSize       = fontSize ;
    startSecondTensStrip.lineSpacing    = lineSpacing ;

    endSecondTensStrip.fill             = new Color(color) ;     
    endSecondTensStrip.fontSize         = fontSize ;
    endSecondTensStrip.lineSpacing      = lineSpacing ;

    startSecondUnitsStrip.fill          = new Color(color) ;     
    startSecondUnitsStrip.fontSize      = fontSize ;
    startSecondUnitsStrip.lineSpacing   = lineSpacing ;

    endSecondUnitsStrip.fill            = new Color(color) ;     
    endSecondUnitsStrip.fontSize        = fontSize ;
    endSecondUnitsStrip.lineSpacing     = lineSpacing ;

    let hspace = Math.round(fontAspectRatio*fontSize) ;

    // add to artboards
    selection.items[0].addChild(startMinuteTensStrip) ; 
    selection.items[0].addChild(startMinuteUnitsStrip) ;   
    selection.items[0].addChild(columnStart) ;
    selection.items[0].addChild(startSecondTensStrip) ;   
    selection.items[0].addChild(startSecondUnitsStrip) ;
    selection.items[1].addChild(endMinuteTensStrip) ; 
    selection.items[1].addChild(endMinuteUnitsStrip) ;
    selection.items[1].addChild(columnEnd) ;
    selection.items[1].addChild(endSecondTensStrip) ;
    selection.items[1].addChild(endSecondUnitsStrip) ;   

    // reposition start time strips
    startMinuteTensStrip.height = minuteTensSpan * lineSpacing - 1 ; 
    startMinuteTensStrip.moveInParentCoordinates(x, lineSpacing - startMinuteTensStrip.height);   
    startMinuteUnitsStrip.height = minuteSpan * lineSpacing - 1 ; 
    startMinuteUnitsStrip.moveInParentCoordinates(x+hspace, lineSpacing - startMinuteUnitsStrip.height) ; 
    columnStart.moveInParentCoordinates(x+hspace*2, lineSpacing) ;
    startSecondTensStrip.height = cycles * lineSpacing - 1 ; 
    startSecondTensStrip.moveInParentCoordinates(x+hspace*2.5, lineSpacing - startSecondTensStrip.height) ; 
    startSecondUnitsStrip.height = fastCycles * lineSpacing - 1 ; 
    startSecondUnitsStrip.moveInParentCoordinates(x+hspace*3.5, lineSpacing - startSecondUnitsStrip.height) ; 
 
    // reposition end time strips
    endMinuteTensStrip.moveInParentCoordinates(x, lineSpacing) ;   
    endMinuteUnitsStrip.moveInParentCoordinates(x+hspace, lineSpacing) ;
    columnEnd.moveInParentCoordinates(x+hspace*2, lineSpacing) ;
    endSecondTensStrip.moveInParentCoordinates(x+hspace*2.5, lineSpacing) ;
    endSecondUnitsStrip.moveInParentCoordinates(x+hspace*3.5, lineSpacing) ;

    // add and rename masks
    // IMPORTANT: we do this because all groups should be given the same name 
    // on all artboards or auto-animate will fail and perform a very disappointing 
    // dissolve transition instead.
    const rectStart     = new Rectangle() ;
    rectStart.width     = hspace*4.5 ;
    rectStart.height    = lineSpacing ;
    rectStart.name      = "Mask" ; 
    selection.items[0].addChild(rectStart) ; 
    rectStart.moveInParentCoordinates(x,2*(lineSpacing-fontSize)) ;

    const rectEnd       = new Rectangle() ;
    rectEnd.width       = hspace*4.5 ;
    rectEnd.height      = lineSpacing ;
    rectEnd.name        = "Mask" ; 
    selection.items[1].addChild(rectEnd) ; 
    rectEnd.moveInParentCoordinates(x,2*(lineSpacing-fontSize)) ;

    selection.items = [ startMinuteTensStrip, 
                        startMinuteUnitsStrip, 
                        columnStart, 
                        startSecondTensStrip, 
                        startSecondUnitsStrip, 
                        rectStart ] ;

    commands.createMaskGroup() ;
    let startMaskedGroup    = selection.items[0] ;
    startMaskedGroup.name   = "CounterMask" ;

    selection.items = [ endMinuteTensStrip, 
                        endMinuteUnitsStrip, 
                        columnEnd, 
                        endSecondTensStrip, 
                        endSecondUnitsStrip, 
                        rectEnd ] ;

    commands.createMaskGroup() ;
    let endMaskedGroup  = selection.items[0] ;
    endMaskedGroup.name = "CounterMask" ;   

}

module.exports = {
    commands: {
        makeCountdownTimer : async function (selection, documentRoot) {
            await doSettings() ;
            dialog = await getDialog(selection) ;
            await document.body.appendChild(dialog).showModal() ;
        }
    }
};
