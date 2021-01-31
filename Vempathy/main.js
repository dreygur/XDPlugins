
/**
* Shorthand for creating Elements.
* @param {*} tag The tag name of the element.
* @param {*} [props] Optional props.
* @param {*} children Child elements or strings
*/
let cloud = require("cloud");
function h(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        }
        else {
            for (let name in props) {
                let value = props[name];
                if (name == "style") {
                    Object.assign(element.style, value);
                }
                else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}
const publicUrl = "https://app.vempathy.com";
let dialog;
let stepVempathyCount = 1;

function createMenuCommandDialog() {
    function onNextVempathy(count) {
        if(count == 4) {
            stepVempathyCount = 4;
        } else {
            stepVempathyCount++;   
        }  
        if(stepVempathyCount == 4) {
            cancel.style.display = "block";
            goSubmit.style.display = "block";
            vempathyForm.style.display = "block";
            changingImage.src = "images/intro-vempathy-xd.png";
            changingImage.style.width = "100%";            
            vempathyNext.style.display = "none";
            skip.style.display = "none";
            goNext.style.display = "none";
        } else if(stepVempathyCount == 3) {
            stepHead.innerHTML = `See the emotional feedback on a severity scale`;
            stepDesc.innerHTML = `Each task will have a severity score from Minor to Catastrophic so you know where to best improve your design`;
            changingImage.src = "images/form-3.png";      
            changingImage.style.width = "100%";
         
        } else if(stepVempathyCount == 2 ) {
            stepHead.innerHTML = `Select the right attributes to get the right test participants`;
            stepDesc.innerHTML = `Select up to 5 different criteria to filter your test participants. Categories range from gender, age, operating system and more!`;
            changingImage.src = "images/form-2.png";
            changingImage.style.width = "100%";
           
        } else {
                closeDialog();
        }
     }
        function onsubmit(e) {
            let projectNameAttr = encodeURIComponent(projectName.value);
            let projectUrlAttr = encodeURIComponent(projectUrl);
            let projectMsgAttr = encodeURIComponent(projectMsg.value);
            let promocode = encodeURIComponent("ADOBE_XD_PLUGIN_NO_CC");
            if(projectNameAttr && projectUrlAttr && projectMsgAttr && projectUrlAttr !== "undefined" ) {
                projectErrorMsg.value = "";     
                stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=NewProjectForm&ea=Submit&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
                require("uxp").shell.openExternal(`${publicUrl}/signup?project_name=${projectNameAttr}&project_url=${projectUrlAttr}&project_msg=${projectMsgAttr}&promo_code=${promocode}`);
                projectName.value = "";
                projectUrl.value = "";
                projectMsg.value = "";
                submited = true;
                projectErrorMsg.style.display = "none";     

            } else {
                projectErrorMsg.style.display = "block";     
            }
        }

        function closeDialog() {
            if(!submited) {
                stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=NewProjectForm&ea=Close&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
            }
            stepVempathyCount = 1;
            dialog.close("Cancelled")
         }

         function fielddata(type) {
            stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=NewProjectForm&ea=${type}&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;            
         }
         function changeproject(index) {
            let artifact = prototypes[index]
            projectName.value = artifact.name
            projectUrl = artifact.url;
        }
        // Get prototypes data
        var sharedArtifacts = cloud.getSharedArtifacts();
        var prototypes = sharedArtifacts.filter(artifact => (artifact.type === cloud.ArtifactType.PROTOTYPE));
        let projectName ,formHead ,progressButtons, vempathyNext, stepDesc, stepHead, cancel, goSubmit, vempathyForm, goNext, skip , changingImage, projectUrl, projectDropdown, projectMsg, projectErrorMsg, stepEventImage, submited = false;
        dialog =
            h("dialog",
                h("form", { style: { width: 900}, onsubmit },
                        h("div", { class: "row" },
                            h("div", {style:{width:"80%"},  class: "row"},
                            formHead = h("h1", {style:{}}, "Set Up Your Test"), 
                            
                        ),
                            
                        h("img",  {src:"https://ssl.google-analytics.com/collect?v=1&t=event&ec=NewProjectForm&ea=Open&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/", height:"0"  }),                        
                        stepEventImage = h("img", {height:"0"   }),   
                        h("img",  {src:"images/logo.png", height:"30"  }),
                    ),
                    h("hr", { style: { marginBottom: 40 } }),
                    h("div", { class: "row" },
                    vempathyForm = h( "col",  {style: { width: "50%" }}, 
                        h("label",
                            h("span", "Select Prototype"),                            
                            projectDropdown =  prototypes.length === 0 ?  h("span",{style:{color:"red", background:"#ececec", padding:"3px"} },  `Please share a prototype first...` ) 
                            : h("select", {onchange(e) { changeproject(this.selectedIndex) }, id:"projectDropdown" },
                                ...prototypes.map( artifact => h("option",{ selected: true, value:`${artifact.url }`}, `${artifact.name}`) )
                            )
                            
                        ),
                        h("label",
                            h("span", "Project Name"),
                            projectName = h("input", {value: "", placeholder: "Name of Project", onchange: fielddata("EditName")  })
                        ),
                        h("label",
                            h("span", "Welcome Message"),
                            projectMsg = h("textarea", {value: "", placeholder: "Welcome to this test...", onchange: fielddata("EditWelcomeMessage") , style: { height: 100 } } )
                        ),
                    ),
                    vempathyNext = h( "col",  {style: { width: "50%" }}, 
                        stepHead = h("h2", {style:{}}, "Get feedback on your design!"),
                        stepDesc = h("p", {style:{color: "#707070", marginTop:"30px", fontSize:"14px"}}, "With the Vempathy XD Plugin you will publish your prototype to Adobe’s Creative Cloud and share this link with Vempathy."),
                    ),
                        h( "col", {style: { width: "50%", alignItems:"center", textAlign:"center" }},
                        h("label", {style: { alignItems:"center", textAlign:"center" }},
                        //   changingImage =  h("img",  {src:"images/intro-vempathy-xd.png", height:"240px"  }),
                          changingImage =  h("img",  {src:"images/form-1.png", height:"240px", style:{width:"250px"}  }),

                        ),
                        ),
                    ),                    
                    projectErrorMsg = h("div",  { style: {fontSize:"12px",marginLeft:"20px", width:"50%", color:"red", display:"none"} },
                        h("span", "Please complete the form" )

                    ),
                    h("footer",                       
                        skip =  h("button", { uxpVariant: "primary", uxpQuiet:true, onclick(e) { onNextVempathy(4) } }, "Skip This"),                        
                        goNext = h("button", { uxpVariant: "cta", type:"button", onclick(e) { onNextVempathy(); e.preventDefault(); } }, "Next"),
                        
                        cancel =  h("button", { uxpVariant: "primary", onclick(e) { closeDialog() } }, "Cancel"),  
                        goSubmit = h("button", { uxpVariant: "cta", type:"submit", onclick(e) { onsubmit(); e.preventDefault(); } }, "Send to Vempathy")
                        
                    )
                )
            )
            if(prototypes.length !== 0) {
                projectDropdown.value = prototypes[0].url;
                projectUrl = prototypes[0].url;
                projectName.value = prototypes[0].name;
            }

            if(stepVempathyCount == 1) {
                cancel.style.display = "none";
                goSubmit.style.display = "none";

                vempathyForm.style.display = "none";
            }
    return dialog;
}


let stepCount = 1;
function createUseCommandDialog() {
         function onsubmitVempathy(type) {
            if(type == "next" ) {
                stepCount++;
            } else {
                stepCount--;
            }
            if(stepCount == 3) {
                goStep.innerHTML = `Done`;
                stepContent.innerHTML = `Fill out the remaining fields and send to Vempathy`;
                stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=Tutorial&ea=View${stepCount}&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
                stepImage.src = `images/step-${stepCount}.gif`;
                goBack.innerHTML = `Back`;
                stepContent.innerHTML = `Update the project name, provide a welcome message, and click "Send to Vempathy"`;
            } else if(stepCount == 1 || stepCount == 2 ) {
                goStep.innerHTML = `Go to Step ${stepCount+1}`;
                goBack.innerHTML = `Back`;
                // When a user opens different steps in the "How to use this plugin?" dialog, where X is an integer for the step #:</img>
                stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=Tutorial&ea=View${stepCount}&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
                stepImage.src = `images/step-${stepCount}.gif`;
                if(stepCount == 1) {   
                    goBack.innerHTML = `Cancel`;
                    stepContent.innerHTML = `Share your prototype for review, be sure to give it a name and click "Create Public Link"`;
                } else {
                    stepContent.innerHTML = `Navigate to the Vempathy plugin and select which prototype from the dropdown`;
                }
                 
                
            } else {
                    closeDialog();
            }
         }
         function closeDialog() {
             // When a user closes the "How to use this plugin?" dialog, where X is an integer for the step #:</img>           
            stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=Tutorial&ea=Close${stepCount}&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
            stepCount = 1;
            dialog.close("Cancelled")
         }
        
        let goStep, stepContent, stepImage, goBack, stepEventImage;
       
        dialog =
            h("dialog",
                h("form", { style: { width: 500 }, onsubmitVempathy },
                    
                    h("div", { class: "row" },
                        h("h1", {style:{ width: "80%" }}, `How To Use This Plugin?`),
                        h("img",  {src:"https://ssl.google-analytics.com/collect?v=1&t=event&ec=Tutorial&ea=Open&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/", height:"0"  }),
                        stepEventImage = h("img", {height:"0"   }),                        
                        h("img",  {src:"images/logo.png", height:"30"  }),
                    ),
                    h("hr", { style: { marginBottom: 10 } }),
                  
                    
                    h("div", 
                        h("label", 
                            stepImage = h("img", {src:`images/step-${stepCount}.gif`, width: "500px", height:"270px"   }),
                        ), 
                        h("label", {style: {background:"#368dfd", textAlign:"center", padding: "11px 0"}}, 
                            stepContent = h("span", {style:{color:"white",  fontSize:"14px"}}),
                        ),
                    ),
                    h("footer",   
                        goBack = h("button", { uxpVariant: "primary", onclick(e) { onsubmitVempathy("back"); e.preventDefault(); } }, "Cancel"),
                        goStep = h("button", { uxpVariant: "cta", type:"submit", onclick(e) { onsubmitVempathy("next"); e.preventDefault(); }})
                     ),
                   
                )
            )
            goStep.innerHTML = "Go to Step 2"
            if( stepCount == 1) {
                stepEventImage.src = `https://ssl.google-analytics.com/collect?v=1&t=event&ec=Tutorial&ea=View${stepCount}&t=event&tid=UA-106096092-6&z=1544105574&cid=02e3d408-3503-9a03-c792-a56766768417&dt=PAGETITLE&dp=/xd/`;
                stepContent.innerHTML = `Share your prototype for review, be sure to give it a name and click "Create Public Link"`;
            }
    return dialog;
}
    



module.exports = {
    commands: {
        menuCommand: function () {
            document.body.appendChild(createMenuCommandDialog()).showModal();     
            
            document.onload = function(){    
                    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
                    analytics.load("ZdBWSV160KAUbsU2ryOBoFDWCIlpnQI4");
                    analytics.page();
                }}();
                console.log('New Project - Open');
                // When a user opens the new project form dialog:
                analytics.track('New Project - Open');
            };
        },
        useCommand: function () {
            document.body.appendChild(createUseCommandDialog()).showModal()
        },
        
    }
};