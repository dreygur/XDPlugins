
function createIndexDatei(componentname) {
return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${componentname}</title>
</head>
<body>

<${componentname}/>

<script src="${componentname}.js"></script>
</body>
</html>
    \`;
`
}

module.exports = {
    createIndexDatei,
};