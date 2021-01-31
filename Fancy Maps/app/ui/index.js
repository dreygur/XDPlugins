const CSS = require("./css");
const pickScreen = require("./pick-screen");
// const customizeScreen = require("./customize-screen");
const customizeScreen = require("./customize-screen-mapbox");
const cities = require("./cities");
const { getMapUrl, getLocationCoordinates, 
    getMapImageByCoordinates, defaultThemes 
} = require("../utils");

function UI({state, setState, onApply}) {
    const HTML =`
        ${ CSS }

        <div id="fancyMaps" class="fancyMaps">
            <div id="app">
                ${ pickScreen }
                ${ customizeScreen }
            </div>

            <div id="warning">
                <p style="margin: 1rem 0; font-size: 0.9rem">Please select a shape to start your travels.</p>
                <img width="100%" src="images/empty-space.png" alt="..." />
            </div>

            <div id="invalidSelection" class="text-center">
                <p x-html="invalidSelectionMessage" style="margin: 1rem 0; font-size: 0.9rem; line-height: 1.8"></p>
            </div>

            <div id="loader">
                <div id="loaderContent" class="text-center">
                    <img width="80px" src="images/spinner.gif" />
                    <p>
                        Heading to your destination...
                    </p>

                    <div class="pt-2 text-center" @click="setState('loading', false)">
                        Cancel Trip
                    </div>
                </div>
            </div>
        </div>
    `;

    this.panel = document.createElement("div");
    this.panel.innerHTML = HTML;

    this.state = state;

    this.fetchLocationCoordinates = async (location) => {
        this.state.coords = [];
        try {
            this.methods.setState('fetchingLocation', true);
            const coords = await getLocationCoordinates(location);
            this.methods.setState({
                fetchingLocation: false,
                coords
            });
            // console.log("Location coordinates: ", coords);
        } catch (error) {
            this.methods.setState('fetchingLocation', false);
            console.log("Error fetching coordinates", error);
        }
    }

    this.methods = {
        setState,
        onApply,
        submitLocation: () => {
            setState('currentScreen', 'customize');
            this.fetchLocationCoordinates(this.state.selectedLocation);
        },
        pickSurpriseDestination: () => {
            function shuffle(array) {
                return [...array].sort(_ => Math.random() - 0.5);
            }

            const location = shuffle(cities)[0];

            setState({
                'selectedLocation': location,
                'currentScreen': 'customize',
            });

            this.fetchLocationCoordinates(this.state.selectedLocation);
        },
        changeLocation: () => {
            setState('currentScreen', 'pick');

            setTimeout(() => {
                document.querySelector("#locationInput").focus();
            }, 50);
        },
    };
    
    this.setupEventListeners();

    for (const [key, value] of Object.entries(this.state)) {
        this.update(key, value);
    }

    setTimeout(() => {
        this.setupPopularCities();
        this.setupThemes();
    }, 70);
}

UI.prototype.setupPopularCities = function(){
    const popularCities = [
        "Tokyo", "Barcelona", "Paris",
        "Bali", "Brisbane", "Dubai", 
        "New York", "Nairobi", "Sao Paulo"
    ];

    const popularDestinations = document.querySelector("#popularDestinations");

    popularCities.forEach(city => {
        const destination = document.createElement("div");
        destination.className = "popular-city flex relative mb-3";
        destination.innerHTML = `
            <img src="images/cities/${city.toLowerCase().replace(" ", "-")}.png" />
            <span class="absolute inset-0 flex center-center z-10 m-auto">${city.toUpperCase()}</span>
        `;
        destination.onclick = () => {
            this.methods.setState({
                'selectedLocation': city,
                'currentScreen': 'customize'
            });

            this.fetchLocationCoordinates(city);
        }
        popularDestinations.appendChild(destination);
    });
}

UI.prototype.setupThemes = function(){
    const themesWrapper = document.querySelector("#mapTypes");
    const themeNames = Object.keys(defaultThemes);

    themeNames.forEach((theme) => {
        const themeItem = document.createElement("div");
        let className = "map-type";
        if(theme === this.state.theme)
            className+= " current";

        themeItem.className = className;
        themeItem.innerHTML = `<img src="images/themes/${theme.toLowerCase()}.png" />`;
        // <span class="absolute inset-0 flex center-center z-10 m-auto">
        //     ${name}
        // </span>
        themeItem.onclick = () => {
            const currentlySelected = document.querySelector(".map-type.current");
            if(currentlySelected)
                currentlySelected.classList.remove("current");

            themeItem.classList.add("current");
            this.methods.setState("theme", theme);
        }
        themesWrapper.appendChild(themeItem);
    });
}

UI.prototype.setupEventListeners = function(){
    this.panel.querySelectorAll("[x-model], [@click], [@submit], [@load]").forEach(node => {
        if(node.hasAttribute('x-model')){
            const modelAttr = node.getAttribute("x-model");
            node.addEventListener("input", ({target}) => this.methods.setState(modelAttr, target.value));
        }
        else{ //if(node.hasAttribute('@click') || node.hasAttribute('@submit')){
            const actionsAttributes = ["@click", "@submit", "@load"];
            const actionAttr = actionsAttributes.find(attribute => node.hasAttribute(attribute));
            const actionValue = node.getAttribute(actionAttr);

            const [functionName, argString] = actionValue.replace(')', '').split('(');
            const args = argString ? argString.replace(/'|\s/g, '').split(',') : [];
            node.addEventListener(actionAttr.replace('@', ''), _ => this.methods[functionName](...args));
        }
    });
}

UI.prototype.applyDataBinding = async function(key, value){
    const matchingNodes = Array.from(this.panel.querySelectorAll(`[x-model="${key}"], [x-text="${key}"], [x-html="${key}"], [x-src="${key}"]`));
    
    if(matchingNodes.length){
        matchingNodes.forEach(node => {
            if(node.hasAttribute('x-model') && node.value !== value)
                node.value = value;
            else if(node.hasAttribute('x-text'))
                node.textContent = value;
            else if(node.hasAttribute('x-html'))
                node.innerHTML = value;
            else if(node.hasAttribute('x-src')){
                node.src = "";

                setTimeout(() => {
                    node.src = value;
                }, 10);
            }
        });
    }

    this.state[key] = value;

    const urlDeps = ["selectedLocation", "zoomLevel", "pitch", "mapType", "theme", "coords"];
    
    if(urlDeps.includes(key)){
        let url = getMapUrl({...this.state, width: 400, height: 300});
        this.methods.setState({mapImageUrl: url, loadingPreview: true});
    }
}

UI.prototype.update = function(key, value){
    const el = document.querySelector("#fancyMaps");

    if(key === 'observe' || !el || !el.className)
        return;

    var prefix = `ui-${key}-`;
    var classes = el.className.split(" ").filter(c => c.indexOf(prefix, 0) !== 0);
    el.className = classes.join(" ").trim() + ` ${prefix + value}`;

    this.applyDataBinding(key, value);
}

module.exports = UI;