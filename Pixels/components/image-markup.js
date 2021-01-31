const { collection } = require('./state')

module.exports.wrapImages = function(data) {
  let $el = ``;
  
  for(let i = 0; i < data.length; i++) {
    let smallImg = data[i].urls.small;
    let largeImg = data[i].urls.raw;
    let author = data[i].user.name;
    let id = data[i].id;
    let username = data[i].user.username;
    let isLiked = '';

    // check if user has already liked the image
    collection.find((imageId) => {
      if(imageId.id === id) {
        isLiked = 'saved'
      }
    })


    $el += `
    <div class="image-parent ${isLiked}">
      <div class="image">
        <div class="thumbnail" style="background-image: url('${smallImg}');" data-src="${largeImg}" data-id="${id}">
        </div>
        <div class="active-check">
          <svg width="18" viewBox="0 0 35.67 34.881">
            <g id="Group_30" data-name="Group 30" transform="translate(0.003 0.025)">
              <path id="Path_76" data-name="Path 76" d="M32.838,16v1.419A15.419,15.419,0,1,1,23.694,3.329" transform="translate(0 0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
              <path id="Path_77" data-name="Path 77" d="M29.045,4,13.626,19.434,9,14.809" transform="translate(3.793 1.087)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
            </g>
          </svg>
        </div>
      </div>
      <div class="added-images__copy">
        <div class="by-flex">
          <span>By </span>
          <a class="author-link" href="https://unsplash.com/@${username}?utm_source=your_app_name&utm_medium=referral">&nbsp;${author}</a>
        </div>
        <div class="on-un">
          <span>on </span>
          <a href="https://unsplash.com/?utm_source=image-feeder&utm_medium=referral">&nbsp;Unsplash</a>
        </div>
      </div>
      <div class="save-image ${isLiked}" data-thumbnail="${smallImg}" data-src="${largeImg}" data-author="${author}" data-id="${id}" data-username="${username}">
        <span class="liked-action-heart">
          <svg xmlns="http://www.w3.org/2000/svg" width="12"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </span>
        <span>${isLiked ? 'Unlike' : 'Like'}</span>
      </div>
    </div>
    `
  }
  let markUp = `<div class="group-of-images">${$el}</div>`
  return markUp;
}

