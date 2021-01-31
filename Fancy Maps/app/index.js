const UI = require("./ui/index");

const initialState = {
    currentScreen: "pick",
    selectedLocation: "New York",
    coords: [],
    fetchingLocation: false,
    fetchLocationError: false,
    loadingPreview: false,
    theme: "Basic",
    mapType: "light",
    zoomLevel: 8,
    pitch: 0,
    mapImageUrl: "",
    width: 150,
    height: 90,
    loading: false
};

let state = {};

let appUI;

function setState(...args) {
    if(typeof args[0] === 'object'){
        const newState = args[0];
        state = {...state, ...newState};
        
        if(appUI) {
            for (const [key, value] of Object.entries(newState)) {
                appUI.update(key, value);
            }
        };
    }
    else{
        const [key, value] = args;
        state[key] = value;
        if(appUI) appUI.update(key, value);
    }
}

function update(selection) {
    const itemSelected = selection && selection.items.length > 0;
    let selectionIsValid = true;
    let invalidSelectionMessage = "";

    if(itemSelected){
        const node = selection.items[0];
        const supportedNodes = ["Rectangle", "Polygon", "Path", "Ellipse"];
        selectionIsValid = supportedNodes.includes(node.constructor.name);

        if(!selectionIsValid){
            invalidSelectionMessage = `Sorry, Fancy Maps doesn't work with <b>${node.constructor.name}s</b> `;
            invalidSelectionMessage += `, please select a `;
    
            supportedNodes.forEach((node, index) => {
                invalidSelectionMessage += `<strong><b>${node}</b></strong>`;
                if(supportedNodes.length - index > 2)
                    invalidSelectionMessage += ", ";
                else if(supportedNodes.length - index === 2)
                    invalidSelectionMessage += " or an ";
            });

            invalidSelectionMessage += " instead.";
        }
    }


    setState({
        itemSelected,
        selectionIsValid,
        invalidSelectionMessage
    });

    if(!state.currentScreen){
        setState(initialState);
    }

    if(itemSelected){
        const { width, height } = selection.items[0];
        setState({width, height});
    }
}

function create({onApply}){
    appUI = new UI({
        state: initialState,
        setState,
        onApply: _ => onApply(state)
    });

    return appUI.panel;
}

module.exports = {
    update, 
    create,
    setState
}