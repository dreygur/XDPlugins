// Trimed version of dialog functions

function showDialog(dialogId, messageText) {
  return new Promise((resolve, reject) => {
    let dialog = document.querySelector(dialogId);
    let message = document.querySelector(dialogId + " #message");
    let closeButton = document.querySelector(dialogId + " #closeButton");
    dialog.showModal();
    message.textContent = messageText;
    closeButton.onclick = () => {
      dialog.close();
      resolve();
    }
  });
}

function html(tag, props, ...children) {
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

let alertDialog =
  html("dialog", {id: "alertDialog"},
  html("div", { style: { borderBottom: "1px solid #eaeaea", width: "100%", paddingBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center",}},
  html("h1", {style: { fontSize: "26px" }}, "uiLogos"),
  ),

  html("form", { method:"dialog", style: { width: 300 } },

  html("div", {id: "message", fontSize: "16px", marginTop: 10, maxHeight: 500, overflowY: "scroll"}, "Dialog without message."),

  html("footer",
  html("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
)
)
);
document.body.appendChild(alertDialog);

let infoDialog =
  html("dialog", {id: "infoDialog"},
  html("div", { style: { borderBottom: "1px solid #eaeaea", width: "100%", paddingBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
  html("div",
  html("h1", {style: { fontSize: "26px", paddingBottom: "10px" }}, "uiLogos"),
  html("h2", {style: { fontSize: "16px", fontWeight: "normal", color: "#555" }}, "Get professionally designed Logos and Country Flag for your mockup.")
  )
  ),
  html("form", { method:"dialog", style: { fontSize:"18px", width: 500, textAlign: "left", display: "flex" } },

  html("img", {src: "resources/shapes.png", style: { width: 400, height: 140, alignSelf: "center" } }),

  html("p", {id: "message"}, "Dialog without message."),

  html("footer",
  html("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
)
)
);
document.body.appendChild(infoDialog);

module.exports = {
  showDialog
};
