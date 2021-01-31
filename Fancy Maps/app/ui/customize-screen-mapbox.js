module.exports = `
    <div id="customizeScreen">
        <div id="customizeScreenTitle" class="row">
            <span @click="changeLocation">
                <svg height="24" viewBox="0 0 24 24" width="24">
                    <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/>
                </svg>
            </span>
            
            <h1 x-text="selectedLocation"> </h1>
        </div>

        <img id="coordinatesLoader" src="images/spinner.gif" width="60px" />

        <div id="customizeFields">
            <div class="relative flex center-center">
                <img id="mapPreview" alt="..." x-src="mapImageUrl" 
                    @load="setState('loadingPreview', false)"
                />
                <img id="mapPreviewLoader" class="absolute m-auto" src="images/spinner.gif" style="width: 60px; transform: translateX(-10px)" />
            </div>

            <div id="zoomLevel">
                <label>ZOOM LEVEL</label>
                <div>
                <input type="range" min=4 max=20
                    x-model="zoomLevel" style="width:100%"
                />
                </div>
                <div id="zoomLevels" class="row">
                    <div>
                        <span></span>
                        State
                    </div>
                    <div>
                        <span></span>
                        City
                    </div>
                    <div>
                        <span></span>
                        Street
                    </div>
                </div>
            </div>
            
            <label>MAP STYLE</label>
            <div id="mapTypes" class="row">
                
            </div>

            <div id="mapTypesDefault" class="row">
                <div class="map-type" id="mapTypeLight" @click="setState('mapType', 'light')">
                    <img src="images/map-light.png" />
                </div>
                <div class="map-type" id="mapTypeDark" @click="setState('mapType', 'dark')">
                    <img src="images/map-dark.png" />
                </div>
                <div class="map-type" id="mapTypeSat" @click="setState('mapType', 'sat')">
                    <img src="images/map-sat.png" />
                </div>
            </div>

            <hr />

            <div id="applyMap">
                <h2 class="text-center">Ready to take off?</h2>
                <div class="button large" uxp-variant="cta" @click="onApply">Apply Map</div>
            </div>
        </div>

    </div>
`;
        // <button class="block" @click="changeLocation">Change Location</button>