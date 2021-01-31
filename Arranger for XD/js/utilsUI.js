const honeyJS = require("./honey");


// --------------
// UPDATE / ENABLE UI / DISABLE UI
// --------------
function enableUI (val) {

    if (val === true) {
        // --------------
        // CIRCLE
        // --------------
        document.querySelector('#circleTxtSizeW').removeAttribute("disabled");
        document.querySelector('#circleTxtSizeH').removeAttribute("disabled");
        //
        document.querySelector('#circleTxtPosX').removeAttribute("disabled");
        document.querySelector('#circleTxtPosY').removeAttribute("disabled");
        //
        // document.querySelector('#circleBtnCW').removeAttribute("disabled");
        // document.querySelector('#circleBtnCCW').removeAttribute("disabled");
        document.querySelector('#circleBtnCW').classList.remove("disabled");
        document.querySelector('#circleBtnCCW').classList.remove("disabled");
        //
        document.querySelector('#circleStartAngle').removeAttribute("disabled");
        document.querySelector('#circleStartSlider').removeAttribute("disabled");
        //
        document.querySelector('#circleCbEndAngle').removeAttribute("disabled");

        let isChecked = Boolean(document.querySelector("#circleCbEndAngle").checked);
        if (isChecked === true ) {
            document.querySelector('#circleEndSlider').removeAttribute("disabled");
            document.querySelector('#circleEndAngle').removeAttribute("disabled");
        }

        document.querySelector('#circleCbAdjustLastItem').removeAttribute("disabled");
        // document.querySelector('#circleBtnHelpAdjust').removeAttribute("disabled");
        //
        // document.querySelector('#circleBtnOrientation0').removeAttribute("disabled");
        // document.querySelector('#circleBtnOrientation1').removeAttribute("disabled");
        // document.querySelector('#circleBtnOrientation2').removeAttribute("disabled");
        // document.querySelector('#circleBtnOrientation3').removeAttribute("disabled");
        // document.querySelector('#circleBtnOrientation4').removeAttribute("disabled");

        document.querySelector('#circleBtnOrientation0').classList.remove("disabled");
        document.querySelector('#circleBtnOrientation1').classList.remove("disabled");
        document.querySelector('#circleBtnOrientation2').classList.remove("disabled");
        document.querySelector('#circleBtnOrientation3').classList.remove("disabled");
        document.querySelector('#circleBtnOrientation4').classList.remove("disabled");

        //
        document.querySelector('#circleCbRandomOrder').removeAttribute("disabled");
        //
        document.querySelector('#circleBtnAction').removeAttribute("disabled");
        // --------------
        // GRID
        // --------------
        document.querySelector('#gridTxtCols').removeAttribute("disabled");
        //
        document.querySelector('#gridTxtGutterW').removeAttribute("disabled");
        document.querySelector('#gridTxtGutterH').removeAttribute("disabled");
        //
        document.querySelector('#gridCbStartPos').removeAttribute("disabled");
        document.querySelector('#gridTxtPositionX').removeAttribute("disabled");
        document.querySelector('#gridTxtPositionY').removeAttribute("disabled");
        //
        document.querySelector('#gridCbRandomOrder').removeAttribute("disabled");
        //
        document.querySelector('#gridBtnAction').removeAttribute("disabled");
        // --------------
        // WAVE
        // --------------
        document.querySelector('#waveTxtPeriod').removeAttribute("disabled");
        document.querySelector('#waveTxtAmplitude').removeAttribute("disabled");
        //
        document.querySelector('#waveTxtDistance').removeAttribute("disabled");
        document.querySelector('#waveTxtStartAngle').removeAttribute("disabled");
        //
        document.querySelector('#waveCbStartPos').removeAttribute("disabled");
        document.querySelector('#waveTxtPositionX').removeAttribute("disabled");
        document.querySelector('#waveTxtPositionY').removeAttribute("disabled");
        //
        document.querySelector('#waveCbRandomOrder').removeAttribute("disabled");
        //
        document.querySelector('#waveBtnAction').removeAttribute("disabled");
        // --------------
        // HONEY
        // --------------
        document.querySelector('#honeyTxtCols').removeAttribute("disabled");
        //
        document.querySelector('#honeyTxtGutterW').removeAttribute("disabled");
        document.querySelector('#honeyTxtGutterH').removeAttribute("disabled");
        //
        document.querySelector('#honeyCbRandomOrder').removeAttribute("disabled");
        //
        document.querySelector('#honeyCbOffsetX').removeAttribute("disabled");
        let isCheckedHoneyX = Boolean( document.querySelector('#honeyCbOffsetX').checked );
        if (isCheckedHoneyX === true ) {
            resfreshOffsetX();
        } else {
            document.querySelector('#honeyTxtOffsetX').removeAttribute("disabled");
        }

        document.querySelector('#honeyCbOffsetY').removeAttribute("disabled");
        let isCheckedHoneyY = Boolean( document.querySelector('#honeyCbOffsetY').checked );
        if (isCheckedHoneyY === true ) {
            resfreshOffsetY();
        } else {
            document.querySelector('#honeyTxtOffsetY').removeAttribute("disabled");
        }
        //
        document.querySelector('#honeyBtnPattern1').classList.remove("disabled");
        document.querySelector('#honeyBtnPattern2').classList.remove("disabled");
        document.querySelector('#honeyCbAlternateRows').removeAttribute("disabled");
        //
        document.querySelector('#honeyBtnAction').removeAttribute("disabled");


    } else if (val === false) {
        // --------------
        // CIRCLE
        // --------------
        document.querySelector('#circleTxtSizeW').setAttribute("disabled", "disabled");
        document.querySelector('#circleTxtSizeH').setAttribute("disabled", "disabled");
        //
        document.querySelector('#circleTxtPosX').setAttribute("disabled", "disabled");
        document.querySelector('#circleTxtPosY').setAttribute("disabled", "disabled");
        //
        // document.querySelector('#circleBtnCW').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnCCW').setAttribute("disabled", "disabled");
        document.querySelector('#circleBtnCW').classList.add("disabled");
        document.querySelector('#circleBtnCCW').classList.add("disabled");
        //
        document.querySelector('#circleStartAngle').setAttribute("disabled", "disabled");
        document.querySelector('#circleEndAngle').setAttribute("disabled", "disabled");
        document.querySelector('#circleCbEndAngle').setAttribute("disabled", "disabled");
        document.querySelector('#circleCbAdjustLastItem').setAttribute("disabled", "disabled");
        document.querySelector('#circleStartSlider').setAttribute("disabled", "disabled");
        document.querySelector('#circleEndSlider').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnHelpAdjust').setAttribute("disabled", "disabled");
        //
        // document.querySelector('#circleBtnOrientation0').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnOrientation1').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnOrientation2').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnOrientation3').setAttribute("disabled", "disabled");
        // document.querySelector('#circleBtnOrientation4').setAttribute("disabled", "disabled");

        document.querySelector('#circleBtnOrientation0').classList.add("disabled");
        document.querySelector('#circleBtnOrientation1').classList.add("disabled");
        document.querySelector('#circleBtnOrientation2').classList.add("disabled");
        document.querySelector('#circleBtnOrientation3').classList.add("disabled");
        document.querySelector('#circleBtnOrientation4').classList.add("disabled");
        //
        document.querySelector('#circleCbRandomOrder').setAttribute("disabled", "disabled");
        //
        document.querySelector('#circleBtnAction').setAttribute("disabled", "disabled");
        // --------------
        // GRID
        // --------------
        document.querySelector('#gridTxtCols').setAttribute("disabled", "disabled");
        //
        document.querySelector('#gridTxtGutterW').setAttribute("disabled", "disabled");
        document.querySelector('#gridTxtGutterH').setAttribute("disabled", "disabled");
        //
        document.querySelector('#gridCbStartPos').setAttribute("disabled", "disabled");
        document.querySelector('#gridTxtPositionX').setAttribute("disabled", "disabled");
        document.querySelector('#gridTxtPositionY').setAttribute("disabled", "disabled");
        //
        document.querySelector('#gridCbRandomOrder').setAttribute("disabled", "disabled");
        //
        document.querySelector('#gridBtnAction').setAttribute("disabled", "disabled");
        // --------------
        // WAVE
        // --------------
        document.querySelector('#waveTxtPeriod').setAttribute("disabled", "disabled");
        document.querySelector('#waveTxtAmplitude').setAttribute("disabled", "disabled");
        //
        document.querySelector('#waveTxtDistance').setAttribute("disabled", "disabled");
        document.querySelector('#waveTxtStartAngle').setAttribute("disabled", "disabled");
        //
        document.querySelector('#waveCbStartPos').setAttribute("disabled", "disabled");
        document.querySelector('#waveTxtPositionX').setAttribute("disabled", "disabled");
        document.querySelector('#waveTxtPositionY').setAttribute("disabled", "disabled");
        //
        document.querySelector('#waveCbRandomOrder').setAttribute("disabled", "disabled");
        //
        document.querySelector('#waveBtnAction').setAttribute("disabled", "disabled");
        // --------------
        // HONEY
        // --------------
        document.querySelector('#honeyTxtCols').setAttribute("disabled", "disabled");
        //
        document.querySelector('#honeyTxtGutterW').setAttribute("disabled", "disabled");
        document.querySelector('#honeyTxtGutterH').setAttribute("disabled", "disabled");
        //
        document.querySelector('#honeyCbRandomOrder').setAttribute("disabled", "disabled");
        //
        // document.querySelector('#honeyCbHCActivated').setAttribute("disabled", "disabled");
        document.querySelector('#honeyCbOffsetX').setAttribute("disabled", "disabled");
        document.querySelector('#honeyCbOffsetY').setAttribute("disabled", "disabled");
        //
        document.querySelector('#honeyTxtOffsetX').setAttribute("disabled", "disabled");
        document.querySelector('#honeyTxtOffsetY').setAttribute("disabled", "disabled");
        //
        // document.querySelector('#honeyBtnPattern1').setAttribute("disabled", "disabled");
        // document.querySelector('#honeyBtnPattern2').setAttribute("disabled", "disabled");

        document.querySelector('#honeyBtnPattern1').classList.add("disabled");
        document.querySelector('#honeyBtnPattern2').classList.add("disabled");
        document.querySelector('#honeyCbAlternateRows').setAttribute("disabled", "disabled");
        //
        document.querySelector('#honeyBtnAction').setAttribute("disabled", "disabled");
    }
}

function resfreshOffsetX () {
    let val = honeyJS.getAutoOffsetX();
    // Guard if anything goes wrong
    if (val === undefined) val = 0;
    document.querySelector("#honeyTxtOffsetX").value = val;
}

function resfreshOffsetY () {
    let val = honeyJS.getAutoOffsetY();
    // Guard if anything goes wrong
    if (val === undefined) val = 0;
    if (val > 0) val = val * -1;
    document.querySelector("#honeyTxtOffsetY").value = val;
}

module.exports = {
    enableUI,
    resfreshOffsetX,
    resfreshOffsetY
};