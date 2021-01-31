function t(key) {
  const texts = {
    selectedNoedsLengthErrorTitle: "Select Error",
    selectedNoedsLengthErrorDesxription: "Be sure to select one or two nodes",
    showRootNodeContextErrorTitle: "Context Error",
    showRootNodeContextErrorDesxription: "Be sure to select nodes in artboards",
    showWorngScaleLengthErrorTitle: "Input Error",
    showWorngScaleLengthErrorDescription:
      "An incorrect scale number may have been specified. Be sure to specify numbers within the range as single-byte numbers.",
  };
  return texts[key];
}

module.exports = {
  t,
};
