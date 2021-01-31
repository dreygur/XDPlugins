module.exports = {
    changeWindow: `
<style>
    form {
        width: 450px;
    }
    .row {
        align-items: center;
    }

    label {
        margin-top: 3px;
    }

    span {
        width: 100%;
    }
    
</style>

<form method="dialog">
<div width="38%">
    <svg class="respresso-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240.93 74.2">
    <defs><linearGradient id="gradient" y1="-744.49" x2="66" y2="-744.49" gradientTransform="matrix(1, 0, 0, -1, 0, -687.39)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#20d497"/><stop offset="1" stop-color="#007349"/></linearGradient></defs>
    <title>respresso-logo</title>
    <path d="M51,40.6a2.69,2.69,0,0,1-2.7-2.7,2.92,2.92,0,0,1,.2-.9l-8-8v6.5A2.79,2.79,0,0,1,42,37.9a2.7,2.7,0,0,1-5.4,0,2.56,2.56,0,0,1,1.5-2.4V28.6a2.67,2.67,0,0,1-1.5-2.4,2.92,2.92,0,0,1,.2-.9l-8-8V35.5a2.79,2.79,0,0,1,1.5,2.4,2.7,2.7,0,0,1-5.4,0,1.7,1.7,0,0,1,.1-.7L16.5,30a2,2,0,0,1-1.1.2,3.59,3.59,0,0,1-1.1-.2L5.8,37.2a1.48,1.48,0,0,1,.1.7,2.7,2.7,0,1,1-2.7-2.7,3.59,3.59,0,0,1,1.1.2l8.5-7.2a1.7,1.7,0,0,1-.1-.7,2.56,2.56,0,0,1,1.5-2.4V16.8a2.69,2.69,0,0,1,1.2-5.1,2.92,2.92,0,0,1,.9.2L25,3.5a2.49,2.49,0,0,1-.1-.8,2.7,2.7,0,0,1,5.4,0,2.56,2.56,0,0,1-1.5,2.4V12a2.79,2.79,0,0,1,1.5,2.4,2.92,2.92,0,0,1-.2.9l8.3,8.3a2.92,2.92,0,0,1,.9-.2A2.69,2.69,0,0,1,42,26.1a2.92,2.92,0,0,1-.2.9l8.3,8.3a2.92,2.92,0,0,1,.9-.2,2.69,2.69,0,0,1,2.7,2.7A2.65,2.65,0,0,1,51,40.6ZM26.3,35.3V16.7a2.67,2.67,0,0,1-1.5-2.4,2.56,2.56,0,0,1,1.5-2.4V5.4l-8.5,8.2a2.49,2.49,0,0,1,.1.8,2.56,2.56,0,0,1-1.5,2.4v8.3a2.67,2.67,0,0,1,1.5,2.4,1.7,1.7,0,0,1-.1.7Z" fill="#1d1333"/>
    <path d="M65,44.4a3.54,3.54,0,0,0-2.6-1H1.4A1.45,1.45,0,0,0,0,44.9a19.48,19.48,0,0,0,.2,2.5H16.7a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3H.6a16,16,0,0,0,.5,2.1H17.6a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3H1.7c.3.6.6,1.3.9,2H19.1a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3H3.5c.4.7.9,1.4,1.3,2.1H21.1a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3H6.1c.6.7,1.2,1.3,1.8,2,.1,0,.1.1.2.1h16a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3h-14a27.3,27.3,0,0,0,3,2.1H28.4a.9.9,0,0,1,.9.9.71.71,0,0,1-.3.6.86.86,0,0,1-.6.3H16.6a27.91,27.91,0,0,0,10.9,2.2A44.61,44.61,0,0,0,65,50.3c.1-.1.2-.3.3-.4h0a5.74,5.74,0,0,0,.8-2.9A4.16,4.16,0,0,0,65,44.4Zm-4.4,5.1A41.9,41.9,0,0,1,50,59.9c-.1,0-.1.1-.2.1a.3.3,0,0,1-.2-.5,28.65,28.65,0,0,0,4.8-11,1.32,1.32,0,0,1,1.4-1.1h3.7A1.3,1.3,0,0,1,60.6,49.5Z" fill="#20d497"/>
    <path d="M240.3,55.2a8.3,8.3,0,0,0-1.8-3,9.23,9.23,0,0,0-2.8-1.9,10.6,10.6,0,0,0-3.7-.7,8.73,8.73,0,0,0-3.7.7,8.12,8.12,0,0,0-2.9,1.9,7.53,7.53,0,0,0-1.8,3,13,13,0,0,0,0,7.8,8.88,8.88,0,0,0,1.8,3,8.6,8.6,0,0,0,2.9,1.9,11.06,11.06,0,0,0,3.7.7,8.73,8.73,0,0,0,3.7-.7,7,7,0,0,0,2.8-1.9,7.53,7.53,0,0,0,1.8-3,12.26,12.26,0,0,0,.6-3.9A8.44,8.44,0,0,0,240.3,55.2Zm-5,8.4a4.6,4.6,0,0,1-6.8,0,7.84,7.84,0,0,1-1.1-4.5,7.84,7.84,0,0,1,1.1-4.5,4,4,0,0,1,3.4-1.6,4.06,4.06,0,0,1,3.4,1.5,7.84,7.84,0,0,1,1.1,4.5C236.4,61.1,236.1,62.6,235.3,63.6Zm-15.1-3a7.1,7.1,0,0,0-1-1.4,4.19,4.19,0,0,0-1.4-.9,10.41,10.41,0,0,0-1.6-.6,9.83,9.83,0,0,0-1.6-.5c-.5-.2-1-.3-1.4-.5a2.55,2.55,0,0,1-1-.7,1.28,1.28,0,0,1-.4-1,1.75,1.75,0,0,1,.7-1.4,3.15,3.15,0,0,1,2-.5,6.8,6.8,0,0,1,1.5.2c.4.1.8.3,1.1.4a5.9,5.9,0,0,0,.8.4,1.85,1.85,0,0,0,.7.2.75.75,0,0,0,.5-.1c.1-.1.3-.2.4-.4l1-1.6a7.6,7.6,0,0,0-2.6-1.6,9.6,9.6,0,0,0-6.4-.1,6.6,6.6,0,0,0-2.2,1.2,4.63,4.63,0,0,0-1.3,1.8,5.22,5.22,0,0,0-.4,2.1,4.64,4.64,0,0,0,.4,2.1,3.88,3.88,0,0,0,1,1.4,7.1,7.1,0,0,0,1.4,1,8.65,8.65,0,0,0,1.7.7,14.24,14.24,0,0,0,1.6.5c.5.2,1,.3,1.4.5a2.55,2.55,0,0,1,1,.7,1.37,1.37,0,0,1,.4,1.1,1.88,1.88,0,0,1-.2.8,1.79,1.79,0,0,1-.5.7,1.93,1.93,0,0,1-.9.5,5.07,5.07,0,0,1-1.3.2,6.27,6.27,0,0,1-1.6-.2,3.7,3.7,0,0,1-1.1-.5,5.58,5.58,0,0,1-.8-.5,1.08,1.08,0,0,0-.8-.2,1.45,1.45,0,0,0-.7.2c-.2.1-.3.3-.5.5l-1,1.7,1.2.9a10.09,10.09,0,0,0,1.5.7,10.23,10.23,0,0,0,3.5.7,9.59,9.59,0,0,0,3.1-.5,5.76,5.76,0,0,0,2.3-1.3,5.22,5.22,0,0,0,1.4-1.9,6.44,6.44,0,0,0,.5-2.4A4.7,4.7,0,0,0,220.2,60.6Zm-15.6,0a7.1,7.1,0,0,0-1-1.4,4.19,4.19,0,0,0-1.4-.9,10.41,10.41,0,0,0-1.6-.6,9.83,9.83,0,0,0-1.6-.5c-.5-.2-1-.3-1.4-.5a2.55,2.55,0,0,1-1-.7,1.28,1.28,0,0,1-.4-1,1.51,1.51,0,0,1,.7-1.4,3.15,3.15,0,0,1,2-.5,5.21,5.21,0,0,1,1.4.2c.4.1.8.3,1.1.4a5.9,5.9,0,0,0,.8.4,1.85,1.85,0,0,0,.7.2.75.75,0,0,0,.5-.1c.1-.1.3-.2.4-.4l1-1.6a6.75,6.75,0,0,0-2.6-1.6,9.6,9.6,0,0,0-6.4-.1,6.6,6.6,0,0,0-2.2,1.2,4.63,4.63,0,0,0-1.3,1.8,5.22,5.22,0,0,0-.4,2.1,4.64,4.64,0,0,0,.4,2.1,3.88,3.88,0,0,0,1,1.4,7.1,7.1,0,0,0,1.4,1,11.11,11.11,0,0,0,1.6.7,10.93,10.93,0,0,0,1.7.5c.5.2,1,.3,1.4.5a2.55,2.55,0,0,1,1,.7,1.37,1.37,0,0,1,.4,1.1,1.88,1.88,0,0,1-.2.8,1.79,1.79,0,0,1-.5.7,1.93,1.93,0,0,1-.9.5,5.07,5.07,0,0,1-1.3.2,6.27,6.27,0,0,1-1.6-.2,3.7,3.7,0,0,1-1.1-.5,5.58,5.58,0,0,1-.8-.5,1.08,1.08,0,0,0-.8-.2,1.45,1.45,0,0,0-.7.2c-.2.1-.3.3-.5.5l-1,1.7,1.2.9a10.09,10.09,0,0,0,1.5.7,8.45,8.45,0,0,0,1.7.5,11,11,0,0,0,1.8.2,9.59,9.59,0,0,0,3.1-.5,5.76,5.76,0,0,0,2.3-1.3,5.22,5.22,0,0,0,1.4-1.9,6.44,6.44,0,0,0,.5-2.4A6.6,6.6,0,0,0,204.6,60.6ZM187,63.5a1.14,1.14,0,0,0-.8.3,9.29,9.29,0,0,1-1,.5,9.75,9.75,0,0,1-1.4.6,5,5,0,0,1-1.8.2,6.45,6.45,0,0,1-2-.3,3.07,3.07,0,0,1-1.5-1,4,4,0,0,1-1-1.7,8.49,8.49,0,0,1-.5-2.4h11.3c.4,0,.7-.1.8-.3a3.71,3.71,0,0,0,.2-1.4,9.51,9.51,0,0,0-.6-3.5,7.6,7.6,0,0,0-1.6-2.6,7.16,7.16,0,0,0-2.5-1.6,8.28,8.28,0,0,0-3.2-.5,8.73,8.73,0,0,0-3.7.7,9.23,9.23,0,0,0-2.8,1.9,7.67,7.67,0,0,0-1.7,2.9,10.3,10.3,0,0,0-.6,3.5,10.88,10.88,0,0,0,.7,4.2,10.75,10.75,0,0,0,1.9,3.1,9.72,9.72,0,0,0,2.9,1.9,10.3,10.3,0,0,0,3.5.6,14.08,14.08,0,0,0,2-.1,11.7,11.7,0,0,0,2-.5,6.63,6.63,0,0,0,1.9-.9,10.7,10.7,0,0,0,1.6-1.4l-1.3-1.6A.76.76,0,0,0,187,63.5ZM178.5,54a4.08,4.08,0,0,1,3-1.1,4.31,4.31,0,0,1,1.7.3,2.73,2.73,0,0,1,1.2.9,3.29,3.29,0,0,1,.7,1.3,4.14,4.14,0,0,1,.2,1.6H177A5.35,5.35,0,0,1,178.5,54Zm-8.7-4.3a4.47,4.47,0,0,0-2.8.9,6.7,6.7,0,0,0-2,2.6l-.3-2.1a1.88,1.88,0,0,0-.4-.9c-.2-.2-.5-.2-.9-.2h-2.6V68.3h4.4V57.1c.2-.5.4-.9.6-1.3a3.92,3.92,0,0,1,.8-1,2.07,2.07,0,0,1,1-.6,5.07,5.07,0,0,1,1.3-.2,3.4,3.4,0,0,1,1,.1,2.49,2.49,0,0,0,.8.1.9.9,0,0,0,.5-.1,1.07,1.07,0,0,0,.3-.5l.3-3.3A3.17,3.17,0,0,0,169.8,49.7ZM156.9,55a7.85,7.85,0,0,0-1.4-2.9,5.7,5.7,0,0,0-4.8-2.4,6.71,6.71,0,0,0-3.3.8,8.18,8.18,0,0,0-2.5,2l-.4-1.7a1.08,1.08,0,0,0-1.1-.8h-2.7V74.2h4.4V66.7A5.86,5.86,0,0,0,147,68a6.69,6.69,0,0,0,2.6.5,7.25,7.25,0,0,0,3.3-.7,6.93,6.93,0,0,0,2.5-2,10.81,10.81,0,0,0,1.6-3,11.66,11.66,0,0,0,.5-3.8A22.5,22.5,0,0,0,156.9,55Zm-4.3,6.8a4.8,4.8,0,0,1-.9,1.9,3,3,0,0,1-1.4,1.1,3.42,3.42,0,0,1-1.8.4,4.06,4.06,0,0,1-1.9-.4,4.84,4.84,0,0,1-1.6-1.3V55.3a8.63,8.63,0,0,1,1.8-1.6,4.59,4.59,0,0,1,3.9-.3,2.81,2.81,0,0,1,1.2,1,4.84,4.84,0,0,1,.7,1.8,10.06,10.06,0,0,1,.3,2.7A11.74,11.74,0,0,1,152.6,61.8Zm-15.7-1.2a7.1,7.1,0,0,0-1-1.4,4.19,4.19,0,0,0-1.4-.9,10.41,10.41,0,0,0-1.6-.6,9.83,9.83,0,0,0-1.6-.5c-.5-.2-1-.3-1.4-.5a2.55,2.55,0,0,1-1-.7,1.28,1.28,0,0,1-.4-1,1.51,1.51,0,0,1,.7-1.4,3.15,3.15,0,0,1,2-.5,5.21,5.21,0,0,1,1.4.2c.4.1.8.3,1.1.4a5.9,5.9,0,0,0,.8.4,2.54,2.54,0,0,0,.7.2.75.75,0,0,0,.5-.1c.1-.1.3-.2.4-.4l1-1.6a6.75,6.75,0,0,0-2.6-1.6,9.6,9.6,0,0,0-6.4-.1,6.6,6.6,0,0,0-2.2,1.2,4.63,4.63,0,0,0-1.3,1.8,5.22,5.22,0,0,0-.4,2.1,4.64,4.64,0,0,0,.4,2.1,3.88,3.88,0,0,0,1,1.4,7.1,7.1,0,0,0,1.4,1,8.65,8.65,0,0,0,1.7.7,10.93,10.93,0,0,0,1.7.5c.5.2,1,.3,1.4.5a2.55,2.55,0,0,1,1,.7,1.37,1.37,0,0,1,.4,1.1,1.88,1.88,0,0,1-.2.8,1.79,1.79,0,0,1-.5.7,1.93,1.93,0,0,1-.9.5,5.07,5.07,0,0,1-1.3.2,6.27,6.27,0,0,1-1.6-.2,3.7,3.7,0,0,1-1.1-.5,5.58,5.58,0,0,1-.8-.5,1.08,1.08,0,0,0-.8-.2,1.45,1.45,0,0,0-.7.2c-.2.1-.3.3-.5.5l-1,1.7,1.2.9a10.09,10.09,0,0,0,1.5.7,8.45,8.45,0,0,0,1.7.5,11,11,0,0,0,1.8.2,9.59,9.59,0,0,0,3.1-.5,5.76,5.76,0,0,0,2.3-1.3,5.22,5.22,0,0,0,1.4-1.9,6.44,6.44,0,0,0,.5-2.4A4.7,4.7,0,0,0,136.9,60.6Zm-17.5,2.9a1.14,1.14,0,0,0-.8.3,9.29,9.29,0,0,1-1,.5,9.75,9.75,0,0,1-1.4.6,5.26,5.26,0,0,1-1.9.2,5.41,5.41,0,0,1-1.9-.3,3.07,3.07,0,0,1-1.5-1,4,4,0,0,1-1-1.7,8.49,8.49,0,0,1-.5-2.4h11.3c.4,0,.7-.1.8-.3a3.71,3.71,0,0,0,.2-1.4,9.51,9.51,0,0,0-.6-3.5,7.6,7.6,0,0,0-1.6-2.6,7.16,7.16,0,0,0-2.5-1.6,8.28,8.28,0,0,0-3.2-.5,8.73,8.73,0,0,0-3.7.7,9.23,9.23,0,0,0-2.8,1.9,7.67,7.67,0,0,0-1.7,2.9,10.3,10.3,0,0,0-.6,3.5,10.88,10.88,0,0,0,.7,4.2,10.75,10.75,0,0,0,1.9,3.1,9.72,9.72,0,0,0,2.9,1.9,10.3,10.3,0,0,0,3.5.6,14.08,14.08,0,0,0,2-.1,11.7,11.7,0,0,0,2-.5,6.63,6.63,0,0,0,1.9-.9,10.7,10.7,0,0,0,1.6-1.4l-1.3-1.6C120,63.7,119.8,63.5,119.4,63.5ZM110.8,54a4.08,4.08,0,0,1,3-1.1,4.31,4.31,0,0,1,1.7.3,2.73,2.73,0,0,1,1.2.9,3.29,3.29,0,0,1,.7,1.3,4.14,4.14,0,0,1,.2,1.6h-8.3A6.07,6.07,0,0,1,110.8,54ZM98.6,58.8c-.2-.3-.5-.6-.7-.9s-.5-.5-.9-.6a13.35,13.35,0,0,0,2.4-1.1,9.35,9.35,0,0,0,1.8-1.6,7,7,0,0,0,1.1-2.1,6.9,6.9,0,0,0,.4-2.5,7.31,7.31,0,0,0-.6-3,5.78,5.78,0,0,0-1.8-2.3,8.16,8.16,0,0,0-3.1-1.5,15.09,15.09,0,0,0-4.5-.5H84.8V68.4h4.8V58.3h2a3.09,3.09,0,0,1,1.1.2,1.2,1.2,0,0,1,.7.7l5.4,8.2a2.1,2.1,0,0,0,1.8,1h4.3Zm-3.5-4.3a8.75,8.75,0,0,1-2.4.3h-3V46.3h3.1c1.8,0,3.1.3,3.9,1.1a3.54,3.54,0,0,1,1.3,3,4.84,4.84,0,0,1-.3,1.8,3.32,3.32,0,0,1-1,1.4A11.42,11.42,0,0,1,95.1,54.5Z" fill="#1d1333"/></svg>
</div>
<h1 style="color:#3EC28F;font-size:165%;">Changelog</h1>

<hr />

<label>
    <span id="localization" ></span>
    <span id="color" ></span>
    <span id="image" ></span>
    <span id="appicon" ></span>
</label>

<footer>
    <button type="button" class="cancel">Cancel</button>
    <button type="submit" id="button_integrate" uxp-variant="cta" autofocus>OK</button>
</footer>

</form>
`
}