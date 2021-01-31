module.exports = {
    errorPopupContent: (title, message) => {
        return `
<style>
    form {
        width: 450px;
    }
    p {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
    }
    .row {
        align-items: center;
    }
    #changeExportPath {
        font-size: 12pt;
        color: grey;
        text-align: left;
    }
    label {
        margin-top: 10px;
    }
    .inline-button:hover {
        background: #e7e7e7;
    }
</style>

<form method="dialog">

<h1>${title}</h1>
<p>${message}</p>

<footer>
    <button id="cancel" autofocus>OK</button>
</footer>
</form>
        `
    }
}