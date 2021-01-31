/**
 *  Experience Generator
 * 
 *  Generate entire groups of artboards for each experience and device selected with every artboard needed for that specific experience, and defined sizes for the device resolution. 
 *  By combining several experience and device selections, it's able to create complex workflows in a matter of seconds.
 *
 *  LICENSE: These source files should not be copied, destributed, modified,
 *  altered or used in any way, other than running the original install package,
 *  and using the plugin on a licensed and updated copy of Adobe XD. The plugin
 *  is provided as is and we take no responsibily for any malfunction on both
 *  the plugin and the software itself, nor any loss of data that may follow.
 *
 *  @package    Experience Generator |
 *  @author     Unykvis <info@unykvis.com>
 *  @copyright  Unykvis
 *  @since      File available since Release 1.1.1
 * 
 */

 //É preciso dar um timeout para dar tempo do jQuery se lido
 
 global.setTimeout = (fn) => { fn() }
 global.clearTimeout = (fn) => {}
 
 //Chama o jUqery
 const $ = require("./jquery");

 //DEBUUG MODE
let debugmode = false;

const  {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text,ImageFill} = require("scenegraph");             
const LS  = require("uxp").storage;
const LFS = require("uxp").storage.localFileSystem;
const viewport = require("viewport");
let dbFolder = 'db';
let dbFileName = 'experience_generator_v01';
let dbSocialFileName = 'social_generator_v01';
let userURL = undefined;
let pagesListJson;
let experiencesList = [];
let devicesList = [];
let socialList = [];
let experiencesNames    = [];
let devicesNames        = [];
let socialNames        = [];
let experiencesUniqueArray;
let experiencesNameUniqueArray;
let deviceUniqueArray;
let deviceNameUniqueArray;
let socialUniqueArray;
let socialNameUniqueArray;
let deviceSelection     = '';                                    
let experienceSelection = '';
let socialSelection = '';
let socialExpSelection = '';
let experienceJSON;
let socialJSON;
let dialog;
let pagelist;
let noImagesHTML = 'Please choose site first.';
let form =''+
    '<style>'+
        // '*{border:solid 1px rgba(000,000,000,0.1);}'+
        '.o-hidden{overflow:hidden;}'+
        '.o-x-scroll{overflow-x:scroll;}'+
        '.o-y-scroll{overflow-y:scroll;}'+
        '.m-0{magin:0;}'+
        '.p-0{padding:0;}'+
        '.p-1{padding:5px;}'+
        '.p-2{padding:10px;}'+
        '.p-3{padding:15px;}'+
        '.p-4{padding:20px;}'+
        '.p-5{padding:25px;}'+
        '.d-none{display:none;}'+
        '.tabs{border-bottom:solid 1px rgba(000,000,000,0.05);}'+
        '.tab{background:rgba(000,000,000,0.025);padding:10px!important;display:flex;margin-right:3px;border-radius:3px 3px 0 0;}'+
        '.tab.active{background:rgba(000,000,000,0.05);}'+
        '.tab-content.active{display:block;}'+
        '.experiences{width:400px;height:300px; margin-left:15px;background:#fff;padding:15px 10px;border-radius:5px;}'+
        '.socialmediaexperiences{width:540px;height:300px; margin-left:15px;background:#fff;padding:15px 10px;border-radius:5px;}'+
        '.devices{width:200px;height:300px; background:#fff;padding:15px 10px;border-radius:5px;margin-right:5px;}'+
        '.scrollsection{width:400px;height:300px; background:#fff;padding:15px 10px;border-radius:5px;margin-left:10px;}'+
        '.warning{ color:#ff2d2d; font-weight:bold;font-size:12px; text-align:right; margin-right:15px; position:absolute; left:35px; bottom:50px; display:none;}'+
        '.socialmedia{height:300px;padding-top:20px;margin-top:27px;}'+
        '.socialmedia-cell{height:30px;width:30px;background:rgb(200,200,200);margin:10px;padding:3px;text-align:center;}'+
        '.social-active{height:30px;width:30px;background:rgb(160,160,160);margin:10px;padding:3px;text-align:center;}'+
        '.social-selector{width:100%;text-align:left;}'+
        '.social-icon{height:24px;width:24px;}'+
        '.social-selected{display:none;}'+

    '</style>'+
    '<form method="dialog" id="formSubmitURL">' + 
        '<div class="o-hidden">'+
            '<h1>'+
                'Experience Generator'+
            '</h1>'+
            '<hr class="small" />'+
            '<div class="row tabs">'+
                '<div class="column tabs" title="Generate Artboards from our experiences library" >'+
                    '<div class="tab active" data-tabindex="0">Artboards</div>'+
                '</div>'+
                // '<div class="column tabs" title="Generate Artboards from your website structure automaticly">'+
                //     '<div class="tab" data-tabindex="1">URL</div>'+
                // '</div>'+
                '<div class="column tabs" title="Generate Artboards for Social Media Site">'+
                    '<div class="tab" data-tabindex="2">Social Media</div>'+
                '</div>'+
            '</div>'+
            '<div class="artboards-content tab-content d-none active" >'+
                '<h3>'+
                    'You must select at least one device and one experience.'+
                '</h3>'+
                '<div class="row">'+
                    '<div class="col">'+
                        '<h2>'+
                            'Choose your Devices:'+
                        '</h2>'+
                        '<div class="devices o-y-scroll m-0 p-0">' +             
                        '</div>'+
                    '</div>'+
                    '<div class="col">'+
                        '<h2>'+
                            'Choose a few Experiences:'+
                        '</h2>'+
                        '<div class="experiences o-y-scroll m-0 p-0">' +             
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<footer>'+
                '<div id="warning" class="warning">Sorry! You must select at least one device and one experience.</div>'+
           
                    '<button type="submit" id="gen" class="generate-button" uxp-variant="cta">'+
                        'Build Experience'+
                    '</button>'+
                    '<button id="cancel" class="cancel-button" uxp-variant="secundary">'+
                        'Cancel'+
                    '</button>'+
                '</footer>'+
            '</div>'+
            '<div class="crawller-content tab-content d-none">'+
                '<h3>'+
                    'Add your website homepage url without http:// or https://'+
                '</h3>'+
                '<div class="row">'+
                    '<label>'+
                        '<input id="userURL" type="text" placholder="add your website" value="www.algardata.com"/>'+
                    '</label>'+
                    '<button id="submitURL" uxp-variant="primary">Get Pages</button>'+
                '</div>'+
                '<div class="row">'+
                    '<div class="col">'+
                        '<h2>'+
                            'Choose your Devices:'+
                        '</h2>'+
                        '<div class="devices o-y-scroll m-0 p-0">' + 
                        '</div>'+
                    '</div>'+
                    '<div class="col">'+
                        '<h2>'+
                            'Choose a few pages:'+
                        '</h2>'+
                        '<div class="o-v scrollsection o-y-scroll m-0 p-0">' + 
                            '<div id="pageList"><div>'+noImagesHTML+'</div></div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<footer>'+
                    '<button type="submit" id="gen2" class="generate-button" uxp-variant="cta">'+
                        'Build Experience'+
                    '</button>'+
                    '<button id="cancel2" class="cancel-button" uxp-variant="secundary">'+
                        'Cancel'+
                    '</button>'+
                '</footer>'+
            '</div>'+
            '<div class="socialmedia-content tab-content d-none">'+
                '<h3>'+
                    'Select Social Media accounts and experiences'+
                '</h3>'+
                '<div class="row">'+
                    '<div class="col">'+
                        // '<h2>'+
                        //     'Choose your Social Media:'+
                        // '</h2>'+
                        '<div class="socialmedia o-y-scroll m-0 p-0">' +
                        '</div>'+
                    '</div>'+
                    '<div class="col">'+
                        '<h2>'+
                            'Choose a few experiences:'+
                        '</h2>'+
                        '<div class="experiences socialmediaexperiences o-y-scroll m-0 p-0">' +             
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<footer>'+
                    '<div id="warning3" class="warning">Sorry! You must select at least one experience.</div>'+
            
                    '<button type="submit" id="gen3" class="generate-button" uxp-variant="cta">'+
                        'Build Experience'+
                    '</button>'+
                    '<button id="cancel3" class="cancel-button" uxp-variant="secundary">'+
                        'Cancel'+
                    '</button>'+
                '</footer>'+
            '</div>'+
        '</div>'+
        
    '</form>'    
    
