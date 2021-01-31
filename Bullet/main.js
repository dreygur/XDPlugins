const commands = require("commands");
const { alert } = require("./lib/dialogs.js");

								 
function makeRoundBullets(selection) { 

    let targetItem = selection.items[0];	
	if (selection.items.length !==0 && targetItem.constructor.name== "Text"){
        
			for(let i = 0; i < selection.items.length; i++)
			{
               
				let string = selection.items[i].text;
                let lines = string.split("\n");
                
                selection.items[i].text = ' ';
                lines.forEach(oneLine => {
     
                
                   if (oneLine!= "")
                      {   
                        let newLine = `\u2022 \u0020 ${oneLine}\n`;
                        selection.items[i].text += newLine;
                      }
                    
                });
                selection.items[i].text = selection.items[i].text.substr(1);
			}
				
		}
		
		else{
			
		showAlert('Please select a text layer.');	
		
		}
}
function makeSquareBullets(selection) { 
let targetItem = selection.items[0];	
	if (selection.items.length !==0 && targetItem.constructor.name== "Text"){
			for(let i = 0; i < selection.items.length; i++)
			{
				let string = selection.items[i].text;
                let lines = string.split("\n");
                
                selection.items[i].text = ' ';
                lines.forEach(oneLine => {
     
                
                   if (oneLine!= "")
                      {   
                        let newLine = `\u25AA  \u0020 ${oneLine}\n`;
                        selection.items[i].text += newLine;
                      }
                    
                });
                selection.items[i].text = selection.items[i].text.substr(1);
			}
				
		}
		
		else{
			
		showAlert('Please select a text layer.');	
		
		}
}

function makeNumberBullets(selection) { 
let targetItem = selection.items[0];	

	if (selection.items.length !==0 && targetItem.constructor.name== "Text"){
        let count = 1;
			for(let i = 0; i < selection.items.length; i++)
			{
				let string = selection.items[i].text;
                let lines = string.split("\n");
                
                selection.items[i].text = ' ';
                lines.forEach(oneLine => {
     
                
                   if (oneLine!= "")
                      {   
                        let newLine = count + "-  " + oneLine + "\n";
				        count++;
                        selection.items[i].text += newLine;
                      }
                    
                });
                selection.items[i].text = selection.items[i].text.substr(1);
			}
				
		}
		
		else{
			
		showAlert('Please select a text layer(s).');	
		
		}
}

function showAlert(message){
	
	alert(message);
}

module.exports = {
    commands: {
        makeSquareBullets,
		makeRoundBullets,
		makeNumberBullets
    }
};

