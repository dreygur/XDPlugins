module.exports = `<div id="superpositionRunning">
  <p><img src="images/icon@2x.png"></p>
  <p>Design tokens for:<br /> <b id="currentURL"></b></p>
  <p><span id="add">Add all colors to assets</span></p>
  <p><span id="msg"></span></p>
  <hr />

  <div id="superpositionRunningNothingSelected">
    <p><i>Select shape or text to show applicable design tokens</i></p>
  </div>

  <div id="superpositionRunningTextSelected">
    <p><b>Text selected</b><br> Click design token to apply to text.</p>
  </div>

  <div id="superpositionRunningRectangleSelected">
    <p><b>Rectangle selected</b><br> Click design token to apply to rectangle.</p>
  </div>

  <div id="superpositionRunningShapeSelected">
    <p><b>Shape selected</b><br> Click design token to apply to shape.</p>
  </div>


  <div id="typography" class="list">
    <h2>
      <span class="toggle">▼</span>
      <span class="title">Typography</span>
    </h2>
    <ul id="typographyList"></ul>
  </div>

  <div id="colors" class="list">
    <h2>
      <span class="toggle">▼</span>
      <span class="title">Colors</span>
    </h2>
    <ul id="colorList"></ul>
  </div>

  <div id="spacing" class="list">
    <h2>
      <span class="toggle">▼</span>
      <span class="title">Spacing</span>
    </h2>
    <ul id="spacingList"></ul>
  </div>

  <div id="borderradii" class="list">
    <h2>
      <span class="toggle">▼</span>
      <span class="title">Border Radii</span>
    </h2>
    <p class="small"><i>Non-pixel values have been filtered out.</i></p>
    <ul id="borderradiiList"></ul>
  </div>

  <div id="shadows" class="list">
    <h2>
      <span class="toggle">▼</span>
      <span class="title">Shadows</span>
    </h2>
    <p class="small"><i>Inset shadows and multi-layered shadows have been filtered out.</i></p>
    <ul id="shadowsList"></ul>
  </div>
</div>`;