;
// let apiurl = 'https://unyktv-extensions.azurewebsites.net/scrapper/api/scrapper/v3/pages?address=';
let apiurl = 'http://scrapper-webapi.azurewebsites.net/api/scrapper/v4/pages?address=';
let apiparams = '&SearchMode=MultiPage&PageLimit=10';
let domainRegex = new RegExp(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/);

let token = 'g8Qd0v5UOWsF6YsG2_UrdzJRX-lj3GZFSbRx004c6GA9pkKBD8cOki8ISSYD2tsPhV9yYVzxIRDKTPa1Frm1jZ83xKwhMwS6XME-4-fWqvaTYjTtkGcXCnjSF2NHOT6yTGYuULNr-zOCvPXgan0qFfNoN_ZD4jY7x7KXqo3u53Rpkh3S3pOL4O6Cfr3ERE_q7emF38qhTcxxOLeK2CTi2e-Mr_8kowKnF4Utuwb76bvA6XChheQhVgLeIKjM4tVJdwbhMZdVvXxRcboR9x3wV8JEdXVvb519g0tm5I2Blr0p';/**
let token = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvLqr5HYy8ra0WNX6bPHkCKucVRxuGV12EehRcsTMpCSHOkI64dgL1mG+Zr';/**


 *
 *
 * @param {*} a
 */
