const $ = require('../lib/jquery');
const storageHelper = require('../lib/storage-helper')
let {collection} = require('./state');
const {wrapImages} = require('./image-markup')
let { currentCollection } = require('./current-images')
let parent = $('.parent');
let totalLikedImages = collection.length;
let recentPage = [];


module.exports.recentPage = function(data) {
  recentPage = data;
};


module.exports.viewLikes = async function(event) {
   parent = $('.parent');
    if(!parent.hasClass('viewing-likes')) {
      parent.addClass('viewing-likes')
      let data = await storageHelper.get('unsplash-k');
      let images = wrapImages(data);
      $('.all-liked-images').html(images);
    }
  
}


module.exports.reset = function() {
  parent = $('.parent');
  parent.removeClass('viewing-likes');
  collection = collection
}


module.exports.addImageToSave = function(event) {
  console.log(collection.length)
  let $this = $(event.currentTarget);
  let thumbnail = $this.attr('data-thumbnail');
  let src = $this.attr('data-src');
  let image_author = $this.attr('data-author');
  let imageId = $this.attr('data-id');
  let userName = $this.attr('data-username');
  let index;
  if(!$this.hasClass('saved')) {
    $this.addClass('saved')
    $this.find('span:last-of-type').text('Unlike')
   

    let imageObj = {
      urls: { small: thumbnail , raw: src },
      user: { name: image_author, username: userName },
      id: imageId,
    }
  
  
    collection.push(imageObj)
    setTimeout(() => storageHelper.set('unsplash-k', collection))
    document.querySelector("#likes-elements").innerHTML = `Library (${collection.length})`
  } else if($this.hasClass('saved') && !parent.hasClass('viewing-likes')) {
    $this.removeClass('saved')
    $this.find('span:last-of-type').text('Like')
    let updatedState = collection;
    
    collection.find((image) => {
      if(image.id === imageId) {
        index = collection.indexOf(image)
        // console.log(index, 'here')
      }
    })

    let filteredItems = updatedState.slice(0, index).concat(updatedState.slice(index + 1, updatedState.length));
    collection = filteredItems;

    document.querySelector("#likes-elements").innerHTML = `Library (${filteredItems.length})`
    setTimeout(() => storageHelper.set('unsplash-k', filteredItems))
    $('.all-liked-images').html('')
    $('.all-liked-images').html(wrapImages(collection))
  } else if($this.hasClass('saved') || parent.hasClass('viewing-likes')) {
    $this.removeClass('saved')
    $this.find('span:last-of-type').text('Like')
    let updatedState = collection;
    let index = $this.parent().index();
    let filteredItems = updatedState.slice(0, index).concat(updatedState.slice(index + 1, updatedState.length));
    collection = filteredItems;
    setTimeout(() => storageHelper.set('unsplash-k', filteredItems))
    $('.all-liked-images').html('')
    $('.all-liked-images').html(wrapImages(collection))
    document.querySelector("#likes-elements").innerHTML = `Library (${filteredItems.length})`


    if(recentPage.length > 0) {
      recentPage.find((image) => {
        if(image.id === imageId) {
          let index = recentPage.indexOf(image);
          console.log(index)
          $('.browsing-all-images .image-parent').eq(index).find('.save-image').removeClass('saved');
          $('.browsing-all-images .image-parent').eq(index).find('.save-image span:last-of-type').text('Like')
        }
      })
    }
    console.log(collection.length)
  }


}

