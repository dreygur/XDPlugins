//API Imports
const Scenegraph = require('scenegraph');
const Command = require('commands');

//Custom Imports
const Components = require('../components/components');

class Events{

    constructor(document, selection, artboards){
        this.art = new Array();
        this.art = artboards;
        this.selection = selection;
        this.document = document;
        this.closeBtn = document.getElementById("close-btn");
        this.button = document.getElementById("button");
        this.textfield = document.getElementById("textfield");
        this.toggle = document.getElementById("toggle-button");
        this.header = document.getElementById("navigation-header");
        this.lcard = document.getElementById("list-card");
        this.icard = document.getElementById("list-image-card");
        this.footer = document.getElementById("footer");
        this.accordion = document.getElementById("accordion");
        this.iconBox = document.getElementById("icon-box");
        this.login = document.getElementById("login-form");
        this.sidebar = document.getElementById("sidebar");
    }

    bindEvents(){
        this.closeBtn.addEventListener("click", this.closeClicked);
        this.button.addEventListener("click", this.buttonClicked.bind(this));
        this.textfield.addEventListener("click", this.textfieldClicked.bind(this));
        this.toggle.addEventListener("click", this.toggleClicked.bind(this));
        this.header.addEventListener("click", this.headerClicked.bind(this));
        this.lcard.addEventListener("click", this.lcardClicked.bind(this));
        this.icard.addEventListener("click", this.icardClicked.bind(this));
        this.footer.addEventListener("click", this.footerClicked.bind(this));
        this.accordion.addEventListener("click", this.accordionClicked.bind(this));
        this.iconBox.addEventListener("click", this.iconboxClicked.bind(this));
        this.login.addEventListener("click", this.loginClicked.bind(this));
        this.sidebar.addEventListener("click", this.sidebarClicked.bind(this));
    }

    /****EVENT HANDLERS****/
    closeClicked(e){
        document.getElementById("dialog").close();
    }

    textfieldClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let tf = Components.createTextField(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    toggleClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let tb = Components.createToggleButton(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    buttonClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let btn = Components.createButton(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    headerClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let header = Components.createHeader(this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    lcardClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let ncard = Components.createListItem(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    icardClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let icard = Components.createListCard(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    footerClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            let footer = Components.createFooter(this.selection, this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    accordionClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            Components.createAccordion(this.selection,this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    iconboxClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            Components.createIconBox(this.selection,this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    loginClicked(e){
        try{
            let index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            Components.createForm(this.selection,this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    sidebarClicked(e){
        let index;
        try{
            index = this.getSelectedIndex();
            this.checkForartboard(index, document);
            Components.createSidebar(this.selection,this.art[index]);
            this.showToastr("success", "Component Added successfully!");
        }
        catch(e){
            if(index != -1){
                this.showToastr("failure", "Some error occured! Please contact developer.");
            }
        }
    }

    /*******HELPERS********/
    checkForartboard(index){
        if(index == -1){
            this.showToastr("failure", "Please select artboard!");
        }
    }

    showToastr(type, message){
        this.document.getElementById("snackbar").style.display = "block";
        this.document.getElementById("snackbar").innerHTML = message;
        this.document.getElementById("snackbar").className = type;
        setTimeout( 
            () => { 
                this.document.getElementById("snackbar").style.display = "none";
                this.document.getElementById("snackbar").style.background = "";
            }
        , 2000);
    }

    getSelectedIndex(){
        let value = document.getElementById("options").selectedIndex;
        return value;
    }
    /*******HELPERS********/
}
module.exports = Events;