function lg(a){
	if(debugmode == true){
		console.log(a);
	}
}

/**
 *
 *
 * @param {*} selection
 * @param {*} documentRoot
 */
async function artBoardGen(selection,documentRoot) {
    
    let pluginFolder = await LFS.getPluginFolder();
    let dbFile       = await pluginFolder.getEntry(dbFolder + "/" + dbFileName + ".json");
    let dbSocialFile = await pluginFolder.getEntry(dbFolder + "/" + dbSocialFileName + ".json");
    let jsonData     = await dbFile.read();
    let jsonSocial = await dbSocialFile.read();
    
    extractDevicesAndExperiences(JSON.parse(jsonData));
    extractSocialAndExperiences(JSON.parse(jsonSocial));

    const dialog = createDialog(selection,documentRoot);

    try {
        const r = await dialog.showModal();
        if (r) {
            console.log(`Your name is ${r}`);
        }
    } catch (err) {
        console.log("ESC dismissed dialog");
    }
}

/**
 *
 *
 * @param {*} selection
 * @param {*} documentRoot
 */
function createDialog(selection,documentRoot) {
    lg('Create Dialog');

    //Reuse old Dialog
    if(dialog){
        return dialog;
    }

    //Create Dialog
    var dialogID = `#experiencegenerator-dialog`;
    document.body.innerHTML = `<dialog id="experiencegenerator-dialog"></dialog>`;
    dialog = document.querySelector(dialogID);

    let formHTML ='';

    //Add Form
    formHTML = document.createElement('div');
    formHTML.innerHTML = form;
    dialog.appendChild(formHTML);

    $('.devices').html(deviceSelection);
    $('.experiences').html(experienceSelection);
    $('.socialmedia').html(socialSelection);
    $('.socialmediaexperiences').html(socialExpSelection);

    //TAB CHOOSER

    var anchors = document.getElementsByClassName('tab');

    for (var i = 0; i < anchors.length; i++) {
        let elem = anchors[i];
        elem.addEventListener("click", (e) => {
            $('.tab').removeClass('active');
            $(elem).addClass('active');

            $('.tab-content').removeClass('active');
            $('.tab-content').eq($(elem).data('tabindex')).addClass('active');

        });
    }

    //SOCIAL MEDIA CHOOSER
    var socialanchors = document.getElementsByClassName('socialmedia-cell');
    for(var i = 0; i < socialanchors.length; i++) {
        let stelem = socialanchors[0];
        let stselSocial = stelem.getAttribute("data-selected");
            $(".socialmedia-cell").removeClass("social-active");
            $(stelem).addClass("social-active");
            $(".social-selector").addClass("social-selected");
            $(".only-"+stselSocial).removeClass("social-selected");

            
        let elem = socialanchors[i];
        elem.addEventListener("click", (e) => {
            
            let selSocial = elem.getAttribute("data-selected");
            $(".socialmedia-cell").removeClass("social-active");
            $(elem).addClass("social-active");
            $(".social-selector").addClass("social-selected");
            $(".only-"+selSocial).removeClass("social-selected");
        });
    }

    //Tab Content 01
    const gen = document.getElementById('gen');
    const cancel = document.getElementById('cancel');
    const submitURL   = document.getElementById('submitURL');

    var inputDeviceElements     = document.getElementsByClassName('checkbox-verif-devices');
    var inputExperienceElements = document.getElementsByClassName('checkbox-verif');
    var atLeastOneDev;
    var atLeastOneEle;

    cancel.addEventListener("click", () => {
        dialog.close();
    });

    const submit = () => { 
        dialog.close();
    }

    gen.addEventListener("click", e => {
        atLeastOneEle=false;
        atLeastOneDev=false;
        for(var i=0; inputDeviceElements[i]; ++i){
            if(inputDeviceElements[i].checked){
                atLeastOneDev=true;
                lg('Devices selected');
            }
        }
        for(var i=0; inputExperienceElements[i]; ++i){
            if(inputExperienceElements[i].checked){
               atLeastOneEle=true;      
               lg('Experiences selected');
            }
        }
        if (atLeastOneEle == true && atLeastOneDev == true){
            lg('Both selected');
            var element = document.getElementById("warning");
            element.style.display = 'none'; 
            newArtboard(documentRoot,dialog);
            submit();
        }
        else{
            lg('Nothing selected');
            var element = document.getElementById("warning");
            element.style.display = 'none'; 
            element.style.display = 'block'; 
            e.preventDefault();
        }
    });

    //Tab Content 02

    const gen2 = document.getElementById('gen2');
    const cancel2 = document.getElementById('cancel2');

    cancel2.addEventListener("click", () => {
    //     dialog.close();
    });

    submitURL.addEventListener("click", e => {

        //Clean Grid
        $('#pageList > div').html('');

        let gettingImages = 'Inspect is now fecthing, please be patient this can take a while. Once all pages are found you only need generate the artboards. Please don\'t close the dialog. Inspect is processsing...</div> Please be patient...</div><div class="running"><img src="./images/icons/preloader.gif"/></div>';

        userURL = document.getElementById('userURL').value;
        let validDomain = domainRegex.test(userURL);

        if(validDomain === true){
            pagesImages();
        }else{
         $('#pageList > div').html('Please add a valid domain!');
        }

        function pagesImages(){
            lg('Fecth pages Api');

            $('#pageList > div').html(gettingImages);

            fetch(apiurl + userURL + apiparams, { method: 'GET', headers:{'ApiToken': token }})
                .then(res => res.json())         
                .then(response => pagesListJson = response)
                .then( function(){
                    console.log(pagesListJson);
                    darwPages(pagesListJson);
                })
        }


    });




    //Tab Content 03

    var inputSocialExperienceElements = document.getElementsByClassName('checkbox-verif-socialexp');
    var atLeastOneExpSoc;

    const gen3 = document.getElementById('gen3');
    const cancel3 = document.getElementById('cancel3');

    gen3.addEventListener("click", (e) => {
        atLeastOneExpSoc=false;
        for(var i=0; inputSocialExperienceElements[i]; ++i){
            if(inputSocialExperienceElements[i].checked){
                atLeastOneExpSoc=true;      
               lg('Experiences selected');
            }
        }
        if (atLeastOneExpSoc == true){
            lg('Both selected');
            var element = document.getElementById("warning3");
            element.style.display = 'none'; 
            newSocialArtboard(documentRoot,dialog);
            submit();
        }
        else{
            lg('Nothing selected');
            var element = document.getElementById("warning3");
            element.style.display = 'none'; 
            element.style.display = 'block'; 
            e.preventDefault();
        }
    });

    cancel3.addEventListener("click", () => {
      dialog.close();

    });

    submitURL.addEventListener("click", e => {

        //Clean Grid
        $('#pageList > div').html('');

        let gettingImages = 'Inspect is now fecthing, please be patient this can take a while. Once all pages are found you only need generate the artboards. Please don\'t close the dialog. Inspect is processsing...</div> Please be patient...</div><div class="running"><img src="./images/icons/preloader.gif"/></div>';

        userURL = document.getElementById('userURL').value;
        let validDomain = domainRegex.test(userURL);

        if(validDomain === true){
            pagesImages();
        }else{
         $('#pageList > div').html('Please add a valid domain!');
        }

        function pagesImages(){
            lg('Fecth pages Api');

            $('#pageList > div').html(gettingImages);

            fetch(apiurl + userURL + apiparams, { method: 'GET', headers:{'ApiToken': token }})
                .then(res => res.json())         
                .then(response => pagesListJson = response)
                .then( function(){
                        darwPages(pagesListJson);
                })
        }


    });

    // gen2.addEventListener("click", e => {
    //     //newArtboard(documentRoot,dialog);      
    // });

    //General Functions TABS

    
    
    return dialog;
}

