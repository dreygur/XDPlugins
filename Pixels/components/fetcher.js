const { wrapImages } = require('./image-markup');
const { noConnection } = require('./error');
const axios = require('../lib/axios');
let { searchQuery } = require('./search-query');
const $ = require('../lib/jquery');
const {recentPage } = require('./imageStore');
let { currentCollection } = require('./current-images');
let lastPage;

 module.exports.fetchImage = function(event) {
  event.preventDefault();
  searchQuery = document.querySelector("#image-searcher").value.split(" ").join("%20")

  if(searchQuery.length <= 0) {
   document.querySelector('.search-error').style.display = 'block'
   setTimeout(() => {
      document.querySelector('.search-error').style.display = 'none'
   }, 3000)
   return;
  }  else {
    document.querySelector('.search-error').style.display = 'none'    
  }
  document.querySelector('.loader').style.display = 'block';
  axios(`https://api.unsplash.com/search/photos/?query=${searchQuery}&client_id=2262802f7600d54af23a5b8da47e99d39f023d630a0c5414b53fe7c5298859c9`)
  .then((resp) => {
    let pages = 1;
    let base = resp.data
    lastPage = base.total_pages;
    let images = wrapImages(base.results);

    recentPage(base.results);

    $('.added-images').scrollTop(0);
    document.querySelector('.parent').classList.remove('viewing-likes')
    document.querySelector('.added-images__inner').innerHTML = images;
    if(base.results <= 0) {
      document.querySelector('.added-images__inner').innerHTML = `<div class="no-results">No results found for<h2>${document.querySelector("#image-searcher").value}</h2></div>`;  
      document.querySelector(".prev-next").innerHTML = '';
    }
    document.querySelector('.loader').style.display = 'none';



 


    if(pages + 1 <= lastPage) {
      document.querySelector(".prev-next").innerHTML = `
          <input id="more-images-input" type="hidden" value="https://api.unsplash.com/search/photos/?page=${pages}&query=${searchQuery}" data-pages="${pages}" data-last-page="${lastPage}" style="display: none;">

          <div class="change-page prev-page" data-prev="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <div class="change-page numbers"><span id="current-page-num">${pages}</span> <span>-</span> <span>${lastPage}</span></div>
          <div class="change-page next-page" id="nexter" data-next="2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>`
      // document.querySelector('#nexter').addEventListener('click', fetchMoreImages);

      let num = 1;

      document.querySelectorAll('.change-page').forEach((element) => {
        if((element).classList.contains('prev-page') || (element).classList.contains('next-page')) {
          element.addEventListener('click', function(event) {
            let $t = event.currentTarget; 
            
            let prev = document.querySelector('.prev-page');
            let next = document.querySelector('.next-page')
            let visible_page = document.querySelector('#current-page-num');

            if($t.classList.contains('next-page')) {
              prev.setAttribute('data-prev', parseInt(next.getAttribute('data-prev')) + 1)
              next.setAttribute('data-next', parseInt(next.getAttribute('data-next')) + 1)
              
              if(num < lastPage - 1) {
                num = num + 1
                next.style.display = 'block';

                if(num >= 1) {
                  prev.style.display = 'block';
                } else {
                  prev.style.display = 'none';
                }
              } else {
                num = lastPage;
                next.style.display = 'none';
              }
              // set both the next page and the previous page + 1
            } else {
              
              prev.setAttribute('data-prev', parseInt(next.getAttribute('data-prev')) - 1)
              next.setAttribute('data-next', parseInt(next.getAttribute('data-next')) - 1)
              
              if(num > 1) {
                num = num - 1
                prev.style.display = 'block';
                if(num < lastPage) {
                  next.style.display = 'block';
                }
              } else {
                num = 1;
                prev.style.display = 'none';
              }
              // set both the next page and the previous page - 1
            }

            visible_page.innerText = num;
    
            axios(`https://api.unsplash.com/search/photos/?query=${searchQuery}&page=${num}&client_id=2262802f7600d54af23a5b8da47e99d39f023d630a0c5414b53fe7c5298859c9`)
            .then((resp) => {
              let base = resp.data
              lastPage = base.total_pages;
              let images = wrapImages(base.results);
              recentPage(base.results);
  
              document.querySelector('.added-images__inner').innerHTML = images;
              document.querySelector('.loader').style.display = 'none';
              $('.added-images').scrollTop(0);

            })
            .catch((error) => {
              console.log(error,' weee')
              noConnection();
            })
          });
        }
      })
    }  else {
      console.log('failed')
    }
  })
  .catch((error) => {
    console.log(error, 'here')
    noConnection();
  })
}


