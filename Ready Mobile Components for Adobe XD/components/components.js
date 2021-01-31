//API Imports
const {Color, Shadow} = require('scenegraph');
const Command = require('commands');

//Custom Imports
const Utils = require('./utils');
const Scaler = require('./scaler');

//Color Constants
const WHITE = new Color('#FFFFFF');
const BLACK = new Color('#070707');
const GRAY = new Color('#F8F8F8');
const SHADOW_COLOR = new Color('#E1E1E1');
const AAA = new Color('#AAAAAA');
const DDD = new Color('#DDDDDD');
const FD = new Color('#FDFDFD');
const SHADOW = new Shadow(0, 3, 6, SHADOW_COLOR, true);


class Components{
    Components(){
        this.selection;
    }

    createTextField(selection, artboard){
        var Artboard = artboard;
        
        var textFieldContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 45, true, true, WHITE, null, "Text Field Container"]);
        textFieldContainer.moveInParentCoordinates(0, 0);
        textFieldContainer.stroke = AAA;
        textFieldContainer.setAllCornerRadii(10);
    
        var textFieldPlaceholder = Utils.createText(["Enter Something..", AAA, "center", 18]);
        textFieldPlaceholder.moveInParentCoordinates(textFieldContainer.globalBounds.x + 80, textFieldContainer.globalBounds.y + 29);
        
        Artboard.addChild(textFieldContainer);
        Artboard.addChildAfter(textFieldPlaceholder, textFieldContainer);
        
        this.createGroup(selection, [textFieldContainer, textFieldPlaceholder]);
        
    }
    
    createToggleButton(selection, artboard){
        
        var Artboard = artboard;
        
        var toggleButtonSlider = Utils.createRectangle([30, 10, true, false, AAA, null, "Toggle Button Slider"]);
        toggleButtonSlider.moveInParentCoordinates(0, 5);
        toggleButtonSlider.setAllCornerRadii(10);

        var toggleButtonEllipse = Utils.createEllipse([10, 10, true, false, DDD, null, "Toggle Button Ellipse"]);
        toggleButtonEllipse.moveInParentCoordinates((toggleButtonSlider.width/2), 0);
        
        Artboard.addChild(toggleButtonSlider);
        Artboard.addChildAfter(toggleButtonEllipse, toggleButtonSlider);   
        
        this.createGroup(selection, [toggleButtonEllipse, toggleButtonSlider]);
    }
    
    createButton(selection, artboard){
    
        var Artboard = artboard;
        
        var buttonContainer = Utils.createRectangle([110, 35, true, false, WHITE, SHADOW, "Button"]);
        buttonContainer.moveInParentCoordinates(0, 0);
        buttonContainer.setAllCornerRadii(5);

        var buttonText = Utils.createText(["Button", BLACK, "center", 16]);
        buttonText.moveInParentCoordinates(buttonContainer.globalBounds.x + 55, buttonContainer.globalBounds.y + 23);

        Artboard.addChild(buttonContainer);
        Artboard.addChildAfter(buttonText, buttonContainer);
        
        this.createGroup(selection, [buttonContainer, buttonText]);

        return([buttonContainer, buttonText]);
    }
    
    
    createHeader(artboard){
        //Creating the container
        var Artboard = artboard;
        var headerContainer = Utils.createRectangle([Artboard.width, 60, true, false, GRAY, SHADOW, "Header"]);

        headerContainer.moveInParentCoordinates(0, 0);

        Artboard.addChild(headerContainer);
        
        return headerContainer;
    }
    
    
    createListItem(selection, artboard){
        
        var Artboard = artboard;

        var notificationCardContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 75, true, false, WHITE, SHADOW, "Notification Card"]);
        notificationCardContainer.moveInParentCoordinates(0, 0);
        notificationCardContainer.setAllCornerRadii(10);
    
        var notificationText = Utils.createText(["This is a list card", BLACK, "center", 18]);
        notificationText.moveInParentCoordinates((Scaler.horizontallyCenter(notificationCardContainer.width, notificationText.globalBounds.width)+notificationText.globalBounds.width/2), notificationCardContainer.globalBounds.y + 44);

        Artboard.addChild(notificationCardContainer);
        Artboard.addChild(notificationText);

        this.createGroup(selection, [notificationCardContainer, notificationText]);
    }
    
    
    createListCard(selection, artboard){
        
        var Artboard = artboard;

        var itemCard = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 130, true, false, FD, null, "Card Item"]);
        itemCard.setAllCornerRadii(5);
        
        var imageContainer = Utils.createRectangle([115,130, true, false, GRAY, null, "Image Container"]);
        imageContainer.setAllCornerRadii(5);
    
        var cardHeading = Utils.createText(["CARD HEADING", BLACK, "center", 16]);
        cardHeading.moveInParentCoordinates(itemCard.globalBounds.x + 183, itemCard.globalBounds.y + 20);

        var cardDescription = Utils.createText(["This is some text.", BLACK, "center", 12]);
        cardDescription.moveInParentCoordinates(itemCard.globalBounds.x + 169, itemCard.globalBounds.y + 40);
        
        var buttonContainer = Utils.createRectangle([110, 35, true, false, WHITE, SHADOW, "Button"]);
        buttonContainer.moveInParentCoordinates(itemCard.globalBounds.width - buttonContainer.width - 10, itemCard.globalBounds.y + 80);
        buttonContainer.setAllCornerRadii(5);

        var buttonText = Utils.createText(["Button", BLACK, "center", 16]);
        buttonText.moveInParentCoordinates(buttonContainer.globalBounds.x + 55, buttonContainer.globalBounds.y + 23);

        Artboard.addChild(itemCard);
        Artboard.addChildAfter(cardHeading, itemCard);
        Artboard.addChildAfter(cardDescription, itemCard);
        Artboard.addChildAfter(buttonText, itemCard);
        Artboard.addChildAfter(imageContainer, itemCard);
        Artboard.addChildAfter(buttonContainer, itemCard);

        this.createGroup(selection, [itemCard, imageContainer, cardHeading, cardDescription, buttonContainer, buttonText]);
        //Card Item.
    }
    
    createFooter(selection, artboard){
        var Artboard = artboard;
        
        var footerContainer = Utils.createRectangle([Artboard.width, 60, true, false, WHITE, SHADOW, "Footer Container"]);
        footerContainer.moveInParentCoordinates(0, Artboard.height - 60);

        var firstOption = Utils.createRectangle([(footerContainer.width / 3), 60, true, false, GRAY, null, "Option one"]);
        firstOption.moveInParentCoordinates(footerContainer.globalBounds.x, footerContainer.globalBounds.y);
    
        var secondOption = Utils.createRectangle([(footerContainer.width / 3), 60, true, false, AAA, null, "Option two"]);
        secondOption.moveInParentCoordinates(footerContainer.globalBounds.x + secondOption.globalBounds.width, footerContainer.globalBounds.y);

        var thirdOption = Utils.createRectangle([(footerContainer.width / 3), 60, true, false, DDD, null, "Option three"]);
        thirdOption.moveInParentCoordinates(secondOption.globalBounds.x + thirdOption.globalBounds.width, footerContainer.globalBounds.y);

        Artboard.addChild(footerContainer);
        Artboard.addChildAfter(firstOption, footerContainer);
        Artboard.addChildAfter(secondOption, footerContainer);
        Artboard.addChildAfter(thirdOption, footerContainer);


        this.createGroup(selection, [footerContainer, firstOption, secondOption, thirdOption]);
    }
    
    createAccordion(selection, artboard){
        var Artboard = artboard;

        var caccordionContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 60, true, false, WHITE, SHADOW, "Accordion Container"]);
        caccordionContainer.setAllCornerRadii(10);
        
        var accordionText = Utils.createText(["Collapsed Accordion", BLACK, "center", 16]);
        accordionText.moveInParentCoordinates(caccordionContainer.globalBounds.x+accordionText.localBounds.width-54, caccordionContainer.globalBounds.y+accordionText.globalBounds.height+18);
        
        var caret = Utils.createPolygon([20, 15, 3, 1, SHADOW_COLOR, "Caret"]);
        caret.rotateAround(180 - caret.rotation, caret.localCenterPoint);
        caret.moveInParentCoordinates(caccordionContainer.width - caret.width - 17, 23);
    
        //Expanded
        var eaccordionContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 190, true, false, WHITE, SHADOW, "Accordion Container"]);
        eaccordionContainer.setAllCornerRadii(10);
        eaccordionContainer.moveInParentCoordinates(caccordionContainer.globalBounds.x, caccordionContainer.globalBounds.y+caccordionContainer.globalBounds.height+10);
        
        var eaccordionText = Utils.createText(["Expanded Accordion", BLACK, "center", 16]);
        eaccordionText.moveInParentCoordinates(eaccordionContainer.globalBounds.x+eaccordionText.localBounds.width-54, eaccordionContainer.globalBounds.y+eaccordionText.globalBounds.height+18);
        
        var dummyText = Utils.createText(["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor", BLACK, "left", 14]);
        dummyText.moveInParentCoordinates(eaccordionContainer.globalBounds.x+20,eaccordionContainer.globalBounds.y+78);
        dummyText.areaBox = {width:Scaler.scaleWidth(eaccordionContainer.width, 0.90), height:120};
    
        var ecaret = Utils.createPolygon([20, 15, 3, 1, SHADOW_COLOR, "Caret"]);
        // ecaret.rotateAround(180 - caret.rotation, caret.localCenterPoint);
        ecaret.moveInParentCoordinates(eaccordionContainer.width - caret.width - 17,eaccordionContainer.globalBounds.y+20);
    
        var eline = Utils.createLine([[eaccordionContainer.globalBounds.x, eaccordionContainer.globalBounds.y+54, eaccordionContainer.globalBounds.width, eaccordionContainer.globalBounds.y+54], true, SHADOW_COLOR]);
        
        // Artboard = selection.items[0];
        Artboard.addChild(caccordionContainer);
        Artboard.addChildAfter(accordionText, caccordionContainer);
        Artboard.addChildAfter(caret, caccordionContainer);
        Artboard.addChildAfter(eaccordionContainer, caccordionContainer);
        Artboard.addChildAfter(eaccordionText, eaccordionContainer);
        Artboard.addChildAfter(dummyText, eaccordionContainer);
        Artboard.addChildAfter(ecaret, eaccordionContainer);
        Artboard.addChildAfter(eline, eaccordionContainer);
        
        this.createGroup(selection, [caccordionContainer, accordionText, caret]);
        this.createGroup(selection, [eaccordionContainer, eaccordionText, dummyText, ecaret, eline]);
    }
    
    createIconBox(selection, artboard){
        var Artboard = artboard;
        
        var iconBox = Utils.createRectangle([45, 55, true, true, WHITE, null, "Icon box"]);
        iconBox.stroke = BLACK;
        iconBox.moveInParentCoordinates(0, 0);

        var iconContainer = Utils.createRectangle([25, 25, true, true, WHITE, null, "Icon Container"]);
        iconContainer.stroke = BLACK;
        iconContainer.moveInParentCoordinates(iconBox.localBounds.x + 10, iconBox.localBounds.y + 5);
        
        var iconText = Utils.createText(["Name", BLACK, "center", 14]);
        iconText.moveInParentCoordinates(iconBox.localBounds.x + 22, iconBox.localBounds.y + iconText.localBounds.height + 32); 
    
        Artboard.addChild(iconBox);
        Artboard.addChildAfter(iconContainer, iconBox);
        Artboard.addChildAfter(iconText, iconBox);
        
        this.createGroup(selection, [iconBox, iconContainer, iconText]);
    }
    
    
    createForm(selection, artboard){
        //Textfields
        
        var Artboard = artboard;
        
        var emailField = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 45, true, true, WHITE, null, "Text Field Container"]);
        emailField.moveInParentCoordinates(15, 345);
        emailField.stroke = AAA;
        emailField.setAllCornerRadii(10);
    
        var emailFieldPlaceholder = Utils.createText(["Enter email", AAA, "center", 18]);
        emailFieldPlaceholder.moveInParentCoordinates(emailField.globalBounds.x + 63, emailField.globalBounds.y + 29);
        
        var passwordField = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.92), 45, true, true, WHITE, null, "Text Field Container"]);
        passwordField.moveInParentCoordinates(15, 345);
        passwordField.stroke = AAA;
        passwordField.setAllCornerRadii(10);
        passwordField.moveInParentCoordinates(0,emailField.localBounds.height+20);
    
        var passwordPlaceholder = Utils.createText(["Enter password", AAA, "center", 18]);
        passwordPlaceholder.moveInParentCoordinates(passwordField.globalBounds.x + 80, passwordField.globalBounds.y + 29);
        
        //Buttons
        
        //LOGIN
        var loginButton= Utils.createRectangle([Scaler.scaleWidth(passwordField.width, 0.475), 40, true, false, WHITE, SHADOW, "Button"]);
        loginButton.setAllCornerRadii(5);
        loginButton.moveInParentCoordinates(passwordField.globalBounds.x, passwordField.globalBounds.y+70);
        
        var loginButtonText = Utils.createText(["Log In", BLACK, "center", 16]);
        loginButtonText.moveInParentCoordinates(Scaler.horizontallyCenter(loginButton.width, loginButtonText.globalBounds.width)+loginButton.globalBounds.x + (loginButtonText.globalBounds.width/2), loginButton.globalBounds.y + 26);

        // loginButtonText.moveInParentCoordinates(loginButton.globalBounds.x + 78, loginButton.globalBounds.y + 26);
        //LOGIN
        
        //SIGN UP
        var signupButton= Utils.createRectangle([Scaler.scaleWidth(passwordField.width, 0.475), 40, true, false, WHITE, SHADOW, "Button"]);
        signupButton.setAllCornerRadii(5);
        signupButton.moveInParentCoordinates((passwordField.width - signupButton.width) + 15, loginButton.globalBounds.y);
        
        var signupButtonText = Utils.createText(["Sign Up", BLACK, "center", 16]);
        signupButtonText.moveInParentCoordinates(Scaler.horizontallyCenter(signupButton.width, signupButtonText.globalBounds.width)+signupButton.globalBounds.x + (signupButtonText.globalBounds.width/2), signupButton.globalBounds.y + 26);
        //SIGN UP
       
        
        Artboard.addChild(emailField);
        Artboard.addChildAfter(emailFieldPlaceholder, emailField);
        Artboard.addChild(passwordField);
        Artboard.addChildAfter(passwordPlaceholder, passwordField);
        
        //Buttons
        Artboard.addChildAfter(loginButton, passwordField);
        Artboard.addChildAfter(loginButtonText, loginButton);
        
        Artboard.addChildAfter(signupButton, loginButton);
        Artboard.addChildAfter(signupButtonText, signupButton);
        
        this.createGroup(selection, [emailField, emailFieldPlaceholder]);
        this.createGroup(selection, [passwordField, passwordPlaceholder]);
        this.createGroup(selection, [loginButton, loginButtonText]);
        this.createGroup(selection, [signupButton, signupButtonText]);
    }
    
    createSidebar(selection, artboard){
        
        var Artboard = artboard;
        
        var opaqueContainer = Utils.createRectangle([Artboard.width, Artboard.height, true, false, WHITE, null, "Opaque Container"]);
        opaqueContainer.opacity = 0.4;
        
        var sidebarContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.5), Artboard.height, true, false, WHITE, null, "Sidebar Container"]);
        
        var profileContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.5), 140, true, true, WHITE, null, "Profile Container"]);
        profileContainer.stroke = BLACK;
        
        var firstOption = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.5), 50, true, true, WHITE, null, "FirstOption"]);
        firstOption.stroke = BLACK;
        firstOption.moveInParentCoordinates(0, profileContainer.localBounds.height);
        
        Artboard.addChild(opaqueContainer);
        Artboard.addChildAfter(sidebarContainer, opaqueContainer);
        Artboard.addChildAfter(profileContainer, sidebarContainer);
        Artboard.addChildAfter(firstOption, profileContainer);
        var i = 0, ycordinate = 0;
        for(i=0; i<Math.floor((Artboard.height - 190)/50); i++){
            var optionContainer = Utils.createRectangle([Scaler.scaleWidth(Artboard.width, 0.5), 50, true, true, WHITE, null, "Option"]);
            optionContainer.stroke = BLACK;
            Artboard.addChildAfter(optionContainer, firstOption);
            ycordinate = ycordinate + optionContainer.localBounds.height;
            if(i==0){
                ycordinate = ycordinate + 140;
            }
            optionContainer.moveInParentCoordinates(0,ycordinate);
        }
    }  
    createGroup(selection, args){
        selection.items = args;
        Command.group();
        selection.items = [];
    }
}
let object = new Components();
module.exports = object;