/**
 *
 *
 * @param {*} experienceListJSON
 */
function extractDevicesAndExperiences(experienceListJSON){

    for (let i = 0; i < experienceListJSON.experiences.length; i++) {
        experiencesList.push(experienceListJSON.experiences[i].name);
        experiencesNames.push(experienceListJSON.experiences[i].title);
        for (let e = 0; e < experienceListJSON.experiences[i].devices.length; e++) { 
            devicesList.push(experienceListJSON.experiences[i].devices[e].name);
            devicesNames.push(experienceListJSON.experiences[i].devices[e].title);
        }
    }

    experiencesUniqueArray              = [...new Set(experiencesList)];
    experiencesNameUniqueArray          = [...new Set(experiencesNames)];
    deviceUniqueArray                   = [...new Set(devicesList)];
    deviceNameUniqueArray               = [...new Set(devicesNames)];

    for (let i = 0; i < experiencesUniqueArray.length; i++) {
        let experienceCell = ''+
            '<label class="label-selector row" for="'+experiencesUniqueArray[i]+'" >'+
                '<input class="checkbox-input checkbox-verif"  type="checkbox" id="'+experiencesUniqueArray[i]+'" name="device" value="'+experiencesUniqueArray[i]+'" />'+
                    '<span>' + experiencesNameUniqueArray[i]+ '</span>' +
            '</label>'
        ;   
        experienceSelection += experienceCell;
    }

    for (let i = 0; i < deviceUniqueArray.length; i++) {
        let deviceCell = ''+
            '<label class="label-selector row" for="'+deviceUniqueArray[i]+'">'+
                '<input class="checkbox-input checkbox-verif-devices" type="checkbox" id="'+deviceUniqueArray[i]+'" name="device"  value="'+deviceUniqueArray[i]+'" />'+
                 '<span>' +deviceNameUniqueArray[i]+ '</span>' +
            '</label>'
        ;   
        deviceSelection += deviceCell;
    }
     experienceJSON = experienceListJSON; 
};

