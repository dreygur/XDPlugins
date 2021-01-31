const shell = require("uxp").shell;
const Circles = require("./progressbar");
const sendFeedback = require("../sendFeedback");
const {
  getOriginalIcon,
  getClarityIcon,
  getAttentionIcon,
  getMinusIcon,
  getPlusIcon,
  getViewResultsIcon,
  getHelpToolTipIcon,
} = require("./icons");
const {
  ORIGINAL,
  ATTENTION,
  CLARITY,
  ORIGINAL_IMAGE,
  ATTENTION_IMAGE,
  CLARITY_IMAGE,
  HEATMAP_TIP,
  CLARITY_TIP,
  FEEDBACK_TIP,
  COMMAND_TYPE,
} = require("./constants");
const { gaEvents } = require("./analytics");

function createFinishWindow(
  attentionUrl,
  clarityUrl,
  originalImage,
  score,
  hint,
  link,
  apiKey
) {
  document.body.innerHTML = `
    <style>
     
     .resultsBtns {
      display: flex;
      flexDirection: row;
      justifyContent: space-around;
      align-items: center;
      padding: 16px;
      background-color: white;
      borderRadius: 8px;
      border: solid 1px rgba(29, 15, 104,0.1);
      margin: 1rem 0rem;
      width:100%;
     }
     
     .resultsSection {
      position:relative;
      width: 100%;
      height: 400px;
      max-height:400px;
      margin-bottom:1rem;
     border-radius: 8px;
     border: solid 1px rgba(29, 15, 104, 0.1);
    }
     .resultsImages {
      position:absolute; 
      top: 0px;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      border-radius:0;
      background-image: url(../../assets/dots.jpg);
      background-size: 750px auto;
      border-radius: 8px;
     }
  
     .originalBtn, .clarityBtn, .attentionBtn {
      display: flex; 
      justify-content: center; 
      align-items: center; 
      cursor: pointer; 
     }
     .originalBtn {
      color: rgb(62, 33, 222);
    }
  
    .scoreCircle {
      display: none; 
      position: absolute; 
      right: 0px; 
      top: 0px; 
      padding: 0.5rem; 
      margin: 0.5rem; 
      background: white;
      padding: 0.5rem;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px;
      font-weight: bold;
    }
    
    .informations {
      display: flex;
      flexDirection: row;
      justifyContent: space-around;
      margin-bottom:1rem;
      align-items: center;
      width: 100%;
    }
  
    .zoomsection {
      position: absolute; 
      bottom: 0px; 
      left: 0px; 
      margin: 1rem;
      display: flex; 
      justify-content: center; 
      align-items: center;
    }
    .zoombtns {
      padding: 0.25rem; 
      width: 32px; 
      min-width: 32px; 
      height: 32px; 
      min-height: 32px; 
      border-radius: 8000px; 
      border: white;
      background-color: white; 
      color: rgb(62, 33, 222); 
      cursor: pointer; 
      box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px; 
      margin-right: 0.5rem; 
      display: flex; 
      justify-content:center; 
      align-items: center;
    }
    .viewDashboardBtn {
      color: #fff;
      height:46px;
      background-color: rgb(62, 33, 222);
      display: block;
      border: 1px solid transparent;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      width:100%;
    }
  
    .feedbackBtn {
      width: 100%;
      height:auto;
      color: #1d0f68;
      font-size: 14px;
      cursor: pointer;
      border:none;
      text-align:center;
      margin: 1rem 0;
      
    }
    
    .sendfeedback {
      display:none;
      margin: 1rem 0 0.8rem 0;
      width: 100%;
      align-items: center;
    }
    .send {
      display:flex;
      justify-content:center;
      align-items: center;
      width:16%;
      height:38px;
      background-color: rgba(62, 33, 222, 0.3);
      box-shadow: none;
      color: #fff;
      border: 2px solid transparent;
      border-radius: 6px;
      outline: none;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    }
  
    #answer { 
     display:flex;
     width:100%;
     border: 1px solid #e7e4fb;
     border-radius: 6px;
     }
     #answer:hover {
     border: 1px solid #c3baf5; 
     }
     #answer:focus {
      border: 1px solid #3e21de; 
     }
  
     .row {
       display:flex;
       justify-content: center;
       align-items: center;
     }
     .helpsection {
      position: absolute;
      bottom: 0px;
      right: 0px;
      margin: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #help {
      padding: 0.25rem 0.25rem 0 0.25rem;
      width: 32px;
      min-width: 32px;
      height: 32px;
      min-height: 32px;
      margin-right: 0.5rem;
      display: flex;
      justify-content:center;
      align-items: center;
      cursor: pointer;
      opacity: 0;
    }
  
    /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
    }
  
    /* Tooltip text */
    .tooltip .tooltiptext {
     visibility: hidden;
     line-height: 170%;
     background-color: #212121;
     color: #fff;
     text-align: center;
     padding: 12px;
     border-radius: 6px;
     font-size: 14px;
  
     /* Position the tooltip text */
     position: absolute;
     z-index: 1;
     right: 125%;
     bottom: 0%;
     margin-left: -60px;
  
     /* Fade in tooltip */
     opacity: 0;
     transition: opacity 0.3s;
     }
  
     /* Tooltip arrow */
     .tooltip .tooltiptext::after {
     content: "";
     position: absolute;
     left: 100%;
     bottom: 24px;
     margin-bottom: -5px;
     border-width: 5px;
     border-style: solid;
     }
  
     /* Show the tooltip text when you mouse over the tooltip container */
     .tooltip:hover .tooltiptext {
     visibility: visible;
     width: 300px;
     opacity: 1; 
     }
     .tooltip .tooltiptext-bottom {
      visibility: hidden;
      line-height: 170%;
      width: 300px;
      background-color: rgba(50, 50, 50, 0.9);
      color: #fff;
      text-align: center;
      padding: 12px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      top: 100%;
      right: 50%;
      transform: translate(50%);
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
  }
  .tooltip .tooltiptext-bottom::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 104%;
      transform: translateX(-50%);
      margin-bottom: -5px;
  }
  .tooltip:hover .tooltiptext-bottom {
        visibility: visible;
        opacity: 1;
        }
  
        .tooltip:hover .tooltiptext-top {
        visibility: visible;
        opacity: 1;
        }
  
        .tooltip .tooltiptext-top {
      visibility: hidden;
      line-height: 170%;
      width: 300px;
      background-color: rgba(50, 50, 50, 0.9);
      color: #fff;
      text-align: center;
      padding: 12px;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      right: 50%;
      transform: translate(50%);
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
  }
  .tooltip .tooltiptext-top::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 100%;
      margin-bottom: -5px;
     
  }
        </style>
  
      <dialog style="overflow: auto; height: 100%; width:750px;" id="dialog">
        <form>
          <div class="row"><img style="width: 150px" src="https://locstatic.s3.eu-west-2.amazonaws.com/visualeyes/logog-for-adobe-xd.png"/></div>
          <div class="resultsBtns">
  <div id="originalbtn" class= "originalBtn">
   ${getOriginalIcon()}
  </div>
    <div id="attentionbtn" class= "attentionBtn">
    ${getAttentionIcon()}
    </div>
  <div id="claritybtn" class= "clarityBtn">
    ${getClarityIcon()}
  </div>
  </div>
         
          <div class="resultsSection">
          <div class="resultsImages" id="results">
          <img id="originalImg" src="${originalImage}" style="position:relative; display: block; margin: auto; width: 80%; box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px;">
          <img id="openattention"src="${attentionUrl}" style="top:0; left:10%; position:absolute; opacity:0; margin: auto; width: 80%; ">
          <img id="openclarity" src="${clarityUrl}" style="top:0; left:10%; position:absolute; opacity:0; margin: auto; width:80%; ">
          </div>
          <div class="scoreCircle" id="score"></div>
          <div class="zoomsection">
          <div class="zoombtns" id="minusBtn">${getMinusIcon()}</div>
          <div class= "zoombtns" id="plusBtn"> ${getPlusIcon()}</div>
          </div>
          <div class="helpsection" id="helptooltip">${getHelpToolTipIcon()}</div>
          </div>
          <span class="tooltip" style="position: relative; width: 100%;">${getViewResultsIcon()}</span>
          <span class="tooltip" style="position: relative; width: 100%;">
          <span id="feedbacktip" class="tooltiptext-top" style="width: 300px;">${FEEDBACK_TIP}</span>
          <div class="feedbackBtn" id="feedback">We value your Feedback ❤️ </div>
        </span>
          <div id="thankyousection" class="row" style="color: #1d0f68; font-size: 14px; margin-top:1rem; display:none;" >😇 Thank you a lot</div>
          <div id="errorsection" class="row" style="color: #1d0f68; font-size: 14px; margin-top:1rem; display:none;" >😬 Something went wrong. Try in a while...</div>
          <div id="sendfeedbacksection" class="sendfeedback"><input type="text" id="answer" placeholder="We’d really appreciate your feedback..." value=""></input><div class="send" id="sendbtn" disabled>Send</div></div>
          <button style="position:absolute; bottom: 0rem; right:1.5rem;" id="close" type="close" uxp-variant="cta">Close</button>
        </form>
      </dialog>
    `;

  //default metric = attention
  changeResultPanel(ATTENTION);

  function setUp(metric, callback = () => {}) {
    const btn = document.querySelector(`#${metric}`);
    btn.addEventListener("click", () => {
      trackAnalytics("changeTab", apiKey, metric);
      changeResultPanel(metric);
      callback();
    });
  }
  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("submit", () => {
    shell.openExternal(link);
  });

  setUp(ORIGINAL);
  setUp(ATTENTION);
  setUp(CLARITY, () => createCircle(score));

  const cancelButton = document.querySelector("#close");
  cancelButton.addEventListener("click", () => {
    dialog.remove();
  });
  const ctaButton = document.querySelector("#viewresults");
  ctaButton.addEventListener("click", () => {
    trackAnalytics("openapp", apiKey);
    shell.openExternal(link);
  });
  const showFeedbackBtn = document.querySelector("#feedback");
  showFeedbackBtn.addEventListener("click", function () {
    trackAnalytics("feedback", apiKey);
    document.querySelector("#feedback").style.display = "none";
    document.querySelector("#feedbacktip").style.display = "none";
    document.querySelector("#sendfeedbacksection").style.display = "flex";
    document.querySelector("#answer").focus();
  });

  const feedbackTextBtn = document.querySelector("#answer");

  feedbackTextBtn.addEventListener("keydown", function () {
    setTimeout(function () {
      verifyFeedbackAnswer();
    }, 100);
  });
  feedbackTextBtn.addEventListener("keyup", function () {
    verifyFeedbackAnswer();
  });

  const sendFeedBackBtn = document.querySelector("#sendbtn");
  sendFeedBackBtn.addEventListener("click", function () {
    sendFeedbackAnswer(apiKey);
  });

  handleZoom(ORIGINAL_IMAGE);
  handleZoom(ATTENTION_IMAGE);
  handleZoom(CLARITY_IMAGE);
  // setTimeout(() => dialog.remove(), 6000);
  dialog.showModal();
}

