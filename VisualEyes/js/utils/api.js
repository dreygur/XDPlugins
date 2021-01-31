const { API_BASE_URL, CUSTOM_API_ERROR, FEEDBACK_URL } = require("./constants");
const { handleAPIError } = require("./errorHandling");

function getCredits(apiKey) {
  return new Promise((resolve, reject) => {
    fetch(API_BASE_URL + "/credits", {
      method: "GET",
      headers: {
        Authorization: `Token ${apiKey}`,
        "cache-control": "no-cache"
      }
    })
      .then(res => {
        const { status } = res;

        if (status === 200) {
          return res.json();
        } else {
          reject(handleAPIError(status));
        }
      })
      .then(json => {
        resolve(json.credits);
      })
      .catch(err => {
        {console.log}(err);
        reject(err);
      });
  });
}

function getCreditsXML(apiKey) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.onload = () => {
      const { status, response } = req;

      if (status === 200) {
        try {
          const json = JSON.parse(response);
          const credits = json.credits;
          resolve(credits);
        } catch (err) {
          reject(`Couldnt parse response. ${err.message}, ${req.response}`);
        }
      } else {
        reject(handleAPIError(status));
      }
    };
    req.onerror = reject;
    req.onabort = reject;
    req.open("GET", API_BASE_URL + "/credits", true);

    req.setRequestHeader("Access-Control-Allow-Credentials", "true");
    var token = "Token " + apiKey;
    req.setRequestHeader("Authorization", token);

    req.send();
  });
}

function predict(url, formData, apiKey) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Token ${apiKey}`,
        "cache-control": "no-cache"
      }
    })
      .then(res => {
        const { status } = res;

        if (status === 201) {
          return res.json();
        } else {
          reject(handleAPIError(status));
        }
      })
      .then(json => {

        const results = {
          clarityUrl: json.clr_url,
          attentionUrl: json.att_url,
          dashboardUrl: json.link,
          score: json.score
        };

        resolve(results);
      })
      .catch(err => {
        console.log("[ERROR] predict.js: " + JSON.stringify(err));
        reject(handleAPIError(err));
      });
  });
}
 function postFeedback(formData) {
  return fetch(FEEDBACK_URL, {
    method: "POST",
    body: formData
  }).then(res => {
    const { status } = res;

try {
  if (status === 200) {
    return res.json();
  } else {
    throw Error(`Error Tracking request failed with status ${status}`);
  }
} finally {
}
  }).then(json => {console.log(json);});
}

module.exports = {
  getCredits,
  getCreditsXML,
  predict,
  postFeedback
};
