let ourDialog;
function showEditTagDialog(tag, cancelFunction, okFunction, removeFunction) {

    let title = `Editing tag: '${tag}'`;
    let subject = `Provide new name for the tag:`;

    if (!ourDialog) {
        ourDialog = document.createElement("dialog");
        ourDialog.innerHTML = `
<style>
    form {
        width: 360px;
    }
    .h1 {
        align-items: center;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
    }
    .icon {
        border-radius: 4px;
        width: 24px;
        height: 24px;
        overflow: hidden;
    }

    .flex-container {
        display: flex;
        flex-direction: row;
      }
      
    .flex-container > .flex-item {
        flex: auto;
    }

    .flex-container > .raw-item {
        flex-grow: 1;
    }

</style>
<form method="dialog">
    <h1 class="h1">
        <span>${title}</span>
    </h1>
    <hr />
    <p>${subject}</p>
    <label>
        <input type="string" uxp-quiet="true" id="newTagName" value="" placeholder="${tag}"/>
    </label>
    <div class="flex-container">
        
    </div>
    <footer>
            <button id="editRemove" class="raw-item" uxp-variant="secondary">Remove</button>
            <button id="editCancel" class="raw-item" uxp-variant="primary">Cancel</button>
            <button id="editOk" class="raw-item" uxp-variant="cta">Ok</button>
    </footer>
</form>
        `;
        document.appendChild(ourDialog);

        let editCancel = document.querySelector("#editCancel");
        let editOk = document.querySelector("#editOk");
        let editRemove = document.querySelector("#editRemove");
        
        let newTagName = document.querySelector("#newTagName");

        function removeOurDialog() {
            document.removeChild(ourDialog);
            ourDialog = null;
        }

        editCancel.addEventListener("click"
        , e => {
            ourDialog.close("editCancel"); 
            removeOurDialog();
            cancelFunction();
        });
        
        editOk.addEventListener("click", e => {
            ourDialog.close("editOk");
            removeOurDialog();
            okFunction(newTagName.value);
        });

        editRemove.addEventListener("click", e => {
            ourDialog.close("editRemove");
            removeOurDialog();
            removeFunction();
        });
    }
    return ourDialog.showModal();
}

module.exports.showEditTagDialog = showEditTagDialog;