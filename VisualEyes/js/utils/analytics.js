const testingAPIKeys = [
  "213b9dc03b5f11ea",
  "drap-admin",
  "test-free",
  "c5b054065d4511ea",
  "3c4db36e69ea11ea",
  "e202a06e4cb011ea",
  "ymv",
  "xjh",
];

const GA_ID = "UA-99671636-3";

function gaEvents(apiKey, label) {
  // if (testingAPIKeys.indexOf(apiKey) !== -1) {
  //   console.warn(
  //     `Testing API key ${apiKey} detected. Event won't send to Google Analytics.`
  //   );
  //   return;
  // }

  const category = "Plugins";
  const action = "VisualEyes - Adobe XD";
  let hit = `/debug/collect?v=1&t=event&tid=${GA_ID}&cid=${apiKey}&ec=${category}&ea=${action}&el=${label}`
    .split("&")
    .join("\u0026");
  hit = hit.split(" ").join("%20");

  // console.log(hit);
  fetch(
    // "https://cors-anywhere.herokuapp.com/" +
    `https://www.google-analytics.com${hit}`,
    {
      method: "POST",
      mode: "no-cors",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { gaEvents };