//check if input for feedback is empty, so user can't send empty feedback
function verifyFeedbackAnswer() {
  if (document.querySelector("#answer").value != "") {
    document.getElementById("sendbtn").disabled = false;
    document.getElementById("sendbtn").style.backgroundColor =
      "rgba(62, 33, 222, 1)";
  } else {
    document.getElementById("sendbtn").disabled = true;
    document.getElementById("sendbtn").style.backgroundColor =
      "rgba(62, 33, 222, 0.3)";
  }
}

async function sendFeedbackAnswer(apiKey) {
  const feedbackText = document.querySelector("#answer").value;
  await sendFeedback(feedbackText, apiKey);
}
//thank you message after send feedback
function changeFeedbackMessage() {
  document.querySelector("#sendfeedbacksection").style.display = "none";
  document.querySelector("#thankyousection").style.display = "flex";
}

//error in feedback, show message
function errorFeedbackMessage() {
  document.querySelector("#sendfeedbacksection").style.display = "none";
  document.querySelector("#errorsection").style.display = "flex";
}

//handle zoom-in and zoom-out result images
function handleZoom(metric) {
  const zoomin = document.getElementById("plusBtn");
  const zoomout = document.querySelector("#minusBtn");
  zoomin.disabled = false;
  let value = parseInt(document.getElementById(`${metric}`).style.width, 10);
  zoomin.addEventListener("click", function () {
    if (value < 100) {
      zoomout.style.opacity = "1";
      zoomin.style.opacity = "1";
      zoomout.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 10px";
      zoomin.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 10px";

      document.querySelector("#plusBtn").style.backgroundColor = "white";

      document.getElementById(`${metric}`).style.width =
        parseInt(document.getElementById(`${metric}`).style.width, 10) +
        10 +
        "%";
      document.getElementById(`${metric}`).style.left =
        parseInt(document.getElementById(`${metric}`).style.left, 10) - 5 + "%";

      value = value + 10;
      value >= 30
        ? ((zoomout.style.backgroundColor = "white"),
          (zoomout.disabled = false))
        : ((zoomout.style.opacity = "0.5"),
          (zoomout.style.boxShadow = "none"),
          (zoomout.disabled = true));
      value < 100
        ? ((zoomin.style.backgroundColor = "white"), (zoomin.disabled = false))
        : ((zoomin.style.opacity = "0.5"),
          (zoomin.style.boxShadow = "none"),
          (zoomin.disabled = true));
    }
  });
  zoomout.addEventListener("click", function () {
    if (value > 30) {
      zoomout.style.opacity = "1";
      zoomin.style.opacity = "1";
      zoomout.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 10px";
      zoomin.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 10px";

      document.querySelector("#plusBtn").style.backgroundColor = "white";

      document.getElementById(`${metric}`).style.width =
        parseInt(document.getElementById(`${metric}`).style.width, 10) -
        10 +
        "%";
      document.getElementById(`${metric}`).style.left =
        parseInt(document.getElementById(`${metric}`).style.left, 10) + 5 + "%";

      value = value - 10;
      value <= 100
        ? ((zoomin.style.backgroundColor = "white"), (zoomin.disabled = false))
        : ((zoomin.style.opacity = "0.5"),
          (zoomin.style.boxShadow = "none"),
          (zoomin.disabled = true));
      value > 30
        ? ((zoomout.style.backgroundColor = "white"),
          (zoomout.disabled = false))
        : ((zoomout.style.opacity = "0.5"),
          (zoomout.style.boxShadow = "none"),
          (zoomout.disabled = true));
    }
  });
}

