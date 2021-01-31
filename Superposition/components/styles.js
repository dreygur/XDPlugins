module.exports = `
.hide {
    display: none;
}
i {font-style:italic;}
h1,h2,h3 {
  margin-top:2em;
  margin-bottom:1em;
}
#superpositionRunning img,
#superpositionNotRunning img {
  width:auto;
  display:block;
}


.list h2 {
  display:flex;
  justify-content:flex-start;
}
.list h2 .toggle {
  color: #2B96EF;
  cursor:pointer;
}
.list.collapsed p,
.list.collapsed ul {
  display:none;
}

#add {margin:0;color: #2B96EF;cursor:pointer;}

#msg {
  transition:0.35s ease opacity;
  color: #0bcf76;
  opacity:0;
}
#msg.visible {
  opacity:1;
}

.text,
.color,
.radius,
.shadow {
  display:block;
  background:#fff;
  border-radius:0.33em;
  padding:0.5em;
  margin-bottom:0.4em;
  display:flex;
  justify-content: flex-start;
  align-items:center;
  color:#999;
  border:1px solid #fff;
}
.text:hover,
.color:hover,
.radius:hover,
.shadow:hover,
.text:focus,
.color:focus,
.radius:focus,
.shadow:focus {
border:1px solid #999;
}

.disabled .color,
.disabled .color:hover,
.disabled .color:focus {
  background:transparent;
  border-color:transparent;
}
.color > div {
  width:22px;
  height:22px;
  margin-right:0.66em;
  border-radius:0.3em;
  border:1px solid #ddd;
  overflow:hidden;
  background:url(images/pattern.png);
}
.color > div > div {
width:22px;
height:22px;
}

.text > div {
width:24px;
height:24px;
margin-right:0.5em;
border-radius:0.2em;
font-size:13pt;
font-weight:regular;
line-height:24px;
text-align:center;
color:#000;
}
.shadow,
.radius {
  line-height: 24px;
}

`;