/**
 *
 *
 * @param {*} socialListJSON
 */
function extractSocialAndExperiences(socialListJSON){
    let socialExpCel ="";
    for (let i = 0; i < socialListJSON.socialmedia.length; i++) {
        socialList.push(socialListJSON.socialmedia[i].name);
        socialNames.push(socialListJSON.socialmedia[i].imgsrc);
        socialExpCel = '';
        for (let x = 0; x < socialListJSON.socialmedia[i].experiences.length; x++) {
            socialExpCel += '<label class="label-selector social-selector social-selected only-'+socialListJSON.socialmedia[i].name+'" ><div class="row"><input class="checkbox-input checkbox-verif-socialexp" type="checkbox" id="'+socialListJSON.socialmedia[i].experiences[x].name+'" name="socialexp"  value="'+socialListJSON.socialmedia[i].experiences[x].name+'" />'+
           '<span>' +socialListJSON.socialmedia[i].experiences[x].title+ '</span></div></label>';
        }
        socialExpCel += '';
        socialExpSelection += socialExpCel;
    }

    socialUniqueArray              = [...new Set(socialList)];
    socialNameUniqueArray          = [...new Set(socialNames)];
    // deviceUniqueArray                   = [...new Set(devicesList)];
    // deviceNameUniqueArray               = [...new Set(devicesNames)];

    for (let i = 0; i < socialUniqueArray.length; i++) {
        let socialCell = '<div class="socialmedia-cell" data-selected="'+socialUniqueArray[i]+'"><img src="'+socialNameUniqueArray[i]+'" class="social-icon"/></div>';   
        socialSelection += socialCell;
    }
    // for (let i = 0; i < deviceUniqueArray.length; i++) {
    //     let deviceCell = ''+
    //         '<label class="label-selector row" for="'+deviceUniqueArray[i]+'">'+
    //             '<input class="checkbox-input checkbox-verif-devices" type="checkbox" id="'+deviceUniqueArray[i]+'" name="device"  value="'+deviceUniqueArray[i]+'" checked/>'+
    //              '<span>' +deviceNameUniqueArray[i]+ '</span>' +
    //         '</label>'
    //     ;   
    //     deviceSelection += deviceCell;
    // }
     socialJSON = socialListJSON; 
};


