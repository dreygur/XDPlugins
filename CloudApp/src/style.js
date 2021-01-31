const dialog = `
  dialog {
    display: block;
    background: white;
    width: 550px;
    overflow: hidden;
    padding: 20px 0;
  }
  .artboard{
    max-width:210px;
    max-height: 170px;
    height: auto;
    width: auto;
    margin-left: -12px;
  }
  .card {
    width: 220px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #EAEAEA;
    padding: 8px;
    border-radius: 8px;
  }
  .well {
    width: 220px;
    display: flex;
    justify-content: center;
    background: #EAEAEA;
    padding: 8px;
    border-radius: 8px;
    margin-top:20px;
  }
  .logo {
    height: 23px;
    margin-right: 5px;
  }

  #expires-mac, #share-mac{
    padding-left: 0px;
    margin-left: 0px;
    margin-top: 5px;
    min-width:200px;
  }

  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .avatar--img {
    height: 30px;
    width: 30px;
  }

  form {
    margin: 0;
    padding: 0;
    width: 500px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    color: #1C1C1C;
    font-wieght: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #E5E5E5;
    width: 100%;
  }
  .header--item {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: start;
    position: relative;
  }

  .user--dropdown {
    width: 135px;
  }

  .header--item_user-name {
    font-size: 14px;
    color:#1C1C1C;
    font-wieght: 500px;
  }

  .arrow {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../images/down.png')
  }

  .arrow.active {
    background-image: url('../images/up.png')
  }

  .user--dropdown {
    display: none;
    text-align: right;
    padding: 0 5px;
    background: white;
    position: absolute;
    top: 32px;
    right: 0;
    z-index: 1000;

    li {
      font-size: 14px;
      color:#1C1C1C;
    }
  }

  .user--dropdown.active {
    display: block;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    width: 100%;
  }
  .row.columns{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .options-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  select {
    font-size: 16px;
    color: #1C1C1C;
    margin-top: -10px;
  }
  label {
    font-size: 14px;
    color: #1C1C1C;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .input-group {
    margin-bottom: 25px;
    display:flex;
    flex-direction: column;
    min-width:200px;
  }
  .input-group input, .input-group select {
    margin: 0;
    padding: 0;
  }
  .input-group label {
    text-align:left;
  }
  .hidden{
    display:none !important;
  }
  `;

const errorDialog = `
  dialog {
    text-align: center;
  }
  dialog p {
    font-size: 14px;
    font-wieght: 500px;
    margin-bottom: 25px;
  }
  `;
const loginStyle = `
  dialog{
  width: 550px;
  background-color: #FFF;
  }

  .login-container {
    display:flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
  }

  .large-logo {
    width: 300px;
    height: 225px;
  }

  .loading-screen {
    display: none;
    width: 550px;
    height: 450px;
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255,255,255, 0.8);
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    flex-direction: column;

  }
  .loading-screen h1 {
    color: black;
    font-size: 36px;
    text-align: center;
    width: 100%;
    z-index: 101;

  }
  .loading-screen img {
    height: 64px;
    width: 64px;
    z-index: 102;
  }
  .button-container{
    display:flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    flex-direction: row;
    margin-top:30px;
  }
  .button-container button{
    margin-left:5px;
    margin-right:5px;
  }
  h1.hero{
    margin-top:10px;
    font-size:48px;
  }`;

const notificationStyle = `
  .notification {
    width: 400px;
    height: 200px;
    border: 1px solid black;
    border-radius: 15px;
    position: absolute;
    z-index: 1000;
    top: 100px;
    left: 75px;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 15px;
    justfify-content: space-around;
  }

  .notification .title {
    font-size: 18px;
    flex-grow: 1;
  }

  .notification .body {
    font-size: 14px;
    flex-grow: 2;
  }

  .notification .body p {
    margin: 10px 0;
  }

  .notification .footer {
    flex-grow: 1;
  }


`;
module.exports = {
  dialog,
  loginStyle,
  errorDialog,
  notificationStyle,
};
