const utilsJS = require("./js/utils");
const utilsUI = require("./js/utilsUI");
const circleJS = require("./js/circle");
const gridJS = require("./js/grid");
const waveJS = require("./js/wave");
const honeyJS = require("./js/honey");
const storageHelper = require('./lib/storage-helper');

let rootNode;

function create() {
    const HTML =
        `<style>
            .content-body {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 90px;
                overflow: scroll;
                // border: 1px solid red;
            }

            .content-body--hidden {
                display: none;
            }

            .content-footer {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 90px;
                overflow: none;
                border-top: 1px solid #999999;
                padding-left: 8px;
                padding-right: 8px;
                // background-color: #DDD;
            }

            .content-footer--hidden {
                display:none;
            }

            .bold {
                font-weight: strong;
            }

            .break {
                flex-wrap: wrap;
            }

            .hidden {
                display: none;
            }

            .fixed {
                position: fixed;
            }

            .ml-auto {
                margin-left: auto;
            }

            .ml-0 {
                margin-left: 0px;
            }

            .mr-0 {
                margin-right: 0px;
            }

            .ml-4 {
                margin-left: 4px;
            }

            .ml-6 {
                margin-left: 6px;
            }

            .ml-8 {
                margin-left: 8px;
            }

            .mr-8 {
                margin-right: 8px;
            }

            .mt-2 {
                margin-top: 2px;
            }

            .mt-4 {
                margin-top: 4px;
            }

            .mt-6 {
                margin-top: 6px;
            }

            .mt-8 {
                margin-top: 8px;
            }

            .pt-4 {
                padding-top: 4px;
            }

            .pt-8 {
                padding-top: 8px;
            }

            .pt-12 {
                padding-top: 12px;
            }

            .spacer-8 {
                min-width: 8px;
                width: 8px;
                max-width: 8px;
            }

            .b-red {
                border: 1px solid red;
            }

            .b-green {
                border: 1px solid green;
            }

            .justify-center {
              justify-content: center;
            }

            .justify-end {
              justify-content: flex-end;
            }

            .align-center {
              align-items: center;
            }



            .arr-row {
                display: flex;
                flex-direction: row;
                align-items: baseline;
                // margin-bottom: 10px;
                // border: 1px solid red;
            }

            .arr-row--buttonbar {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                //border: 1px solid red;
            }

            .arr-row--buttonbar-item {
                //display: flex;
                //justify-content: center;
                min-width: 28px;
                max-width: 28px;
                height: 28px;
                flex: 28px;
                margin-left: 0px;
                margin-right: 0px;
                //border: 1px solid green;
            }



            .arr-margin-bottom {
                margin-bottom: 10px;
            }

            .arr-divider {
                border-bottom: 2px solid #E4E4E4;
                margin-bottom: 12px;
                margin-top: 8px;
            }

            .arr-slider {
                min-width: 20px;
                flex: 1 1 auto;
                // border: 1px solid green;
            }

            .spread { justify-content: space-between; }

            .arr-tab-bar {
                // border: 1px solid blue;
                display: flex;
                justify-content: center;
            }

            .arr-tab-bar__item {
                min-width: 22px;
                max-width: 22px;
                //margin-right: 0px;
                flex: 1 1 22px;
            }

            .arr-tab-bar__item--windowsxxx {
                min-width: 32px;
                max-width: 50px;
                margin-right: 0px;
                flex: 1 1 32px;
                // border: 1px solid blue;
            }

            .arr-tab-bar2 {
                display: flex;
                margin: 0 auto;
                justify-content: center;
                align-items: center;
                border-bottom: 2px solid #E4E4E4;
                z-index: 0;
                // border: 1px solid blue;
            }

            .arr-tab-bar__item2--active {
                text-align: center;
                color: #666;
                font-size: 11px;
                padding-top: 6px;
                height: 34px;
                width: 60px;
                min-width: 10px;
                // border-bottom: 2px solid #666666;
                margin-bottom: -2px;
                border-bottom: 2px solid #3095EF;
                z-index: 1;
            }

            .arr-tab-bar__item2--active:hover {
                background-color: #EEE;
                margin-bottom: -2px;
            }

            .arr-tab-bar__item2--inactive:hover {
                background-color: #EEE;
                margin-bottom: -2px;
            }

            .arr-tab-bar__item2--inactive {
                text-align: center;
                padding-top: 6px;
                color: #666;
                font-size: 11px;
                height: 34px;
                width: 60px;
                min-width: 10px;
                border-bottom: 0px solid #666666;
                z-index: 1;
                margin-bottom: -2px;
            }

            
            .arr-tab-bar__icon--active {
                background: url('assets/icon-settingsv2-ative.png') center no-repeat;
                text-align: center;
                padding-top: 0px;
                color: #666;
                height: 30px;
                width: 100px;
                min-width: 10px;
                border-bottom: 0px solid #666666;
                z-index: 1;
            }

            .arr-tab-bar__icon--inactive {
                background: url('assets/icon-settingsv2.png') center no-repeat;
                text-align: center;
                padding-top: 0px;
                color: #666;
                height: 30px;
                width: 100px;
                min-width: 10px;
                border-bottom: 0px solid #666666;
                z-index: 1;
            }

            .arr-tab-bar__icon--inactive:hover {
                background: url('assets/icon-settingsv2-active.png') center no-repeat;
                text-align: center;
                padding-top: 0px;
                color: #666;
                height: 30px;
                width: 100px;
                min-width: 10px;
                border-bottom: 0px solid #666666;
                z-index: 1;
            }



            .arr-tab-bar__button__nav {
              text-shadow: none;
              box-shadow: none;
              color: #666;
              height: 34px;
              border-radius: 0;
              border: none;
              border-top: none;
              background-color: #666;
              vertical-align: middle; /* align the text vertically centered */
              /*padding-left: 20px;*/     /* make text start to the right of the image */
              cursor: pointer;        /* make the cursor like hovering over an <a> element */
              min-width: 80x;
            }

            

            .arr-settings-label {
                font-size: 10px;
                color: #666;
                text-decoration: none;
            }

            .arr-settings-label:hover {
                font-size: 10px;
                text-decoration: underline;
                cursor: pointer;
            }

            .arr-settings-row {
                display: flex;
                margin-left: 0px;
                padding-left: 0px;
                background-color: none;
                cursor: default;
            }

            .arr-settings-row:hover {
                //background-color: #CCC;
                cursor: pointer;
            }

            .arr-settings__icon--active {
                background: url('assets/icon-settingsv2-ative.png') center no-repeat;
                text-align: center;
                padding-top: 0px;
                color: #666;
                height: 30px;
                width: 30px;
                min-width: 19px;
                border-bottom: 0px solid #666666;
                z-index: 1;
                border: 1px solid red;
            }

            .arr-feedback__title {
                text-align: center;
                // padding-top: 4px;
                //color: #008FF3;
                font-size: 12px;
                font-weight: bold;
            }

            .arr-feedback__copy {
                text-align: center;
                // padding-top: 4px;
                color: #666;
                font-size: 11px;
            }

            .arr-label--title {
                color: #444;
                font-size: 10px;
            }

            .arr-label {
                color: #666;
                // color: #FF00FF;
                font-size: 11px;
            }

            .arr-input {
                max-width: 46px;
                // flex: 1 1 auto;
            }

            .arr-flex--right {
                margin-left: auto;
                // border: 1px solid blue;
            }

            .arr-column {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .arr-onboarding {
                display: block;
                // flex-direction: column;
                // align-items: center;
            }

            .arr-onboarding--hidden {
                display: none;
            }

            .arr-onboarding__screen {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .arr-onboarding__screen--hidden {
                display: none;
            }
            
            label.row > span {
                // color: #8E8E8E;
                // color: #FF0000;
                // width: 20px;
                text-align: right;
                font-size: 14px;
            }
            label.row input {
                // flex: 1 1 44px;
            }
            form {
                width:90%;
                margin: -20px;
                padding: 0px;
            }

            .switch {
              position: relative;
              display: inline-block;
              width: 60px;
              height: 34px;
            }

            .switch input { 
              opacity: 0;
              width: 0;
              height: 0;
            }

            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #ccc;
            }

            .slider:before {
              position: absolute;
              content: "";
              height: 26px;
              width: 26px;
              left: 4px;
              bottom: 4px;
              background-color: white;
            }

            input:checked + .slider {
              background-color: #2196F3;
            }

            input:focus + .slider {
              box-shadow: 0 0 1px #2196F3;
            }

            input:checked + .slider:before {
              -webkit-transform: translateX(26px);
              -ms-transform: translateX(26px);
              transform: translateX(26px);
            }

            /* Rounded sliders */
            .slider.round {
              border-radius: 34px;
            }

            .slider.round:before {
              border-radius: 50%;
            }

            .arr-button {
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #DADADA;
                border-radius:4px;
                width:28px;
                height:28px;
                padding:7px;
                background-color: none;
            }

            .arr-button:hover {
                border: 1px solid #CACACA;
                background-color: #FFF;
            }

            .arr-button.selected {
                border: 1px solid #CACACA;
                background-color: #DDD;
            }

            .arr-button.disabled {
                border: 0px solid #CACACA;
                background-color: #E4E4E4;
            }
        </style>




        <div id="onboarding" class="arr-onboarding">

            
            <div style="display: flex;">
                <div id="onboardingBtnClose" class="arr-button ml-auto">
                    <img src="assets/icon-close-small.png" />
                </div>
            </div>

            <br>
            <div class="arr-column">
                <p class="arr-feedback__title">Quick Intro in 3 Steps</p>
            </div>

            <div id="contentOnboarding1" class="arr-onboarding__screen">
                <p style="color:#999;">Step 1</p>
                <p style="text-align:center;">Select some objects or a group with objects.</p>
                <img src="assets/screen1.png" />
            </div>

            <div id="contentOnboarding2" class="arr-onboarding__screen--hidden">
                <p style="color:#999;">Step 2</p>
                <p style="text-align:center;">Press "Arrange" to align them into circle, grid, wave or a honeycomb pattern.</p>
                <img src="assets/screen2.png" />
            </div>

            <div id="contentOnboarding3" class="arr-onboarding__screen--hidden">
                <p style="color:#999;">Step 3</p>
                <p style="text-align:center;">Use the playground file below for a quick start.</p>
                <img src="assets/screen3.png" />
            </div>

            <div class="arr-column">
                <div class="arr-row">
                    <div id="onboardingBtnPrev" class="arr-button">
                        <img src="assets/icon-prev-small.png" />
                    </div>
                    
                    <div id="onboardingBtnNext" class="arr-button ml-8">
                        <img src="assets/icon-next-small.png" />
                    </div>
                </div>
            </div>

            <br>

            <hr>

            <div class="arr-settings-row mt-8" style="justify-content:center;">
                <img class="del-button ml-2" src="assets/icon-doc-download.png" />
                <a class="arr-settings-label ml-4" style="color:#666;" href="http://www.arranger.io/download-playground-file/">Get playground file</a>
            </div>

            <hr>

            <div class="arr-settings-row mt-8" style="justify-content:center;">
                <img class="del-button ml-2" src="assets/icon-manual.png" />
                <a class="arr-settings-label ml-4" style="color:#666;" href="http://www.arranger.io/docs-xd/">Read online manual</a>
            </div>

            <hr>
            <br>

            <div class="arr-column">
                <div class="arr-row">
                    <button id="onboardingBtnStart" uxp-quiet="false" uxp-variant="cta">Start</button>
                    <button id="onboardingBtnReset" class="hidden" uxp-quiet="true" uxp-variant="action">Reset Flag</button>
                </div>
            </div>

            <br>

            <div class="arr-column">
                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="onboardingCbShowFlag"/>
                        Always show at start
                    </label>
                </div>
            </div>
        </div>


        <div id="content" class="content-body--hidden">

            <div id="header" class="arr-row hidden">
                <div id="logo" class="hidden"><img src="assets/logo-arranger2.png" /></div>
                <button id="btnSettings"
                            class="arr-flex--right hidden"
                            title="Settings"
                            uxp-variant="action"
                            uxp-quiet="true">
                        <img src="assets/icon-settings.png" /></button>
            </div>

            <div class="arr-tab-bar2" style="display:none;">
                <div id="btnTabCirclexxx" class="arr-tab-bar__item2--active">Circle</div>
                <div id="btnTabGridxxx" class="arr-tab-bar__item2--inactive">Grid</div>
                <div id="btnTabWavexxx" class="arr-tab-bar__item2--inactive">Wave</div>
                <div id="btnTabHoneyxxx" class="arr-tab-bar__item2--inactive">H'Comb</div>
            </div>

            <div class="arr-tab-bar2">
                <div id="btnTabCircle" class="arr-tab-bar__item2--active" title="Circle Layout">
                    <img src="assets/icon-tab-circle.svg" />
                </div>
                <div id="btnTabGrid" class="arr-tab-bar__item2--inactive" title="Grid Layout">
                    <img src="assets/icon-tab-grid.svg" />
                </div>
                <div id="btnTabWave" class="arr-tab-bar__item2--inactive" title="Wave Layout">
                    <img src="assets/icon-tab-wave.svg" />
                </div>
                <div id="btnTabHoney" class="arr-tab-bar__item2--inactive" title="Honeycomb Layout">
                    <img src="assets/icon-tab-honey.svg" />
                </div>
            </div>

            <br />

            <div id="contentCircle">
                <label>SIZE</label>

                <div class="arr-row break">
                    <label class="row">
                        <div class="arr-label">w</div>
                        <input id="circleTxtSizeW"
                                class="arr-input"
                                type="number"
                                uxp-quiet="true"
                                value="100"
                                placeholder="Width" />
                    </label>

                    <label class="row">
                        <div class="arr-label">h</div>
                        <input id="circleTxtSizeH"
                                class="arr-input"
                                type="number"
                                uxp-quiet="true"
                                value="100"
                                placeholder="Height" />
                    </label>
                </div>

                <div class="arr-divider"></div>

                <div class="hidden">
                    <label>CENTER</label>

                    <div class="arr-row break">
                        <label class="row">
                            <div class="arr-label">x</div>
                            <input id="circleTxtPosX"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value="100"
                                    placeholder="Width" />
                        </label>
                        <label class="row">
                            <div class="arr-label">y</div>
                            <input id="circleTxtPosY"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value="100"
                                    placeholder="Height" />
                        </label>
                    </div>
                </div>
                
                <label>DIRECTION</label>

                <div class="arr-row pt-8">
                    <div class="arr-row--buttonbar">
                        <div id="circleBtnCCW"
                                class="arr-button ml-0"
                                title="Counterclockwise">
                            <img src="assets/icon-ccw-small.png" />
                        </div>
                        <div id="circleBtnCW"
                                class="arr-button ml-8 selected"
                                title="Clockwise">
                            <img src="assets/icon-cw-small.png" />
                        </div>
                    </div>
                </div>

                <div class="arr-divider"></div>

                <label>ANGLES</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Start</div>
                    </label>
                    <input id="circleStartAngle"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            min=0
                            placeholder="Start" />
                    <input id="circleStartSlider"
                            class="arr-slider"
                            type="range"
                            min=0
                            max=360
                            value=0 />
                </div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="circleCbEndAngle"/>
                    </label>
                    <div class="arr-label" disabled="disabled">End</div>
                    <input id="circleEndAngle"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=270
                            min=0
                            placeholder="End"
                            disabled="disabled" />
                    <input id="circleEndSlider"
                            class="arr-slider"
                            type="range"
                            min=0
                            max=360
                            value=270
                            disabled="disabled"/>
                </div>

                <div id="adjustLastItemRow" class="hidden">
                    <div class="arr-row">
                        <label>
                            <input class="ml-0" type="checkbox" id="circleCbAdjustLastItem" disabled="disabled">Adjust last object</input>
                        </label>
                        <div id="circleBtnHelpAdjust" class="arr-flex--right" title="Help">
                            <img src="assets/icon-help-small.svg" />
                        </div>
                    </div>
                </div>

                <div class="arr-divider"></div>

                <label>ORIENTATION</label>

                <div class="arr-row--buttonbar pt-8">
                    <div id="circleBtnOrientation0"
                            class="arr-button ml-0 selected"
                            title="Off">
                        <img src="assets/icon-no-small.png" />
                    </div>
                    <div id="circleBtnOrientation1"
                            class="arr-button ml-6"
                            title="Up">
                        <img src="assets/icon-up-small.png" />
                    </div>
                    <div id="circleBtnOrientation2"
                            class="arr-button ml-6"
                            title="Down">
                        <img src="assets/icon-down-small.png" />
                    </div>
                    <div id="circleBtnOrientation3"
                            class="arr-button ml-6"
                            title="Left">
                        <img src="assets/icon-left-small.png" />
                    </div>
                    <div id="circleBtnOrientation4"
                            class="arr-button ml-6"
                            title="Right">
                        <img src="assets/icon-right-small.png" />
                    </div>
                </div>

                <div class="arr-divider"></div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="circleCbRandomOrder"/>
                        <div class="arr-label">Random Order</div>
                    </label>
                </div>

                <div class="arr-divider"></div>

                <footer>
                    <button id="circleBtnAction"
                                type="submit"
                                uxp-variant="cta">Arrange</button>
                </footer>
            </div>


            <div id="contentGrid" class="hidden">
                
                <label>COLUMNS</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Columns</div>
                    </label>
                    <input id="gridTxtCols"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=3
                            min=1
                            placeholder="Cols" />
                </div>

                <div class="arr-divider"></div>

                <label>SPACING</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">w</div>
                    </label>
                    <input id="gridTxtGutterW"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            placeholder="W" />

                    <label class="row">
                        <div class="arr-label">h</div>
                    </label>
                    <input id="gridTxtGutterH"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            placeholder="H" />
                </div>

                <div class="hidden">
                    <div class="arr-divider"></div>

                    <div class="row arr-label--title">
                        <span>POSITION</span>
                    </div>

                    <div class="arr-row break">
                        <label class="row">
                            <input class="ml-0" type="checkbox" id="gridCbStartPos"/>
                        </label>

                        <div class="arr-divider"></div>

                        <div class="arr-row">
                            <label class="row">
                                <div class="arr-label">X</div>
                            </label>
                            <input id="gridTxtPositionX"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value=0
                                    placeholder="X"
                                    disabled="disabled" />
                        </div>

                        <div class="arr-row">
                            <label class="row">
                                <div class="arr-label">Y</div>
                            </label>
                            <input id="gridTxtPositionY"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value=0
                                    placeholder="Y"
                                    disabled="disabled" />
                        </div>

                    </div>
                </div>

                <div class="arr-divider"></div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="gridCbRandomOrder"/>
                        <div class="arr-label">Random Order</div>
                    </label>
                </div>

                <div class="arr-divider"></div>

                <footer><button id="gridBtnAction" type="submit" uxp-variant="cta">Arrange</button></footer>



                <form method="dialog" id="gridForm">
                    <div class="row break">
                    </div>
                </form>
            </div>

            <div id="contentWave" class="hidden">
                <label>WAVE SIZE</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Length</div>
                    </label>
                    <input id="waveTxtPeriod"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=200
                            placeholder="Per" />
                </div>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Height</div>
                    </label>
                    <input id="waveTxtAmplitude"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=50
                            placeholder="Amp" />
                </div>
                
                <div class="arr-divider"></div>

                <label>WAVE OBJECTS</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Step</div>
                    </label>
                    <input id="waveTxtDistance"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=50
                            placeholder="Dist" />
                </div>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Start Angle</div>
                    </label>
                    <input id="waveTxtStartAngle"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            placeholder="Start" />
                </div>
                
                <div class="hidden">
                    <div class="arr-divider"></div>

                    <div class="row arr-label--title">
                        <span>POSITION</span>
                    </div>

                    <div class="arr-row break">
                        <label class="row">
                            <input class="ml-0" type="checkbox" id="waveCbStartPos"/>
                        </label>

                        <div class="arr-row">
                            <label class="row">
                                <div class="arr-label">X</div>
                            </label>
                            <input id="waveTxtPositionX"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value=0
                                    placeholder="X"
                                    disabled="disabled"/>
                        </div>

                        <div class="arr-row">
                            <label class="row">
                                <div class="arr-label">Y</div>
                            </label>
                            <input id="waveTxtPositionY"
                                    class="arr-input"
                                    type="number"
                                    uxp-quiet="true"
                                    value=0
                                    placeholder="Y"
                                    disabled="disabled"/>
                        </div>
                    </div>
                </div>

                <div class="arr-divider"></div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="waveCbRandomOrder"/>
                        <div class="arr-label">Random Order</div>
                    </label>
                </div>

                <div class="arr-divider"></div>

                <footer><button id="waveBtnAction" type="submit" uxp-variant="cta">Arrange</button></footer>


                <form method="dialog" id="waveForm">
                    <div class="row break">
                    </div>
                </form>
            </div>

            <div id="contentHoney" class="hidden">
                <label>COLUMNS</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">Columns</div>
                    </label>
                    <input id="honeyTxtCols"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=3
                            min=2
                            placeholder="Cols" />
                </div>

                <div class="arr-divider"></div>

                <label>OFFSET</label>

                <div class="arr-row break">
                    <div class="arr-label ml-8">x</div>
                        <input id="honeyTxtOffsetX"
                                disabled="disabled"
                                class="arr-input"
                                type="number"
                                uxp-quiet="true"
                                value="0" />

                    <label class="row">
                        <input checked class="ml-0" type="checkbox" id="honeyCbOffsetX"/>
                        <label class="arr-label">Auto</label>
                    </label>
                        
                </div>

                <div class="arr-row break">

                    <label class="row">
                        <div class="arr-label ml-8">y</div>
                        <input id="honeyTxtOffsetY"
                                disabled="disabled"
                                class="arr-input"
                                type="number"
                                uxp-quiet="true"
                                value="0" />
                    </label>

                    <label class="row">
                        <input checked class="ml-0" type="checkbox" id="honeyCbOffsetY"/>
                        <label class="arr-label">Auto</label>
                    </label>

                </div>


                <div class="arr-divider"></div>

                <label>LAYOUT</label>

                <div class="arr-row">
                    <label class="arr-label mr-8">Pattern</label>
                    <div class="arr-row--buttonbar">
                        <div id="honeyBtnPattern1"
                                class="arr-button ml-0 selected"
                                title="symmetric">
                            <img src="assets/icon-honey-pattern-1.png" />
                        </div>
                        <div id="honeyBtnPattern2"
                                class="arr-button ml-8"
                                title="asymmetric">
                            <img src="assets/icon-honey-pattern-2.png" />
                        </div>
                    </div>
                </div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="honeyCbAlternateRows"/>
                        <div class="arr-label">Alternate Rows</div>
                    </label>
                </div>



                <div class="arr-divider"></div>

                <label>SPACING</label>

                <div class="arr-row">
                    <label class="row">
                        <div class="arr-label">w</div>
                    </label>
                    <input id="honeyTxtGutterW"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            placeholder="W" />

                    <label class="row">
                        <div class="arr-label">h</div>
                    </label>
                    <input id="honeyTxtGutterH"
                            class="arr-input"
                            type="number"
                            uxp-quiet="true"
                            value=0
                            placeholder="H" />
                </div>

                <div class="arr-divider"></div>

                <div class="arr-row">
                    <label class="row">
                        <input class="ml-0" type="checkbox" id="honeyCbRandomOrder"/>
                        <div class="arr-label">Random Order</div>
                    </label>
                </div>

                <div class="arr-divider"></div>

                <footer><button id="honeyBtnAction" type="submit" uxp-variant="cta">Arrange</button></footer>
            </div




            <br/>
            <br/>


            <p id="infobadge" class="arr-feedback__title"></p>
            <p id="infobadge2" class="arr-feedback__copy"></p>
            <br />
        </div>

        <div id="contentFooter" class="content-footer ml-0">
            <div id="btnTabHelp" class="arr-settings-row align-center ml-0 mt-8">
                <img class="del-button ml-0" src="assets/icon-info-outline.png" />
                <span class="arr-settings-label ml-4" style="color:#666;">Quick intro</span>
            </div>

            <div class="arr-settings-row mt-8">
                <img class="del-button ml-2" src="assets/icon-manual.png" />
                <a class="arr-settings-label ml-4" style="color:#666;" href="http://www.arranger.io/docs-xd/">Online Manual</a>
            </div>

            <div class="arr-settings-row align-center mt-8">
                <img class="del-button ml-2" src="assets/icon-doc-download.png" />
                <a class="arr-settings-label ml-4" style="color:#666;" href="http://www.arranger.io/download-playground-file/">Playground file</a>
            </div>
        </div>

        `


        const backup = `
            <div class="arr-settings-rowxxx mt-8">
                <label>v 1.3.0</label>
            </div><hr>
            // <h2 class="bold">Did you know?</h2>
            // <p>Arranger is also available for Adobe Illustrator and Adobe InDesign: <a href="https://exchange.adobe.com/creativecloud.details.100201.arranger.html">Get it here</a></p>`




    function execCircle () {
        // console.log("execCircle fired");
        const sizeW = Number(document.querySelector("#circleTxtSizeW").value);
        const sizeH = Number(document.querySelector("#circleTxtSizeH").value);
        const xPos = Number(document.querySelector("#circleTxtPosX").value);
        const yPos = Number(document.querySelector("#circleTxtPosY").value);
        const direction = getDirectionCircle();
        const startAngle = Number(document.querySelector("#circleStartAngle").value);
        const endAngleActivated = Boolean(document.querySelector("#circleCbEndAngle").checked);
        const endAngle = Number(document.querySelector("#circleEndAngle").value);
        const adjustLastItemActivated = Boolean(document.querySelector("#circleCbAdjustLastItem").checked);
        const orientation = getOrientationCircle();
        const randomOrder = Boolean(document.querySelector("#circleCbRandomOrder").checked);

        const { editDocument } = require("application");
        editDocument({ editLabel: "Arrange as circle" }, function (selection) {
            if (selection.items.length <= 0) return;

            // const selectedRectangle = selection.items[0];
            //
            let params = {};
            params.selection = selection;
            params.sizeW = sizeW;
            params.sizeH = sizeH;
            params.x = xPos;
            params.y = yPos;
            params.direction = direction;
            params.startAngle = startAngle;
            params.endAngle = endAngle;
            params.endAngleActivated = endAngleActivated;
            params.adjustLastItemActivated = adjustLastItemActivated;
            params.orientation = orientation;
            params.randomOrderActivated = randomOrder;
            
            circleJS.layoutCircle(params);
        })
    }

    function execGrid() {
        // console.log('>>> exeGrid');
        const { editDocument } = require("application");
        const cols = Number(document.querySelector("#gridTxtCols").value);
        const width = Number(document.querySelector("#gridTxtGutterW").value);
        const height = Number(document.querySelector("#gridTxtGutterH").value);
        const startPosGrid = Boolean(document.querySelector("#gridCbStartPos").checked);
        const xPos = Number(document.querySelector("#gridTxtPositionX").value);
        const yPos = Number(document.querySelector("#gridTxtPositionY").value);
        const randomOrder = Boolean(document.querySelector("#gridCbRandomOrder").checked);

        editDocument({ editLabel: "Arrange as grid" }, function (selection) {
            if (selection.items.length <= 0) return;

            // const selectedRectangle = selection.items[0];
            //
            let params = {};
            params.selection = selection;
            
            const minVal = 1;
            if (isNaN(cols) || cols < minVal) {
                params.cols = minVal;
                document.querySelector("#gridTxtCols").value = minVal;
            } else {
                params.cols = cols;
            }

            params.gutterW = width;
            params.gutterH = height;
            params.positionActivated = startPosGrid;
            params.x = xPos;
            params.y = yPos;
            params.randomOrderActivated = randomOrder;
            gridJS.layoutGrid(params);



            // let finalPos = {x:0, y:0};
            // let sel = selection;
            // let selItems = sel.items;
            // let selLen = selItems.length;
            // for (var i=0; i<selLen; i++) {
            //     //------------
            //     // current item
            //     //------------
            //     var item = selItems[i];
            //     let nodeCenterPoint = item.localCenterPoint;
            //     finalPos.x = 50 * i;
            //     finalPos.y = 100;
            //     console.log('==== finalPos:', finalPos);

            //     item.placeInParentCoordinates(nodeCenterPoint, finalPos);
            // }

        })
    }

    function execHoney() {
        const cols = Number(document.querySelector("#honeyTxtCols").value);
        const width = Number(document.querySelector("#honeyTxtGutterW").value);
        const height = Number(document.querySelector("#honeyTxtGutterH").value);
        const randomOrder = Boolean(document.querySelector("#honeyCbRandomOrder").checked);
        // const honeycombActivated = Boolean(document.querySelector("#honeyCbHCActivated").checked);

        // If auto is checked
        // const offsetX = getOffsetXHoney();

        const offsetX = Number(document.querySelector("#honeyTxtOffsetX").value);
        const offsetY = Number(document.querySelector("#honeyTxtOffsetY").value);

        //rootNode.querySelector('#honeyCbOffsetY').addEventListener("click", execHoney);

        //const offsetX = Number(document.querySelector("#honeyTxtOffsetX").value);
        //const offsetY = Number(document.querySelector("#honeyTxtOffsetY").value);
        // const asymmLayout = Boolean(document.querySelector("#honeyCbAsymmetrcialLayout").checked);
        
        const asymmLayout = getPatternHoney();
        const alternateRows = Boolean(document.querySelector("#honeyCbAlternateRows").checked);
        
        const { editDocument } = require("application");
        editDocument({ editLabel: "Arrange as honeycomb" }, function (selection) {

            if (selection.items.length <= 0) return;

            // const selectedRectangle = selection.items[0];
            //
            let params = {};
            params.selection = selection;
            
            const minVal = 2;
            if (isNaN(cols) || cols < minVal) {
                params.cols = minVal;
                document.querySelector("#honeyTxtCols").value = minVal;
            } else {
                params.cols = cols;
            }

            params.gutterW = width;
            params.gutterH = height;
            params.randomOrderActivated = randomOrder;
            params.offsetX = offsetX;
            params.offsetY = offsetY;
            params.alternateRows = alternateRows;
            params.asymmetricalLayout = asymmLayout;

            honeyJS.layoutHoney(params);
        
        })
    }

    function execWave () {
        const { editDocument } = require("application");
        //
        const period = Number(document.querySelector("#waveTxtPeriod").value);
        const amplitude = Number(document.querySelector("#waveTxtAmplitude").value);
        //
        const distance = Number(document.querySelector("#waveTxtDistance").value);
        const startAngle = Number(document.querySelector("#waveTxtStartAngle").value);
        //
        const startPosWave = Boolean(document.querySelector("#waveCbStartPos").checked);
        const xPos = Number(document.querySelector("#waveTxtPositionX").value);
        const yPos = Number(document.querySelector("#waveTxtPositionY").value);
        //
        const randomOrder = Boolean(document.querySelector("#waveCbRandomOrder").checked);

        editDocument({ editLabel: "Arrange as wave" }, function (selection) {
            if (selection.items.length <= 0) return;
            // const selectedRectangle = selection.items[0];
            //
            let params = {};
            params.selection = selection;
            params.period = period;
            params.amplitude = amplitude;
            params.distance = distance;
            params.startAngle = startAngle;
            params.positionActivated = startPosWave;
            params.x = xPos;
            params.y = yPos;
            params.randomOrderActivated = randomOrder;

            waveJS.layoutWave(params);
        })
    }
    // --------
    // ONBOARDING
    // --------
    async function toggleOnboardingFlag () {
        // console.log('--- toggleOnboardingFlag fired');
        const showFlagChecked = Boolean(document.querySelector("#onboardingCbShowFlag").checked);

        if (showFlagChecked === true) var flagValue = "yes";
        else if (showFlagChecked === false) var flagValue = "no";

        storageHelper.set('showOnboarding', flagValue).then(() => { // Save value when form gets submitted
            // dialog.close(myInput.value); // And then close the dialog
            // console.log("StorageHelper: data saved");
        });
    }

    async function checkOnboardingFlag () {
        // console.log('--- checkOnboardingFlag');

        const onboardingFlag = await storageHelper.get('showOnboarding', 'yes');

        if (onboardingFlag === "yes") {
            showOnboarding(true, "onboarding");
            // Set checkbox to right state
            rootNode.querySelector('#onboardingCbShowFlag').setAttribute("checked", "checked");
        } else if (onboardingFlag === "no") {
            showOnboarding(false, "onboarding");
            rootNode.querySelector('#onboardingCbShowFlag').removeAttribute("checked", "checked");
        }
    }

    // Params: mode: "onboarding" or "settings"
    function showOnboarding (show, mode) {
        // console.log('--- showOnboarding fired: show: ', show);
        let contentOnboarding = document.querySelector("#onboarding");
        let contentTool = document.querySelector("#content");
        let contentFooter = document.querySelector("#contentFooter");

        if (show === true) {
            // console.log('=> show');
            contentOnboarding.setAttribute('class', "arr-onboarding");
            contentTool.setAttribute('class', "content-body--hidden");
            contentFooter.setAttribute('class', "content-footer--hidden");
            //
            initOnboardingView(mode);
        } else {
            // console.log('=> dont show');
            contentOnboarding.setAttribute('class', "arr-onboarding--hidden");
            contentTool.setAttribute('class', "content-body");
            contentFooter.setAttribute('class', "content-footer");
        }
    }

    // Params: mode: "onboarding" or "settings"
    function initOnboardingView (mode) {
        // console.log('---- initOnboardingView fired');
        let btnClose = document.querySelector("#onboardingBtnClose");
        let screen1 = document.querySelector("#contentOnboarding1");
        let screen2 = document.querySelector("#contentOnboarding2");
        let screen3 = document.querySelector("#contentOnboarding3");
        let btnPrev = document.querySelector("#onboardingBtnPrev");
        let btnNext = document.querySelector("#onboardingBtnNext");
        let btnStart = document.querySelector("#onboardingBtnStart");

        if (mode === "onboarding") {
            btnClose.setAttribute("visibility", "hidden");
            btnStart.setAttribute("visibility", "visible");
        } else {
            btnClose.setAttribute("visibility", "visible");
            btnStart.setAttribute("visibility", "hidden");
        }

        screen1.setAttribute("class", "arr-onboarding__screen");
        screen2.setAttribute("class", "arr-onboarding__screen--hidden");
        screen3.setAttribute("class", "arr-onboarding__screen--hidden");

        // btnPrev.setAttribute("disabled", "disabled");
        // btnNext.removeAttribute("disabled", "disabled");
        setStatePrevButton("off");
        setStateNextButton("on");
    }

    function showOnboardingScreenPrev () {
        // console.log("--> prev fired")
        let screen1 = document.querySelector("#contentOnboarding1");
        let screen2 = document.querySelector("#contentOnboarding2");
        let screen3 = document.querySelector("#contentOnboarding3");
        let btnPrev = document.querySelector("#onboardingBtnPrev");
        let btnNext = document.querySelector("#onboardingBtnNext");

        if (screen2.getAttribute('class') === 'arr-onboarding__screen') {
            screen1.setAttribute('class', "arr-onboarding__screen");
            screen2.setAttribute('class', "arr-onboarding__screen--hidden");
            screen3.setAttribute('class', "arr-onboarding__screen--hidden");
            //
            // btnPrev.setAttribute("disabled", "disabled");
            setStatePrevButton("off")
        }
        else if (screen3.getAttribute('class') === 'arr-onboarding__screen') {
            screen1.setAttribute('class', "arr-onboarding__screen--hidden");
            screen2.setAttribute('class', "arr-onboarding__screen");
            screen3.setAttribute('class', "arr-onboarding__screen--hidden");

            // btnNext.removeAttribute("disabled", "disabled");
            setStateNextButton("on");
        }
    }


    function showOnboardingScreenNext () {
        // console.log("--> next fired")
        let screen1 = document.querySelector("#contentOnboarding1");
        let screen2 = document.querySelector("#contentOnboarding2");
        let screen3 = document.querySelector("#contentOnboarding3");
        let btnPrev = document.querySelector("#onboardingBtnPrev");
        let btnNext = document.querySelector("#onboardingBtnNext");

        if (screen1.getAttribute('class') === 'arr-onboarding__screen') {
            screen1.setAttribute('class', "arr-onboarding__screen--hidden");
            screen2.setAttribute('class', "arr-onboarding__screen");
            screen3.setAttribute('class', "arr-onboarding__screen--hidden");
            //
            //btnPrev.removeAttribute("disabled", "disabled");
            setStatePrevButton("on");
        }
        else if (screen2.getAttribute('class') === 'arr-onboarding__screen') {
            screen1.setAttribute('class', "arr-onboarding__screen--hidden");
            screen2.setAttribute('class', "arr-onboarding__screen--hidden");
            screen3.setAttribute('class', "arr-onboarding__screen");

            //btnNext.setAttribute("disabled", "disabled");
            setStateNextButton("off");
        }
    }

    function setStatePrevButton (state) {
        let btnPrev = document.querySelector("#onboardingBtnPrev");
        if (state === "on") {
            btnPrev.classList.remove("disabled");
        } else {
            btnPrev.classList.add("disabled");
        }
    }

    function setStateNextButton (state) {
        let btnNext = document.querySelector("#onboardingBtnNext");
        if (state === "on") {
            btnNext.classList.remove("disabled");
        } else {
            btnNext.classList.add("disabled");
        }
    }


    async function resetOnboarding () {
        console.log('---- resetOnboarding fired');
        storageHelper.delete("showOnboarding");
    }
    // --------
    // TABS
    // --------
    function showContentCircle () {
        let contentCircle = document.querySelector("#contentCircle");
        let contentGrid = document.querySelector("#contentGrid");
        let contentWave = document.querySelector("#contentWave");
        let contentHoney = document.querySelector("#contentHoney");

        contentCircle.style.display = 'block'; // show
        contentGrid.style.display = 'none'; // hide
        contentWave.style.display = 'none'; // hide
        contentHoney.style.display = 'none'; // hide

        // Styles
        setActiveTab(0);
    }

    function showContentGrid () {
        let contentCircle = document.querySelector("#contentCircle");
        let contentGrid = document.querySelector("#contentGrid");
        let contentWave = document.querySelector("#contentWave");
        let contentHoney = document.querySelector("#contentHoney");

        contentCircle.style.display = 'none'; // show
        contentGrid.style.display = 'block'; // hide
        contentWave.style.display = 'none'; // hide
        contentHoney.style.display = 'none'; // hide

        // Styles
        setActiveTab(1);
    }

    function showContentWave () {
        let contentCircle = document.querySelector("#contentCircle");
        let contentGrid = document.querySelector("#contentGrid");
        let contentWave = document.querySelector("#contentWave");
        let contentHoney = document.querySelector("#contentHoney");

        contentCircle.style.display = 'none'; // show
        contentGrid.style.display = 'none'; // hide
        contentWave.style.display = 'block'; // hide
        contentHoney.style.display = 'none'; // hide

        // Styles
        setActiveTab(2);
    }

    function showContentHoney () {
        let contentCircle = document.querySelector("#contentCircle");
        let contentGrid = document.querySelector("#contentGrid");
        let contentWave = document.querySelector("#contentWave");
        let contentHoney = document.querySelector("#contentHoney");

        contentCircle.style.display = 'none'; // show
        contentGrid.style.display = 'none'; // hide
        contentWave.style.display = 'none'; // hide
        contentHoney.style.display = 'block'; // hide

        // Styles
        setActiveTab(3);
    }

    function setActiveTab (tabIndex) {
        let tab0 = document.querySelector("#btnTabCircle");
        let tab1 = document.querySelector("#btnTabGrid");
        let tab2 = document.querySelector("#btnTabWave");
        let tab3 = document.querySelector("#btnTabHoney");

        if (tabIndex === 0) {
            tab0.setAttribute('class', "arr-tab-bar__item2--active");
            tab1.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab2.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab3.setAttribute('class', "arr-tab-bar__item2--inactive");
        } else if (tabIndex === 1) {
            tab0.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab1.setAttribute('class', "arr-tab-bar__item2--active");
            tab2.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab3.setAttribute('class', "arr-tab-bar__item2--inactive");
        } else if (tabIndex === 2) {
            tab0.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab1.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab2.setAttribute('class', "arr-tab-bar__item2--active");
            tab3.setAttribute('class', "arr-tab-bar__item2--inactive");
        } else if (tabIndex === 3) {
            tab0.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab1.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab2.setAttribute('class', "arr-tab-bar__item2--inactive");
            tab3.setAttribute('class', "arr-tab-bar__item2--active");;
        };
    }
    // --------
    // CIRCLE
    // --------
    // Textinput Start Angle
    function changedStartAngleTextCircle () {
        let val = Number(document.querySelector("#circleStartAngle").value);
        document.querySelector("#circleStartSlider").value = val;
        execCircle();
    }

    // Textinput End Angle
    function changedEndAngleTextCircle () {
        let val = Number(document.querySelector("#circleEndAngle").value);
        document.querySelector("#circleEndSlider").value = val;
        execCircle();
    }

    // Slider events
    function changedStartAngleSliderCircle () {
        let val = Math.round(document.querySelector("#circleStartSlider").value);
        document.querySelector("#circleStartAngle").value = Number(val);
        execCircle();
    }

    function changedEndAngleSliderCircle () {
        let val = Math.round(document.querySelector("#circleEndSlider").value);
        document.querySelector("#circleEndAngle").value = Number(val);
        execCircle();
    }

    // Activate End Angle and children
    function toggleEndAngleCircle () {
        const endAngleChecked = Boolean(document.querySelector("#circleCbEndAngle").checked);

        if (endAngleChecked === true) {
            document.querySelector("#circleEndAngle").removeAttribute("disabled");
            document.querySelector("#adjustLastItemRow").style.display = 'block'; // hide
            document.querySelector("#circleCbAdjustLastItem").removeAttribute("disabled");
            document.querySelector("#circleEndSlider").removeAttribute("disabled");
        } else if (endAngleChecked === false) {
            document.querySelector("#circleEndAngle").setAttribute("disabled", "disabled");
            document.querySelector("#adjustLastItemRow").style.display = 'none'; // hide
            document.querySelector("#circleCbAdjustLastItem").setAttribute("disabled", "disabled");
            document.querySelector("#circleEndSlider").setAttribute("disabled", "disabled");
        }
        execCircle();
    }

    // Direction
    function getDirectionCircle () {
        //let v = document.querySelector("#circleBtnCCW").getAttribute('uxp-selected');
        let v = document.querySelector("#circleBtnCCW").classList.contains('selected');
        // false ==> CW
        // true ==> CCW
        if (v === false) {
            return false;
        } else if (v === true) {
            return true;
        }
    }

    function setDirectionCWCircle () {
        // document.querySelector("#circleBtnCW").setAttribute('uxp-selected', "true");
        // document.querySelector("#circleBtnCCW").setAttribute('uxp-selected', "false");

        document.querySelector("#circleBtnCW").classList.add('selected');
        document.querySelector("#circleBtnCCW").classList.remove('selected');

        execCircle();
    }

    function setDirectionCCWCircle () {
        // document.querySelector("#circleBtnCW").setAttribute('uxp-selected', "false");
        // document.querySelector("#circleBtnCCW").setAttribute('uxp-selected', "true");

        document.querySelector("#circleBtnCW").classList.remove('selected');
        document.querySelector("#circleBtnCCW").classList.add('selected');

        execCircle();
    }

    // Orientation
    function getOrientationCircle () {
        const ids = ["circleBtnOrientation0","circleBtnOrientation1",
            "circleBtnOrientation2","circleBtnOrientation3","circleBtnOrientation4"];

        for (let i=0; i<ids.length; i++) {
            let item = "#" + ids[i];
            let val = document.querySelector(item).classList.contains('selected');
            if (val === true) return i;
        }
        return 0;
    }

    function setOrientationCircle (index) {
        const ids = ["circleBtnOrientation0","circleBtnOrientation1",
            "circleBtnOrientation2","circleBtnOrientation3","circleBtnOrientation4"];

        for (let i=0; i<ids.length; i++) {
            let item = "#" + ids[i];
            // console.log("item: ", item);
            // let val = document.querySelector(item).getAttribute('uxp-selected');
            let val = document.querySelector(item).classList.contains('selected');
            // console.log("val: ", val);

            if (i !== index) {
                // document.querySelector(item).setAttribute('uxp-selected', false);
                document.querySelector(item).classList.remove('selected');
            }
            else if (i === index) {
                // document.querySelector(item).setAttribute('uxp-selected', true);
                document.querySelector(item).classList.add('selected');
            }
        }

        execCircle();
    }

    function initOrientationButtons (rootNode) {
        // let mySystem = navigator.platform;
        // if (mySystem !== 'darwin') {
        //     let btn0 = rootNode.querySelector("#circleBtnOrientation0");
        //     let btn1 = rootNode.querySelector("#circleBtnOrientation1");
        //     let btn2 = rootNode.querySelector("#circleBtnOrientation2");
        //     let btn3 = rootNode.querySelector("#circleBtnOrientation3");
        //     let btn4 = rootNode.querySelector("#circleBtnOrientation4");

        //     btn0.setAttribute('class', 'arr-tab-bar__item--windows');
        //     btn1.setAttribute('class', "arr-tab-bar__item--windows");
        //     btn2.setAttribute('class', "arr-tab-bar__item--windows");
        //     btn3.setAttribute('class', "arr-tab-bar__item--windows");
        //     btn4.setAttribute('class', "arr-tab-bar__item--windows");
        // }
    }


    function triggerHelp (index) {
        switch (index) {
            case 1:
                require('uxp').shell.openExternal('http://www.arranger.io/docs-xd/circle-layout/#adjustlastobject');
            break;
        }
    }

    // --------
    // GRID
    // --------
    // Activate Position
    function togglePositionGrid () {
        const positionChecked = Boolean(document.querySelector("#gridCbStartPos").checked);

        if (positionChecked === true) {
            document.querySelector("#gridTxtPositionX").removeAttribute("disabled");
            document.querySelector("#gridTxtPositionY").removeAttribute("disabled");
        } else if (positionChecked === false) {
            document.querySelector("#gridTxtPositionX").setAttribute("disabled", "disabled");
            document.querySelector("#gridTxtPositionY").setAttribute("disabled", "disabled");
        }

        execGrid();
    }

    // ---------
    // Honey
    // ---------
    // Offset

    function updateAutoOffsetX () {

        // Guard
        const {selection} = require("scenegraph");
        if (selection.items.length <= 0) return;

        const isChecked = rootNode.querySelector('#honeyCbOffsetX').checked;
        // console.log('isChecked:', isChecked);

        if (isChecked === true) {
            const val = honeyJS.getAutoOffsetX();
            // console.log('val:', val);
            // Guard if anything goes wrong
            if (val === undefined) val = 0;

            // Update textfield
            document.querySelector("#honeyTxtOffsetX").value = val;
            document.querySelector('#honeyTxtOffsetX').setAttribute("disabled", "disabled");
        } else {
            document.querySelector('#honeyTxtOffsetX').removeAttribute("disabled");
        }

        execHoney(selection);
    }


    function updateAutoOffsetY () {
        // console.log('=== updateAutoOffsetY fired ===');
        const {selection} = require("scenegraph");
        // console.log('==> selection:', selection.items.length);
        if (selection.items.length <= 0) return;

        const isChecked = rootNode.querySelector('#honeyCbOffsetY').checked;
        // console.log('isChecked:', isChecked);

        if (isChecked === true) {
            let val = honeyJS.getAutoOffsetY();
            // Guard if anything goes wrong
            if (val === undefined) val = 0;
            if (val > 0) val = val * -1;

            // Update textfield
            document.querySelector("#honeyTxtOffsetY").value = val;
            document.querySelector('#honeyTxtOffsetY').setAttribute("disabled", "disabled");
        } else {
            document.querySelector('#honeyTxtOffsetY').removeAttribute("disabled");
        }

        execHoney();
    }

    // Pattern
    function getPatternHoney () {
        // const v = document.querySelector("#honeyBtnPattern1").getAttribute('uxp-selected');
        const v = document.querySelector("#honeyBtnPattern1").classList.contains('selected');
        if (v === false) {
            return true;
        } else if (v === true) {
            return false;
        }
    }

    function setPattern1Honey () {
        // document.querySelector("#honeyBtnPattern1").setAttribute('uxp-selected', "true");
        // document.querySelector("#honeyBtnPattern2").setAttribute('uxp-selected', "false");

        document.querySelector("#honeyBtnPattern1").classList.add("selected");
        document.querySelector("#honeyBtnPattern2").classList.remove('selected');

        execHoney();
    }

    function setPattern2Honey () {
        // document.querySelector("#honeyBtnPattern1").setAttribute('uxp-selected', "false");
        // document.querySelector("#honeyBtnPattern2").setAttribute('uxp-selected', "true");

        document.querySelector("#honeyBtnPattern1").classList.remove("selected");
        document.querySelector("#honeyBtnPattern2").classList.add('selected');

        execHoney();
    }

    // Activate Honeycomb
    // function toggleHoneycombLayout () {
    //     const honeycombChecked = Boolean(document.querySelector("#honeyCbHCActivated").checked);

    //     if (honeycombChecked === true) {
    //         document.querySelector("#honeyTxtOffsetX").removeAttribute("disabled");
    //         document.querySelector("#honeyTxtOffsetY").removeAttribute("disabled");
    //         document.querySelector("#honeyCbAlternateRows").removeAttribute("disabled");
    //     } else if (honeycombChecked === false) {
    //         document.querySelector("#honeyTxtOffsetX").setAttribute("disabled", "disabled");
    //         document.querySelector("#honeyTxtOffsetY").setAttribute("disabled", "disabled");
    //         document.querySelector("#honeyCbAlternateRows").setAttribute("disabled", "disabled");
    //     }

    //     execGrid();
    // }
    // --------
    // WAVE
    // --------
    // Activate Position
    function togglePositionWave () {
        const positionChecked = Boolean(document.querySelector("#waveCbStartPos").checked);

        if (positionChecked === true) {
            document.querySelector("#waveTxtPositionX").removeAttribute("disabled");
            document.querySelector("#waveTxtPositionY").removeAttribute("disabled");
        } else if (positionChecked === false) {
            document.querySelector("#waveTxtPositionX").setAttribute("disabled", "disabled");
            document.querySelector("#waveTxtPositionY").setAttribute("disabled", "disabled");
        }

        execWave();
    }
    // -------------------
    //
    // HTML + EVENTS
    //
    // -------------------
    // let rootNode = document.createElement("panel");
    rootNode = document.createElement("panel");
    rootNode.innerHTML = HTML;
    // --------------
    // ONBOARDING + SETTINGS
    // --------------
    // Show Settings
    rootNode.querySelector('#btnSettings').addEventListener("click", function() { showOnboarding(true, "settings"); });
    // Close Settings
    rootNode.querySelector('#onboardingBtnClose').addEventListener("click", function() { showOnboarding(false); });
    // Navigation for screens
    rootNode.querySelector('#onboardingBtnPrev').addEventListener("click", function() { showOnboardingScreenPrev(); });
    rootNode.querySelector('#onboardingBtnNext').addEventListener("click", function() { showOnboardingScreenNext(); });
    // Flag
    rootNode.querySelector('#onboardingCbShowFlag').addEventListener("click", toggleOnboardingFlag);
    // Start Arranger
    rootNode.querySelector('#onboardingBtnStart').addEventListener("click", function() { showOnboarding(false); });
    // Debug
    rootNode.querySelector('#onboardingBtnReset').addEventListener("click", function() { resetOnboarding(); });
    // --------------
    // TABS
    // --------------
    rootNode.querySelector('#btnTabCircle').addEventListener("click", showContentCircle);
    rootNode.querySelector('#btnTabGrid').addEventListener("click", showContentGrid);
    rootNode.querySelector('#btnTabWave').addEventListener("click", showContentWave);
    rootNode.querySelector('#btnTabHoney').addEventListener("click", showContentHoney);
    rootNode.querySelector('#btnTabHelp').addEventListener("click", function() { showOnboarding(true); });

    // --------------
    // CIRCLE
    // --------------
    rootNode.querySelector('#circleTxtSizeW').addEventListener("input", execCircle);
    rootNode.querySelector('#circleTxtSizeH').addEventListener("input", execCircle);
    //
    rootNode.querySelector('#circleTxtPosX').addEventListener("input", execCircle);
    rootNode.querySelector('#circleTxtPosY').addEventListener("input", execCircle);
    //
    rootNode.querySelector('#circleBtnCW').addEventListener("click", setDirectionCWCircle);
    rootNode.querySelector('#circleBtnCCW').addEventListener("click", setDirectionCCWCircle);
    //
    rootNode.querySelector('#circleStartAngle').addEventListener("input", changedStartAngleTextCircle);
    rootNode.querySelector('#circleEndAngle').addEventListener("input", changedEndAngleTextCircle);
    rootNode.querySelector('#circleCbEndAngle').addEventListener("click", toggleEndAngleCircle);
    rootNode.querySelector('#circleCbAdjustLastItem').addEventListener("click", execCircle);
    rootNode.querySelector('#circleStartSlider').addEventListener("change", changedStartAngleSliderCircle);
    rootNode.querySelector('#circleEndSlider').addEventListener("change", changedEndAngleSliderCircle);
    rootNode.querySelector('#circleBtnHelpAdjust').addEventListener("click", function() { triggerHelp(1); });
    //
    rootNode.querySelector('#circleBtnOrientation0').addEventListener("click", function() { setOrientationCircle(0); });
    rootNode.querySelector('#circleBtnOrientation1').addEventListener("click", function() { setOrientationCircle(1); });
    rootNode.querySelector('#circleBtnOrientation2').addEventListener("click", function() { setOrientationCircle(2); });
    rootNode.querySelector('#circleBtnOrientation3').addEventListener("click", function() { setOrientationCircle(3); });
    rootNode.querySelector('#circleBtnOrientation4').addEventListener("click", function() { setOrientationCircle(4); });
    //
    rootNode.querySelector('#circleCbRandomOrder').addEventListener("click", execCircle);
    //
    rootNode.querySelector('#circleBtnAction').addEventListener("click", execCircle);
    
    // --------------
    // GRID
    // --------------
    rootNode.querySelector('#gridTxtCols').addEventListener("input", execGrid);
    //
    rootNode.querySelector('#gridTxtGutterW').addEventListener("input", execGrid);
    rootNode.querySelector('#gridTxtGutterH').addEventListener("input", execGrid);
    //
    rootNode.querySelector('#gridCbStartPos').addEventListener("click", togglePositionGrid);
    rootNode.querySelector('#gridTxtPositionX').addEventListener("input", execGrid);
    rootNode.querySelector('#gridTxtPositionY').addEventListener("input", execGrid);
    //
    rootNode.querySelector('#gridCbRandomOrder').addEventListener("click", execGrid);
    //
    rootNode.querySelector('#gridBtnAction').addEventListener("click", execGrid);

    // --------------
    // WAVE
    // --------------
    rootNode.querySelector('#waveTxtPeriod').addEventListener("input", execWave);
    rootNode.querySelector('#waveTxtAmplitude').addEventListener("input", execWave);
    //
    rootNode.querySelector('#waveTxtDistance').addEventListener("input", execWave);
    rootNode.querySelector('#waveTxtStartAngle').addEventListener("input", execWave);
    //
    rootNode.querySelector('#waveCbStartPos').addEventListener("click", togglePositionWave);
    rootNode.querySelector('#waveTxtPositionX').addEventListener("input", execWave);
    rootNode.querySelector('#waveTxtPositionY').addEventListener("input", execWave);
    //
    rootNode.querySelector('#waveCbRandomOrder').addEventListener("click", execWave);
    //
    rootNode.querySelector('#waveBtnAction').addEventListener("click", execWave);

    // --------------
    // HONEYCOMB
    // --------------
    rootNode.querySelector('#honeyTxtCols').addEventListener("input", execHoney);
    //
    rootNode.querySelector('#honeyTxtGutterW').addEventListener("input", execHoney);
    rootNode.querySelector('#honeyTxtGutterH').addEventListener("input", execHoney);
    // rootNode.querySelector('#honeyCbHCActivated').addEventListener("click", toggleHoneycombLayout);

    //rootNode.querySelector('#honeyTxtOffsetX').addEventListener("input", execHoney);
    //rootNode.querySelector('#honeyTxtOffsetY').addEventListener("input", execHoney);

    rootNode.querySelector('#honeyTxtOffsetX').addEventListener("change", execHoney);
    rootNode.querySelector('#honeyTxtOffsetY').addEventListener("change", execHoney);

    rootNode.querySelector('#honeyCbOffsetX').addEventListener("click", updateAutoOffsetX);
    rootNode.querySelector('#honeyCbOffsetY').addEventListener("click", updateAutoOffsetY);
    // rootNode.querySelector('#honeyBtnRefreshX').addEventListener("click", resfreshOffsetXWrapper);
    // rootNode.querySelector('#honeyBtnRefreshY').addEventListener("click", resfreshOffsetYWrapper);
    
    //
    rootNode.querySelector('#honeyBtnPattern1').addEventListener("click", setPattern1Honey);
    rootNode.querySelector('#honeyBtnPattern2').addEventListener("click", setPattern2Honey);

    rootNode.querySelector('#honeyCbAlternateRows').addEventListener("click", execHoney);
    //
    rootNode.querySelector('#honeyCbRandomOrder').addEventListener("click", execHoney);
    //
    rootNode.querySelector('#honeyBtnAction').addEventListener("click", execHoney);

    // --------------
    // INIT
    // --------------
    initOrientationButtons(rootNode);

    // StorageHelper
    checkOnboardingFlag();
    
    return rootNode;
}