function createCircle(score) {
  Circles.create({
    id: "score",
    radius: 25,
    value: score,
    maxValue: 100,
    width: 4,
    text: function (value) {
      return value + "%";
    },
    colors: ["rgba(62, 33, 222, 0.1)", "rgba(62, 33, 222, 1)"],
    duration: 400,
    wrpClass: "circles-wrp",
    textClass: "circles-text",
    valueStrokeClass: "circles-valueStroke",
    maxValueStrokeClass: "circles-maxValueStroke",
    styleWrapper: true,
    styleText: true,
  });
}
async function changeResultPanel(metric) {
  if (metric === ORIGINAL) {
    document.querySelector("#originalCircle").style.fill = "#3E21DE";
    document.querySelector("#originalPath").style.fill = "white";
    document.querySelector("#originalbtn").style.color = "rgb(62, 33, 222)";

    document.querySelector("#claritybtn").style.color = "none";
    document.querySelector("#openclarity").style.opacity = "0";
    document.querySelector("#score").style.display = "none";
    document.querySelector("#clarityCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#clarityPath").style.fill = "rgba(29, 15, 104, 1)";

    document.querySelector("#attentionbtn").style.color = "none";
    document.querySelector("#openattention").style.opacity = "0";
    document.querySelector("#attentionCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#attentionPath").style.fill =
      "rgba(29, 15, 104, 1)";

    document.querySelector("#help").style.opacity = "0";
  } else if (metric === CLARITY) {
    document.querySelector("#originalbtn").style.color = "none";
    document.querySelector("#originalCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#originalPath").style.fill = "rgba(29, 15, 104, 1)";

    document.querySelector("#attentionbtn").style.color = "none";
    document.querySelector("#openattention").style.opacity = "0";
    document.querySelector("#attentionCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#attentionPath").style.fill =
      "rgba(29, 15, 104, 1)";

    document.querySelector("#claritybtn").style.color = "rgb(62, 33, 222)";
    document.querySelector("#openclarity").style.opacity = "1";
    document.querySelector("#score").style.display = "block";
    document.querySelector("#clarityCircle").style.fill = "#3E21DE";
    document.querySelector("#clarityPath").style.fill = "white";

    document.querySelector("#help").style.opacity = "1";
    document.querySelector("#helptext").textContent = `${CLARITY_TIP}`;
  } else {
    document.querySelector("#originalbtn").style.color = "none";
    document.querySelector("#originalCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#originalPath").style.fill = "rgba(29, 15, 104, 1)";

    document.querySelector("#claritybtn").style.color = "none";
    document.querySelector("#openclarity").style.opacity = "0";
    document.querySelector("#score").style.display = "none";
    document.querySelector("#clarityCircle").style.fill =
      "rgba(29, 15, 104, 0.05)";
    document.querySelector("#clarityPath").style.fill = "rgba(29, 15, 104, 1)";

    document.querySelector("#attentionbtn").style.color = "rgb(62, 33, 222)";
    document.querySelector("#openattention").style.opacity = "1";
    document.querySelector("#attentionCircle").style.fill = "#3E21DE";
    document.querySelector("#attentionPath").style.fill = "white";

    document.querySelector("#help").style.opacity = "1";
    document.querySelector("#helptext").textContent = `${HEATMAP_TIP}`;
  }
}

function trackAnalytics(action, apiKey, metric) {
  let label;
  switch (action) {
    case "changeTab":
      if (metric === "originalbtn") {
        label = "View original tab";
      } else if (metric === "attentionbtn") {
        label = "View attention tab";
      } else if (metric === "claritybtn") {
        label = "View clarity tab";
      }
      break;
    case "startplugin":
      if (metric === COMMAND_TYPE.attentionDesktop) {
        label = "Prediction for desktop";
      } else if (metric === COMMAND_TYPE.attentionMobile) {
        label = "Prediction for mobile";
      }
      break;
    case "onBoarding":
      label = "On-boarding command";
      break;
    case "hasAOI":
      label = "Included X AOIs";
      break;
    case "openapp":
      label = "Open app";
      break;
    case "feedback":
      label = "Click feedback menu";
      break;
  }
  gaEvents(apiKey, label);
}

module.exports = {
  createFinishWindow,
  changeFeedbackMessage,
  errorFeedbackMessage,
  trackAnalytics,
};
