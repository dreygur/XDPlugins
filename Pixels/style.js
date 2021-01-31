module.exports = /* css */ `

  .parent {
    position : fixed;
    width: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    height: 100%;
  }

  .parent.viewing-likes .browsing-all-images {
    display: none;
  }

  .parent .all-liked-images {
    display: none;
  }

  .parent.viewing-likes .all-liked-images {
    display: block;
  }

  .parent.viewing-likes #likes-elements {
    color: black;
  }

  .plugin-title {
    display: flex;
    align-items: center;
  }

  .plugin-title svg {
    margin-right: 8px;
    display: none;
    display: block;
    position: relative;
    top: -1px;
  }

  .plugin-title {
    margin: 0; padding: 0;
    font-size: 14px;
    font-weight: 700;
  }

  .details {
    text-align: center;
  }


  .parent.viewing-likes .image-parent.saved{
    display: block;
  }

  .apply-image-btn {
    position: absolute;
    bottom: 1px;
    margin: 0;
    left: 50%;
    transform: translateX(-50%);
    display: none;
  }

  .image-parent:hover .apply-image-btn {
    display: block;
  }

  .browse {
    /* background: #f2f2f2; */
    width: 120px;
    font-size: 11px;
    text-align: right;
    padding: 8px 8px;
    /* margin-bottom: 14px; */
    font-weight: 600;
    display: none;
  }

  .parent.viewing-likes .browse {
    display: block;
  }

  .parent.viewing-likes .prev-next {
    display: none;
  }

  .action-buttons {
    display: flex;
    align-items: center;
  }

  .user-history svg {
    fill: red;
  }

  .liked-action {
    margin-top: 4px;
    display: inline-block;
    border-radius: 4px;
    margin-bottom: 4px;
  }

  .save-image {
    display: flex;
    align-items: center;
    font-size: 10px;
    padding-left: 10px;
    font-weight: 600;
    padding-bottom: 8px;
  }

  .save-image.saved:hover svg {
    fill: #ddd;
    stroke: #ddd;
  }

  .save-image.saved svg {
    fill: red;
  }

  .save-image:hover svg {
    fill: red;
  }

  .liked-action-heart {

  }

  .search-error {
    font-size: 10px;
    color: red;
    margin: 0;
    padding: 0;
    display: none;
  }


  .no-results {
    font-size: 24px;
    color: #aaa;
    padding: 4px 4px 4px 16px;
  }

  .no-results h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0; padding: 0;
    padding-top: 8px;
    color: black;
  }

  .liked-action-heart svg {
    fill: none;
    stroke: red;
    margin-right: 4px;
  }

  .user-history {
    padding: 5px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #EDEDED;
    border-bottom: 1px solid #EDEDED;
    font-size: 11px;
  }

  .liked {
    display: flex;
    align-items: center;
    color: #aaa;
  }

  .liked p {
    margin: 0;
    padding: 0;
  }

  .liked svg {
    margin-right: 4px;
  }


  .prev-next {
    display: flex;
    align-items: center;
  }

  .prev-next svg {
    fill : #444;
  }

  .added-images {
    width: 100%;
    margin: auto;
    height: 100vh;
    overflow: auto;
    position: relative;
  }
  
  .group-of-images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .added-images__inner {
    flex-wrap: wrap;
    padding-bottom: 24em;
    align-items: center;
    justify-content: space-between;
    
  }

  .added-images__inner > div {
    width: 100%;
    margin: auto;
    margin-bottom: 1em;
  }

  .added-images img {
    width: 100%;
    position: relative;
    z-index: 7;
  }
  
  .image-parent {
    margin-bottom: 10px;
    background: #fff;
    width: 48%;
  }

  @media(min-width: 400px) {
    .image-parent {
      width: 30%;
    }
  }
  

  .image {
    position: relative;
  }

  .active-check {
    position: absolute;
    top: 0px;
    right: 10px;
    z-index: 6;
    display: none;
  }

  .search {
    display: flex;
  }

  #image-searcher {
    width: 100%;
  }

  .thumbnail {
    padding-bottom: 100%;
    position: relative;
    background-size: cover;
    background-position: center;
  }

  .active-overlay {
    position: absolute;
    top: 0; left: 0;
    z-index: 4;
    width: 100%; height: 100%;
    background: rgba(000, 000, 000, 0.3);
    display: none;
  }

  .image.active {
    border: 4px solid #ddd;
  }

  .image.active .active-check {
    display: block;
  }

  .image.active .active-overlay {
    display: block;
  }

  .image:hover {
    cursor: pointer;
  }

  .image:hover .active-overlay {
    display: block;
  }


  .added-images__copy {
    padding: 8px 8px;
    width: 100%;
    /* text-align: center; */
    font-size: 10px;
  }

  .by-flex {
    align-items: center; 
    display: flex;
  }

  .on-un {
    display: flex;
    align-items: center;
    padding-top: 4px;
  }

  .

  .by-flex span {
    margin-right: 2px;
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
  }

  .author-link {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .added-images__copy a {
    display: inline;
    margin: 0;
  }

  .added-images__copy input {
    width: 80%;
    font-size: 10px;
  }
  
  .added-images__copy p  {
    margin: 0; padding: 0;
    font-size: 10px;
  }

  .next {
    position: fixed;
    z-index: 5;
    left: 0;
    bottom: -0px;
    width: 100%;
    padding: 1em 0em 0em 0em;
    background: #F7F7F7;
    text-align: center !important;
  }


  .loader {
    position: absolute;
    z-index: 5;
    top: 0; left: 0;
    background: #F5F5F5;
    display: none;
    width: 100%; height: 100%;
  }

  .loader-icon {
    max-width: 300px;
    width: 100%;
    position: absolute;
    top: 10%; left: 50%;
    transform: translateX(-50%);
  }

  #loader-image {
    min-width: 100px;
    max-width: 300px;
    width: 100%;
  }

  .change-page.numbers {
    display: flex;
    align-items: center;
  }
`