function show(event) {
    // Do not create new UI when there is one
    if (rootNode) { return; }
    event.node.appendChild(create());
}

function hide(event) {
    // Do nothing as we keep our UI
    // event.node.firstChild.remove();
}

function update(selection) {
    const { Rectangle } = require("scenegraph");
    let infoBadge = document.querySelector("#infobadge");
    let infoBadge2 = document.querySelector("#infobadge2");

    let str = "";
    let str2 = "";

    if (selection.items.length === 0) {
        infoBadge.textContent = "Please select some objects.";
        infoBadge2.textContent = "";
        
        // Disable UI when no selection
        utilsUI.enableUI(false);
    }
    else if (selection.hasArtboards === true) {
        if (selection.items.length === 1) {
            str = "Selection: 1 artboard";
            str2 = "Artboards are not supported."
        } else {
            str = String("Selection: " + selection.items.length + " artboards");
            str2 = "Note: artboards are not supported."
        }
        
        infoBadge.textContent = str;
        infoBadge2.textContent = str2;

        // Disable UI when no selection
        utilsUI.enableUI(false);
    }
    else {
        let str = "";
        let isSameGroup = utilsJS.hasSameGroup(selection.items);

        // Case 1: only 1 item && item is a group
        // ==> work with children in that group
        if (selection.items.length === 1 && utilsJS.isGroup(selection.items[0])) {
            var children = selection.items[0].children.length;
            str = String("Selection: 1 group");
            str2 = String(children + " objects in group will be arranged.");
        }
        // -------------------
        // Case 2: items are not part of the same group
        // ==> create a group and work with children (our items)
        // -------------------
        else if (isSameGroup === false) {
            if (selection.items.length === 1) {
                str = String("Selection: 1 object");
            } else {
                str = String("Selection: " + selection.items.length + " objects");
            }
            str2 =  "Note: objects will be grouped automatically.";
        }
        // -------------------
        // Case 3: items are part of the same group
        // ==> work on the selection (with children of that group)
        // -------------------
        else if (isSameGroup === true) {
            if (selection.items.length === 1) {
                str = String("Selection: 1 object");
                str2 = String("1 object in group will be arranged.");
            } else {
                str = String("Selection: " + selection.items.length + " objects");
                str2 = String(selection.items.length + " objects in group will be arranged.");
            }
        }

        infoBadge.textContent = str;
        infoBadge2.textContent = str2;

        
        // Enable UI
        utilsUI.enableUI(true);
    }
}


module.exports = {
    panels: {
        arrangeObjects: {
            show,
            hide,
            update
        }
    }
};