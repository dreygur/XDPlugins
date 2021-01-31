/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

class errorHelper {
    static async showErrorDialog(title, message) {


        // Removing old instances
        document.body.innerHTML = '';

        const dialog = document.createElement('dialog');
        dialog.id = 'loremErrorModal';
        dialog.innerHTML = `
    <style>    
    
    form {
        width: 360px;
    }
    
    header {
        background: #2D4E64;
        height: 16px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
    
    </style>
    `;

        const form = document.createElement('form');
        form.method = 'dialog';

        form.appendChild(document.createElement('header'));


        const heading = document.createElement('h1');
        heading.innerHTML = title;
        form.appendChild(heading);

        const description = document.createElement('p');
        description.innerHTML = message;
        form.appendChild(description);

        const footer = document.createElement('footer');
        const btnOk = document.createElement('button');
        btnOk.id = "ok";
        btnOk.type = "submit";
        btnOk.innerHTML = 'Ok';
        btnOk.setAttribute('uxp-variant', 'cta');
        btnOk.onclick = () => {
            dialog.close(true);
            document.body.innerHTML = '';
        };
        footer.appendChild(btnOk);
        form.appendChild(footer);
        dialog.appendChild(form);
        document.body.appendChild(dialog);

        return await dialog.showModal();
    }
}


module.exports = errorHelper;