/*
*CREATE ARTBOARDS 
*/

function getExperience(experienceJSON, experienceName) {
    for ( var expNum = 0; expNum < experienceJSON.experiences.length; expNum++) {
        if ( experienceJSON.experiences[expNum].name == experienceName){
            return experienceJSON.experiences[expNum].devices;
        }
    }
};
function getDevice(experienceObj, deviceName) {
    for ( var devNum = 0; devNum < experienceObj.length; devNum++) {
        if ( experienceObj[devNum].name == deviceName){
            return experienceObj[devNum].artboards;
        }
    }
};
function getSocialExperience(experienceJSON, experienceName) {
    for ( var socNum = 0; socNum < experienceJSON.socialmedia.length; socNum++) {
        for ( var expNum = 0; expNum < experienceJSON.socialmedia[socNum].experiences.length; expNum++){
            if ( experienceJSON.socialmedia[socNum].experiences[expNum].name == experienceName){
                return experienceJSON.socialmedia[socNum].experiences[expNum];
            }
        }
    }
};
function newArtboard(documentRoot) {

    //console.log('generate');


    var checkedDevice           = [];
    var checkedDeviceValue      = null; 
    var inputDeviceElements     = document.getElementsByClassName('checkbox-verif-devices');
    var checkedExperience       = [];
    var checkedExperienceValue  = null; 
    var inputExperienceElements = document.getElementsByClassName('checkbox-verif');
    for(var i=0; inputDeviceElements[i]; ++i){
        // console.log(inputDeviceElements[i].checked);
        if(inputDeviceElements[i].checked){
            checkedDeviceValue = inputDeviceElements[i].value;
            if(checkedDeviceValue == "all-devices"){
                checkedDevice = deviceUniqueArray;
            }
            else{
                checkedDevice.push(checkedDeviceValue);
            }
        }
    }
    
    for(var i=0; inputExperienceElements[i]; ++i){
        if(inputExperienceElements[i].checked){
            checkedExperienceValue = inputExperienceElements[i].value;
            if(checkedExperienceValue == "all-experiences"){
                checkedExperience = experiencesUniqueArray;
            }
            else{
                checkedExperience.push(checkedExperienceValue);
            }
        }
    }

    for (var device = 0; device < checkedDevice.length; device++) {
        var checkedDeviceValue = checkedDevice[device];

        if (checkedDeviceValue != "all-devices"){

            if (checkedExperience.length != null){

                for (var experience = 0; experience < checkedExperience.length; experience++) {

                    var checkedExperienceValue  = checkedExperience[experience];
                    let farthestH               = -24000;
                    let farthestW               = 0;
                    let nearestH                = 0;
                    let nearestW                = 0;
                    let farthestArtboardH       = 0;
                    let farthestArtboardW       = 0;
                    let nearestArtboardH        = 0;
                    let nearestArtboardW        = 0;
                    let nextArtboardPosition    = 0;
                    let artboardSpacing         = 70;
                    let artboardVertSpacing     = 100;

                    documentRoot.children.forEach(artboard => {
                        farthestArtboardH = artboard.globalBounds.y + artboard.height;
                        farthestArtboardW = artboard.globalBounds.x + artboard.width;
                        nearestArtboardH = artboard.globalBounds.y;
                        nearestArtboardW = artboard.globalBounds.x;

                        if (farthestArtboardH >= farthestH) {
                            farthestH = farthestArtboardH;
                        }
                        if (farthestArtboardW >= farthestW) {
                            farthestW = farthestArtboardW;
                        }
                        if (nearestArtboardH <= nearestH) {
                            nearestH = nearestArtboardH;
                        }
                        if (nearestArtboardW <= nearestW) {
                            nearestW = nearestArtboardW;
                        }
                    });

                    if (checkedExperienceValue != "all-experiences"){
                        var expObject = getExperience(experienceJSON, checkedExperienceValue);
                        var settingsScope = getDevice(expObject, checkedDeviceValue);

                        if( settingsScope !=null){

                            for (let a = 0; a < settingsScope.length; a++) {
                                if (farthestH < 23000){
                                    var expDevSetting = settingsScope[a];
                                    var artBoardHeight = expDevSetting.height;
                                    var artBoardWidth = expDevSetting.width;
                                    var artBoardName = expDevSetting.title;     
                                    var newArt = new Artboard();
                                    newArt.name = checkedDeviceValue.charAt(0).toUpperCase() + checkedDeviceValue.replace("_", "-").substr(1)  + ' ' +checkedExperienceValue.charAt(0).toUpperCase() + checkedExperienceValue.replace("_", "-").substr(1)  +  ' - ' +artBoardName;
                                    newArt.width = artBoardWidth;
                                    newArt.height = artBoardHeight;
                                    newArt.fillEnabled = true;
                                    newArt.fill = new Color("white");
                                    newArt.focusedArtboard = true;
                                    documentRoot.addChild(newArt, 0);
                                    if(a>=1){   
                                        newArt.moveInParentCoordinates(nextArtboardPosition, farthestH + artboardVertSpacing);
                                        nextArtboardPosition = nextArtboardPosition + newArt.width + artboardSpacing;
                                        viewport.zoomToRect(newArt);
                                    }
                                    else{
                                        nextArtboardPosition = nearestW + newArt.width + artboardSpacing;
                                        newArt.moveInParentCoordinates(nearestW, farthestH + artboardVertSpacing);
                                        viewport.zoomToRect(newArt);
                                    }
                                }           
                                else{
                                    // console('Sorry! There is no vertical space to create more artboards. Try rearranging your workspace.');
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

function newSocialArtboard(documentRoot) {

    var checkedSocialExperience       = [];
    var checkedSocialExperienceValue  = null; 
    var inputSocialExperienceElements = document.getElementsByClassName('checkbox-verif-socialexp');
      
    for(var i=0; inputSocialExperienceElements[i]; ++i){
        if(inputSocialExperienceElements[i].checked){
            checkedSocialExperienceValue = inputSocialExperienceElements[i].value;
            checkedSocialExperience.push(checkedSocialExperienceValue);
        }
    }
    if (checkedSocialExperience.length != null){
        var a = 0;
        for (var experience = 0; experience < checkedSocialExperience.length; experience++) {

            var checkedSocialExperienceValue  = checkedSocialExperience[experience];
            let farthestH               = -24000;
            let farthestW               = 0;
            let nearestH                = 0;
            let nearestW                = 0;
            let farthestArtboardH       = 0;
            let farthestArtboardW       = 0;
            let nearestArtboardH        = 0;
            let nearestArtboardW        = 0;
            let nextArtboardPosition    = 0;
            let artboardSpacing         = 70;
            let artboardVertSpacing     = 100;

            documentRoot.children.forEach(artboard => {
                farthestArtboardH = artboard.globalBounds.y + artboard.height;
                farthestArtboardW = artboard.globalBounds.x + artboard.width;
                nearestArtboardH = artboard.globalBounds.y;
                nearestArtboardW = artboard.globalBounds.x;

                if (farthestArtboardH >= farthestH) {
                    farthestH = farthestArtboardH;
                }
                if (farthestArtboardW >= farthestW) {
                    farthestW = farthestArtboardW;
                }
                if (nearestArtboardH <= nearestH) {
                    nearestH = nearestArtboardH;
                }
                if (nearestArtboardW <= nearestW) {
                    nearestW = nearestArtboardW;
                }
            });

            var socExpObject = getSocialExperience(socialJSON, checkedSocialExperienceValue);
            if( socExpObject !=null){
                var expDevSetting = socExpObject;
                var artBoardHeight = expDevSetting.height;
                var artBoardWidth = expDevSetting.width; 
                var artBoardName = expDevSetting.title;
                var newArt = new Artboard();
                newArt.name = ' ' +checkedSocialExperienceValue.charAt(0).toUpperCase() +  checkedSocialExperienceValue.substr(1, checkedSocialExperienceValue.indexOf("_"))  +artBoardName;
                newArt.width = artBoardWidth;
                newArt.height = artBoardHeight;
                newArt.fillEnabled = true;
                newArt.fill = new Color("white");
                newArt.focusedArtboard = true;
                documentRoot.addChild(newArt, 0);
                
                
                if(a>=1){              
                    newArt.moveInParentCoordinates(nextArtboardPosition, farthestH + artboardVertSpacing);
                    nextArtboardPosition = nextArtboardPosition + newArt.width + artboardSpacing;
                    viewport.zoomToRect(newArt);
                }
                else{
                    nextArtboardPosition = nearestW + newArt.width + artboardSpacing;
                    newArt.moveInParentCoordinates(nearestW, farthestH + artboardVertSpacing);
                    viewport.zoomToRect(newArt);
                }
                a++;
            }
        }
    }
};


function darwPages(json){
    lg(json);

    /*pagelist = json;

    function map(data) {
        let map = [];
        data.forEach(e => merge(map, split(e)));
        return map;
      }
      
      function split(href) { 
        let split = []; 
        var hrefURL = href.Url;
        console.log(hrefURL.split('/'));
        hrefURL.split('/')
          .filter(e => e.length > 0)
          .forEach(e => split.push(e));
        return split;
      }
      
      function merge(map, split) {
        let e = split[0];
        if (split.length === 1) {
          if (map.indexOf(e) === -1)
            map.push(e);
        } else {
          if (map.length === 0)
            map[0] = {};
          if (typeof map[0] !== 'object')
            map.unshift({});
          if (e in map[0] === false)
            map[0][e] = [];
          merge(map[0][e], split.slice(1));
        }
      }
     

    //let treeList = JSON.stringify(map(pagelist), null, 2);
    let treeList = map(pagelist);
    
    lg(treeList);

    function createNode(index){

        for (let level = 0; level < treeList.length; level++) {
            const treeNode = treeList[level];
            lg('Create Node');
            lg(treeNode);
        }
    }
    
    createNode(0);
    */
    
    $('#pageList > div').html('<ul></ul>');
    for (let i = 0; i < json.length; i++) {
        const page = json[i];
        lg(page.Url);
        $('#pageList > div ul').append(''+
                            '<label class="row">'+
                                '<input type="checkbox" value="pageindex-'+i+'" />'+
                                '<span>'+page.Url+'</span>'+
                            '</label>'+
        '');
    }
    
}


module.exports = {
    commands: {
        experienceGenerator: artBoardGen
    }
};