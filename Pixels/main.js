const { collection } = require('./components/state');
const storageHelper = require('./lib/storage-helper');
const { fetchImage } = require('./components/fetcher');
const { setImage } = require('./components/set-image');
const {viewLikes, addImageToSave, reset } = require('./components/imageStore');
const $ = require('./lib/jquery')
let styles = require('./style');
const { wrapImages } = require('./components/image-markup');
let panel;


const panelMarkup = () => {
  let html = /* html */`
    <style>
      ${styles}
    </style>
    <div style="margin: 0px;">
      <div>
      <small style="margin: 0; font-size: 8px; float: right; text-align: right; color: #999;">Version 1.0.0</small>
        <form id="form" style="margin-bottom: 10px;">
          <div class="search">
            <input type="text" id="image-searcher" placeholder="Search Images">
            <button class="action-buttons__item" id="fetcher" uxp-variant="cta" type="submit">Search</button>
          </div>
          <p class="search-error">Please enter a search</p>

          <div class="user-history">
            <div class="liked-action">
              <p title="saved" class="liked">
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </span>
                <span id="likes-elements">Library (0)</span>
              </p>
            </div>

            <div class="prev-next">
              
            </div>
            <div class="browse">Close Library</div>
          </div>
        </form>

        <div class="added-images">
          
          <div class="added-images__inner browsing-all-images">
            <!-- images added here -->    
            <h2>Search for images.</h2>
            
          </div>

          <div class="added-images__inner all-liked-images">
            <!-- images added here -->   
            
          </div>
          <div class="loader">
            <div class="loader-icon">
              <img id="loader-image" src="./images/loader.gif">
            </div>
          </div>
        </div>

      </div>
      <div class="next">
        <div class="apply"></div>
      </div>
    </div>
  `;
  panel = document.createElement("div");
  panel.setAttribute('class', 'parent')
  panel.innerHTML = html;
  return panel;
};




const show = async (event) => {
  if (!panel) {
    await event.node.appendChild(panelMarkup());
    let totalLikesOnLoad = await storageHelper.get('unsplash-k');
    

    document.querySelector('#form').addEventListener('submit', event => fetchImage(event));
    // storageHelper.delete('unsplash-k')
    if(totalLikesOnLoad) {
      if(totalLikesOnLoad.length > 0) {
        $('#likes-elements').html(`Library (${totalLikesOnLoad.length})`)
        for(let i = 0; i < totalLikesOnLoad.length; i++) {
          collection.push(totalLikesOnLoad[i])
        }
      }
    }

 

    //
    
    // $(document).on('click', '.save-image', event => saveTheImage(event));
    $(document).on('click', '.liked-action', viewLikes)
    $(document).on('click', '.thumbnail', event => setImage(event))
    $(document).on('click', '.browse', reset)
    $(document).on('click', '.save-image', event => addImageToSave(event))
  }
};


const hide = event => {
  console.log('hiding')
};


module.exports = {
  panels: {
    runPlugin: {
      show,
      hide,
      setImage
    }
  }
};
