var commands = require("commands");

const {
  alert,
  confirm
} = require("./lib/dialogs.js");

window.jQuery = window.$ = require("./lib/jquery.min.js");
const fs = require("uxp").storage.localFileSystem;

$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });


var $stored_auth_token = "";
var validate = false;
var useTest = {};
useTest['use_test'] = {};
useTest['user'] = {};
var test_json = {}
var customer_attr = {};
var default_questions;
var survey_question_types;
var default_survey_question_types;
var ut_tasks = {};
var test_screener_questions;
var test_screener_questions_json = {};
var survey_questions_json = {};
var ut_tasks_json = {};
var demographics;
var video_recording_times;
var sus_surveys;
var default_sus_surveys;
var default_demographics_field;
var use_test_ids;
var textareastr = [];
var website_url =  "https://www.trymyui.com"// "https://www.trymyui.com";
var auth_token;
var customer_id;
var tmy_credits;
var private_credits;
var credit_type_value;
var customer_plan = {};
var default_recording_time;
var order_active;
var allowed_question_limit_planwise = {"paid_personal": 4, "team": 4, "enterprise": 16, "enterprise_trial": 16, "unlimited": 16};
var allowed_screener_question_limit = {"paid_personal": 0, "team": 1, "enterprise": 16, "enterprise_trial": 16, "unlimited": 16};
var opt_counter = 9;
var survey_opt_counter = 4;
var country_codes = {1: "us",7: "ru",20: "eg",27: "za",30: "gr",31: "nl",32: "be",33: "fr",34: "es",36: "hu",39: "va",40: "ro",41: "ch",43: "at",44: "gb",45: "dk",46: "se",47: "sj",48: "pl",49: "de",51: "pe",52: "mx",53: "cu",54: "ar",55: "br",56: "cl",57: "co",58: "ve",60: "my",61: "cc",62: "id",63: "ph",64: "nz",65: "sg",66: "th",81: "jp",82: "kr",84: "vn",86: "cn",90: "tr",91: "in",92: "pk",93: "af",94: "lk",95: "mm",98: "ir",211: "ss",212: "eh",213: "dz",216: "tn",218: "ly",220: "gm",221: "sn",222: "mr",223: "ml",224: "gn",225: "ci",226: "bf",227: "ne",228: "tg",229: "bj",230: "mu",231: "lr",232: "sl",233: "gh",234: "ng",235: "td",236: "cf",237: "cm",238: "cv",239: "st",240: "gq",241: "ga",242: "cg",243: "cd",244: "ao",245: "gw",246: "io",248: "sc",249: "sd",250: "rw",251: "et",252: "so",253: "dj",254: "ke",255: "tz",256: "ug",257: "bi",258: "mz",260: "zm",261: "mg",262: "re",263: "zw",264: "na",265: "mw",266: "ls",267: "bw",268: "sz",269: "km",290: "sh",291: "er",297: "aw",298: "fo",299: "gl",350: "gi",351: "pt",352: "lu",353: "ie",354: "is",355: "al",356: "mt",357: "cy",358: "ax",359: "bg",370: "lt",371: "lv",372: "ee",373: "md",374: "am",375: "by",376: "ad",377: "mc",378: "sm",380: "ua",381: "rs",382: "me",383: "xk",385: "hr",386: "si",387: "ba",389: "mk",420: "cz",421: "sk",423: "li",500: "fk",501: "bz",502: "gt",503: "sv",504: "hn",505: "ni",506: "cr",507: "pa",508: "pm",509: "ht",590: "mf",591: "bo",592: "gy",593: "ec",594: "gf",595: "py",596: "mq",597: "sr",598: "uy",599: "cw",670: "tl",672: "nf",673: "bn",674: "nr",675: "pg",676: "to",677: "sb",678: "vu",679: "fj",680: "pw",681: "wf",682: "ck",683: "nu",685: "ws",686: "ki",687: "nc",688: "tv",689: "pf",690: "tk",691: "fm",692: "mh",850: "kp",852: "hk",853: "mo",855: "kh",856: "la",880: "bd",886: "tw",960: "mv",961: "lb",962: "jo",963: "sy",964: "iq",965: "kw",966: "sa",967: "ye",968: "om",970: "ps",971: "ae",972: "il",973: "bh",974: "qa",975: "bt",976: "mn",977: "np",992: "tj",993: "tm",994: "az",995: "ge",996: "kg",998: "uz"}
///// Entry Dialog start///////

let entryDialog;

const entryHtml =

  `<style>
    .startup-dialog {
      height: auto;
      width: 300px;
      margin: 40px 80px !important;
      text-align:center;
    }
    .startup-dialog header {
      margin-bottom:10px !important;
    }
    .close a{
      display: flex;
      flex-direction: row;
      justify-content: end !important;
    }
    .close img{
      text-align: right !important;
    }
    .startup-dialog .center {
      padding-top: 10px;
    }
    .startup-dialog .row {
    	display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .startup-dialog button {
      width: 40%;
    }

    .startup-dialog #free_trial {
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: #88C149 !important;
      padding: 4px 20px 3px 20px;
      border: 1px solid transparent !important;
      text-decoration: none;
      margin-bottom:15px !important;
    }

    .startup-dialog #login {
      border-radius: 6px;
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: #428aca !important;
      padding: 4px 20px 3px 20px;
      border: 1px solid transparent !important;
      text-decoration: none;
      margin-bottom:15px !important;
    }
  
  	.startup-dialog p {
  		font-size: 14px !important;
      color: #000000 !important;
  	}
    .startup-dialog .footer-buttons {
      margin-top: 10px !important;
    }
    .startup-dialog a {
      text-decoration: none !important;
    }
    .startup-dialog .mt20 {
      margin-top: 20px !important;
    }
  </style>
  <div class="overlay-background">
  <div class="close">
        <a href="javascript:void(0);" id="close_app"><img src="close.png" alt="TryMyUi" width="20"></a>
        </div>
  <form method="dialog" class="startup-dialog">

      <header>
      <img src="trymyui_logo.png" alt="TryMyUi" width="150">
    </header>
    <hr>
      <div class="row center">
      	<p>A plugin for getting quick user feedback on your designs via remote usability testing</p>
      </div>
      <div class="center footer-buttons">
      <div class="row">
      	<a href="javascript:void(0);" id="login">Login</a>
      </div>
      <div class="row">
      	<a href="javascript:void(0);" id="free_trial">Free Trial</a>
      </div>
      <div class="row center mt20">
        <p>*Please copy the public link for the prototype you want to test</p>
      </div>
      </div>
  </form></div>`;


function createDialogEntry() {
  entryDialog = document.createElement("dialog");
  entryDialog.innerHTML = entryHtml;
  const loginButton = entryDialog.querySelector("#login");
  const freeTrialButton = entryDialog.querySelector("#free_trial");
  const closeButton = entryDialog.querySelector("#close_app");

  closeButton.addEventListener("click", e => {
    entryDialog.close("reasonCanceled");
    entryDialog.remove();
  })

  loginButton.addEventListener("click", e => {
    entryDialog.close("reasonCanceled");
    entryDialog.remove();
    createDialogLogin();
    loginDialog.showModal();
  });

  freeTrialButton.addEventListener("click", e => {

    const url = `${website_url}/use_tests/create_use_test_adobexd`;
    entryDialog.close("reasonCanceled");
    const callGet = xhrRequestGetCreateTest(url, 'GET');

  });

  document.appendChild(entryDialog);
}

////Entry Dialog End ///////



//// After Use Test Create Customer Account Dialog Start ////

let registrationDialog;

const registrationHtml =
  `<style>
      .registration-dialog {
        height: auto;
        width: 410px;
      }
      .registration-dialog header {
        margin-bottom: 10px !important;
      }
      .registration_step {
        overflow-y: scroll;
      }
      .inner-div {
        width: 360px;
        margin: 0% 10% !important;
      }
  
      .registration-dialog input[type="text"],.registration-dialog input[type="password"] {
        width: 90%;
        margin-left: 0px !important;
      }
      .registration-dialog tr {
        margin-bottom: 5px !important;
      }
      .registration-dialog .flex {
      	display: flex;
      	flex-direction: row;
      }
      .registration-dialog .end-flex {
      	justify-content: flex-end;
        margin-right: 9% !important;
      }
      .registration-dialog .center {
        justify-content: center;
      }

      .registration-dialog .mb5 {
        margin-top: 0px !important;
      }

      .registration-dialog .green_button {
        width: 150px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 21px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .registration-dialog .disabled_button {
        width: 150px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: grey !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

    .registration-dialog #cancel_registartion {
      border: 1px solid #444444;
      border-radius: 6px;
      width: 150px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #000000 !important;
      background: #ffffff !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }
    	.registration-dialog h2 {
	     	font-size: 18px !important;
	     	color: #000000 !important;
	     }
	     .registration-dialog span {
	     	font-size: 14px !important;
	     	color: #000000 !important;
	     }
	     .registration-dialog .heading {
	     	font-size: 14px !important;
	     	color: #000000 !important;
	     	padding-bottom: 15px !important;
	     	padding-top: 5px !important;
        text-align: center !important;
	     }
       .registration-dialog .registration_step {
          min-height: 200px;
          max-height: 420px;
          overflow-y: scroll;
       }
       .registration-dialog .show_password {
          margin-top: 0px !important;
       }
       .registration-dialog .show_password span{
        font-size: 12px !important;
       }
       .registration-dialog .show_password input[type="checkbox"]{
          margin-left: 0px !important;
        }
       .registration-dialog .error {
        color: red !important;
       }
      .registration-dialog .flex {
        display: flex;
        flex-direction: row;
      }
      .registration-dialog .start {
        justify-content: flex-start;
      }
      .registration-dialog .start strong {
        margin-top: 12px !important;
        margin-left: 5px !important;
      }
      .registration-dialog select {
        width: 21%;
        margin-left: 0px !important;
        margin-right: 0px !important;
      }
      .registration-dialog #phone_number {
        width: 64.5% !important;
        margin-top: 8px !important;
        margin-left: 5px !important;
      }
      .registration-dialog .mt0 {
        margin-top: 0px !important;
      }
      .registration-dialog .mb0 {
        margin-bottom: 0px !important;
      }
      .model_error {
        font-size: 14px !important;
        color: red !important;
        margin-left: 0px !important;
        margin-bottom: 10px !important;
      }
      .model_error p{
        margin-left: 0px !important;
      }
    </style>

    </style>
    <div class="white-background">
    <form method="dialog" class="registration-dialog" id="form_registration">
    <header>
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <div class="row center">
      	<h2>Free trial signup</h2>
      </div>
      <hr>
      <div class="registration_step">
        <span class="heading center">Create an account and get the first 5 test results free!</span>
              <div class="inner-div">

      	<table>
      	<tr class="mb5">
          <td><span>Name:</span></td>
          <td><input type="text" id="name" name="user[first_name]" required></td>
       	</tr>
      
      	
        <tr class="mb5">
          <td><span>Work email:</span></td>
          <td><input type="text" id="email" name="user[email]" required></td>
        </tr>
        <tr class="mb5">
      	<td><span>Company name:</span></td>
        <td>
          <input type="text" id="company_name" name="user[company_name]" required>
        </td>
        </tr>
        <tr class="mb5">
      	<td><span>Phone number:</span></td>
        <td class="flex start">
          <select name="user[country_code]" id="country_code">  
            </select><strong>-</strong><input type="text" id="phone_number" name="user[phone_number]" required>
        </td>
        </tr>
        <tr class="mb0">
      	<td><span>Password:</span></td>
        <td>
          <input type="password" id="plain_password" name="user[plain_password]" required>
        </td>
        </tr>
        
        <tr class="mt0">
        <td>
      	<label for="show_password_chkbox" class="row flex end-flex show_password">
      		<span>Show password</span>
          <input type="checkbox" name="show_password_chkbox" id="show_password_chkbox"">
        </label>
        </td>
        </tr>
        </table>
      </div>
      </div>
      <footer class="flex center">
        <a href="javascript:void(0);" id="cancel_registartion">Cancel</a>
        <a href="javascript:void(0);" id="create_registration" class="green_button">Create account</a>
      </footer>
    </form>`;


function createRegistrationDialog(params) {
  registrationDialog = document.createElement("dialog");
  registrationDialog.innerHTML = registrationHtml;

  const cancelRegistrationButton = registrationDialog.querySelector("#cancel_registartion");

  const registrationStepButton = registrationDialog.querySelector("#create_registration");
  const show_password_chkbox = registrationDialog.querySelector("#show_password_chkbox")

  cancelRegistrationButton.addEventListener("click", e => {
    registrationDialog.close("reasonCanceled");
    if (entryDialog) {
      entryDialog.close("reasonCanceled");
      entryDialog.remove();
    }
    createDialogEntry();
    entryDialog.showModal();
  })

  show_password_chkbox.addEventListener("change", e => {
  	var input_password = registrationDialog.querySelector("#plain_password");
  		if (input_password.type === "password") {
  			input_password.type = "text";
  		}else{
  			input_password.type = "password";
  		}
  });

  registrationStepButton.addEventListener("click", e => {
    useTest["user"] = {};
    $('form#form_registration input[required], form#form_registration textarea[required]').each(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("phone_number")){
        $(this).closest("td").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });

    $('form#form_registration input[required], form#form_registration textarea[required]').focus(function() {
      $(this).css("border", "none");
      $(".model_error").remove();
      if ($(this).attr("name").includes("phone_number")){
        $(this).closest("td").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
    });

    var email_validate = false;
    var email = $("#email").val();
    var regex_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex_email.test(email)) {
      $("#email").css("border", "none");
      $("#email").next("span").remove();
      email_validate = false;
      $("#email").after("<span class='error'>Invalid Email</span>");
      $("#email").css("border", "1px solid red");
    } else {
      email_validate = true;
      $("#email").css("border", "none");
      $("#email").next("span").remove();
    }

    var phone_validate = false;
    var phone_number = $("#phone_number").val();
    var regex_phone = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
    if (!regex_phone.test(phone_number)) {
      $("#phone_number").css("border", "none");
      $("#phone_number").closest("td").next("span").remove();
      phone_validate = false;
      $("#phone_number").closest("td").after("<span class='error'>Invalid Phone Number</span>");
      $("#phone_number").css("border", "1px solid red");
    } else {
      phone_validate = true;
      $("#phone_number").css("border", "none");
      $("#phone_number").closest("td").next("span").remove();
    }


    var password_validate = false;
    var password = $("#plain_password").val();
    if (password.length < 4) {
      $("#plain_password").css("border", "none");
      $("#plain_password").next("span").remove();
      password_validate = false;
      $("#plain_password").after("<span class='error'>Password must be greater than 4 characters</span>");
      $("#plain_password").css("border", "1px solid red");
    } else {
      password_validate = true; 
      $("#plain_password").css("border", "none");
      $("#plain_password").next("span").remove();
    }

    if (validate && email_validate && phone_validate && password_validate) {
      $("#create_registration").addClass("disabled_button").removeClass("green_button");
      $("#create_registration").text("Please wait...");
      $("#create_registration").attr("disabled", true);
      var obj = $("form#form_registration").serializeArray();

      $.each(obj, function(i, v) {
        if (v.name != "show_password_chkbox") {
          var name = v.name.split("[")[1].split("]")[0];
          useTest['user'][name] = v.value;
          customer_attr[name] = v.value;
        }
      });

      /// For serializing dropdown data
      var selectData = $("form#form_registration").find('select').map(function() {
        if (this.options[this.selectedIndex] != undefined) {
          var select_value = this.options[this.selectedIndex].getAttribute("value");
          var data_country = this.options[this.selectedIndex].getAttribute("data-country");
          var value = data_country+"|"+select_value
          var name = $(this).attr('name').split("[")[1].split("]")[0];
          customer_attr[name] = value;
          useTest['user'][name] = value;
          return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(value);
        }
      }).get().join('&');

      var url = `${website_url}/login/register_adobexd_user`
      $.ajax({
        url: url,
        type: "GET",
        data: {user: useTest["user"]},
        dataType: 'json',
        success: function(response) {
          if (response.success) {
              registrationDialog.close("reasonCanceled");
              registrationDialog.remove();
              if (newTestDialog) {
                newTestDialog.close("reasonCanceled");
                newTestDialog.remove();
              }
              createNewUseTestDialog();
              return newTestDialog.showModal();        
          } else {
            var error_messages = [];
            $.each(response.errors, function(k,v){
              $.each(v,function(key,val){
                error_messages.push(toTitleCase(k).replace("_"," ")+": "+val);
              })
            })
            $(".model_error").remove();
            $("<div class='model_error'>Please fix below errors:</div>").insertBefore("table");
            $.each(error_messages, function(i,v){
              $("div.model_error").append(`<p>`+v+`</p>`);
            })
            $("#create_registration").addClass("green_button").removeClass("disabled_button");
            $("#create_registration").text("Create account");
            $("#create_registration").removeAttr("disabled");
          }
        },
        error: function(request, error) {
          registrationDialog.close("reasonCanceled");
          registrationDialog.remove();
          if (errorDialog){
            errorDialog.close("reasonCanceled");
            errorDialog.remove();
          }
          createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
          return errorDialog.showModal();
        }
      });
      
    } else {
      e.preventDefault();
    }

  });
  document.appendChild(registrationDialog);
  $.each(country_codes,function(key,value){
    if (key == 1) {
      $("#country_code").append($("<option selected></option>").attr("value", key).text("+"+key).attr("data-code", key).attr("data-country", value));
    }else {
      $("#country_code").append($("<option></option>").attr("value", key).text("+"+key).attr("data-code", key).attr("data-country", value));
    }
  })
}

//// After Use Test Create Customer Account Dialog End //// 



///// Use Test Basic Step Start /////
let newTestDialog;

const newTestHtml =
  `<style>
  		
      .basics-dialog {
        height: auto;
        width: 700px;
      }
      .basic_step {
        height: 480px;
        width: 700px;
        overflow-y: scroll;
        align-items: center;
        margin: 0px 30px 0px 30px !important;
      }

      .basics-dialog hr{
        margin-top: 0px !important;
        margin-bottom: 0px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
      }

      .basics-dialog input[type="text"], .basics-dialog input[type="number"] {
      	width: 70%;
      	margin-left: 25px !important;
      }
      .basics-dialog table {
      	margin-left: 10px !important;
      }
      .basics-dialog .floatBlock {
        margin: 0 1.81em 0 0;
      }
      .basics-dialog .floatBlock label {
        color: #666666 !important;
        font-size: 13px !important;
      }

      .basics-dialog .radioContainer {
        border: none;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        break-before: always;
        margin: 1em;
      }

      .basics-dialog h1 {
        margin-bottom: 10px;
        margin-top: 20px;
      }

      .basics-dialog .head-center {
        text-align: center !important;
        margin-bottom: 20px !important;
      }

      .basics-dialog input[type="checkbox"]{
        vertical-align:middle;
      }

      .basics-dialog .select-label{
        display : inline-block;
        margin-left: 4px;
      }

      .basics-dialog select{
        width: 50%;
      	margin-left: 25px !important;
      }
      .basics-dialog .display_none {
        display: none !important;
      }
      .basics-dialog .display_block {
        display: block !important;
      }
      .basics-dialog .flex {
      	display: flex;
      	flex-direction: row;
      }
      .basics-dialog tr {
      	margin-top: 30px !important;
      }
      .basics-dialog .center-right {
      	justify-content: center;
      	margin-right: 9% !important;
        margin-top: 0px !important;
      }
      .basics-dialog .start {
      	justify-content: flex-start;
      }
      .basics-dialog .end {
        justify-content: flex-end;
      }

      .basics-dialog #new_test {
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 21px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 5px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .basics-dialog .primary-button {
        border: 1px solid #444444;
        border-radius: 6px;
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #000000 !important;
        background: #ffffff !important;
        padding: 5px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }
    	.basics-dialog h2 {
	     	font-size: 18px !important;
	     	color: #000000 !important;
	     }
	   .basics-dialog td,.basics-dialog span, .basics-dialog .select-label {
	     	font-size: 14px !important;
	     	color: #000000 !important;
	     	font-weight: normal !important;
	     }
       .basics-dialog i {
          font-style: italic !important;
          color: #666666 !important;
          font-size: 12px !important;
        }
        .basics-dialog a.upgrade_plan {
          font-style: italic !important;
          font-size: 12px !important;
          text-decoration: underline !important;
          margin-left: 5px !important;
        }

        .basics-dialog span.tester_text {
          font-size: 13px !important;
        }
        .basics-dialog .error {
          color: red !important;
          margin-left: 25px !important;
        }
        .basics-dialog .upgrade_plan_div {
          margin-left: 33px !important;
          margin-top: 0px !important;
        }
        .recording_div, .recorder_orientation_div {
          margin-bottom: 30px !important;
        }
        .basics-dialog #num_testers {
          margin-bottom: 0px !important;
        }
        .basics-dialog .disabled_button {
          width: 150px;
          height: 33px !important;
          border-radius: 4px !important;
          font-style: normal;
          font-size: 14px !important;
          line-height: 20px;
          text-align: center;
          letter-spacing: 0.5px;
          color: #FFFFFF !important;
          background: grey !important;
          padding: 4px 20px;
          text-decoration: none !important;
          margin-left:8px;
          margin-right:8px;
        }
    </style>
    <div class="white-background">
    <form method="dialog" class="basics-dialog form-inline" id="form_new_test">
    <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
      <div class="basic_step">
      <h1 class="text-center">Create a new test - Basics (Step 1 of 4)</h1>
      <table>
        <tr>
          <td><span>Title:</span></td>
          <td><input type="text" name="use_test[title]" id="title" placeholder="Enter your test title" required></td>
        </tr>

        <tr>
	      <td id="url-text"><span>Starting URL:</span></td>
	      <td><input type="text" name="use_test[url]" placeholder="Enter your prototype's sharable link"
	       pattern="https://.*" id="url" required></td>
	      </tr>

	        
      <tr>
      <td><span>Device testers should use:</span></td>
      <td>
      <div id="radioContainer" name="radioContainer" class="radioContainer">

      <div class="floatBlock">
          <label for="tester_platform"><input type="radio" name="use_test[tester_platform]" value="pc_mac" checked> Computer</label>
      </div>

      <div class="floatBlock">
          <label for="tester_platform"><input type="radio" name="use_test[tester_platform]" value="android_all" > Android phone</label>
      </div>

      <div class="floatBlock">
          <label for="tester_platform"><input type="radio" name="use_test[tester_platform]" value="ios_all" > iPhone</label>
      </div>

      <div class="floatBlock">
          <label for="tester_platform"><input type="radio" name="use_test[tester_platform]" value="all_mobile" > All mobile devices</label>
      </div>
      </td>
      </tr>
      
      
      <tr>
        <td><span>Number of testers:</span></td>
        <td><input type="number" name="use_test[num_testers]" id="num_testers" placeholder="Number of Testers" max="50" required>
	      <label for="new_testers_only" class="row flex center-right">
	      <span class="tester_text">Do not allow testers who have performed tests for me before:</span>
	      <input type="checkbox" name="use_test[new_testers_only]" id="new_testers_only" value="true">
	      </label> 
	      </td>
      </tr>

      <tr class="display_block recording_div">
      <td>
      <label class="select-label">Time limit:</label>
      <select name="use_test[recording_time]" id="recording_time">   
      </select>
      </td>
      </tr>

      <tr class="face_recording_div display_none">
      <td>
      <label for="face_recording" class="row flex start" >
      <input type="checkbox" name="use_test[opt_for_face_recording]" id="opt_for_face_recording" value="true"> 
      <span>Include face recording of the users with my test.</span>
      </label>
      </td>
      </tr>

      <tr class="recorder_orientation_div display_none">
      <td>
      <label class="select-label">Screen Orientation:</label>
      <select name="use_test[recorder_orientation]" id="recorder_orientation"> 
      <option value="portrait">Portrait</option> 
      <option value="landscape">Landscape</option>      
      </select>
      </td>
      </tr>

      <tr><td>*1 credit is equivalent to 1 tester</td></tr>

      </table>
      </div>
      <hr>
      <footer class="flex end">
        <a href="javascript:void(0);" id="cancel_basic" class="primary-button display_block">Cancel</a>
        <a href="javascript:void(0);" id="return_to_dashboard" class="primary-button display_none">Cancel</a>
        <a href="javascript:void(0);" id="new_test">Continue</a>
      </footer>
    </form></div>`;


function createNewUseTestDialog(use_test, customer, type, back) {
  newTestDialog = document.createElement("dialog");
  newTestDialog.innerHTML = newTestHtml;

  const cancelButton = newTestDialog.querySelector("#cancel_basic");
  const returnDashboardButton = newTestDialog.querySelector("#return_to_dashboard");

  const newTestButton = newTestDialog.querySelector("#new_test");

  cancelButton.onclick = () => newTestDialog.close("reasonCanceled");

  returnDashboardButton.addEventListener("click", e => {
    $("#return_to_dashboard").addClass("disabled_button").removeClass("primary-button");
    $("#return_to_dashboard").text("Please wait...");
    e.preventDefault();
    var use_test_id = [use_test["id"]];
    var password = useTest['user']["password"];
    var email = useTest['user']["email"];
    var remember_user = false;
    const url = `${website_url}/login_adobexd?user[plain_password]=${useTest['user']["password"]}&user[email]=${useTest['user']["email"]}&user[remember_user]=${useTest['user']["remember_user"]}`;
    const callPost = xhrRequest(url, 'POST', password, email, remember_user);
  })

  newTestButton.addEventListener("click", e => {
    $('form#form_new_test input[required], form#form_new_test .display_block select').each(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#form_new_test input[required],  form#form_new_test .display_block select').focus(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
    });

    var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
    var url = $("#url").val();

    var url_validate = false;
    if (!regex.test(url)) {
      $("#url").css("border", "none");
      $("#url").next("span").remove();
      url_validate = false;
      $("#url").after("<span class='error'>Invalid URL</span>");
      $("#url").css("border", "1px solid red");
    } else {
      url_validate = true;
      $("#url").css("border", "none");
      $("#url").next("span").remove();
    }

    var num_testers_validate = true;
    if( $("#num_testers").val() > 50) {
      $("#num_testers").after("<span class='error'>Number of testers cannot be greater than 50</span>");
      $("#num_testers").css("border", "1px solid red");
      num_testers_validate = false;
    }

    if (validate && url_validate && num_testers_validate) {
      var str = $("form#form_new_test").serialize();
      var obj = $("form#form_new_test").serializeArray();
      test_json["basic_step"] = {};
      $.each(obj, function(i, v) {
        var name = v.name.split("[")[1].split("]")[0];
        useTest['use_test'][name] = v.value || '';
        test_json["basic_step"][name] = v.value || '';
      });

      if (use_test && use_test.hasOwnProperty('id')) {
        useTest['use_test']['id'] = use_test["id"];
      }

      /// For serializing checkboxes
      var checkBoxData = $("form#form_new_test").find('input[type=checkbox]').map(function() {
        var name = this.name.split("[")[1].split("]")[0]; 
        useTest['use_test'][name] = $('#'+name).is(":checked");
      }).get().join('&');

      /// For serializing dropdown data
      var selectData = $("form#form_new_test").find('select').map(function() {
        if (this.options[this.selectedIndex] != undefined) {
          var select_value = this.options[this.selectedIndex].getAttribute("value");
          var name = $(this).attr('name').split("[")[1].split("]")[0];
          useTest['use_test'][name] = select_value;
          test_json["basic_step"][name] = select_value; 
          return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(select_value);
        }
      }).get().join('&');

      if (type == "edit_test") {
        useTest["type"] = "edit_test";
      }
      var new_str = "";
      newTestDialog.close("reasonCanceled");
      newTestDialog.remove();
      const callNextStep = callAudienceStep(new_str, use_test, customer,false);
    } else {
      e.preventDefault();
    }

  });
  document.appendChild(newTestDialog);
  if ((use_test && use_test["id"]) || ((type == "edit_test") || (useTest["type"] == "edit_test"))){
    $("#cancel_basic").addClass("display_none").removeClass("display_block");
    $("#return_to_dashboard").addClass("display_block").removeClass("display_none");
  }else{
    $("#return_to_dashboard").addClass("display_none").removeClass("display_block");
    $("#cancel_basic").addClass("display_block").removeClass("display_none");
  }
  // For adding video recording options on select
  $.each(video_recording_times, function(key, value) {
    $("#recording_time").append($("<option></option>").attr("value", value).text(value+" minutes"));
  });

  var use_test_attr;
  if (back) {
    use_test_attr = useTest["use_test"];
  }else {
    if (!$.isEmptyObject(useTest["use_test"])){
      use_test_attr = useTest["use_test"];
    }else {
      use_test_attr = use_test;
    }
  }
  
    if (!features_allowed_for_plan("face_recording",customer_plan["kind"])) {
      var allowed_plan = next_feature_allowed_plan("face_recording")
      $("<div class='flex flex-start upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#opt_for_face_recording").closest('label'));
      $("#opt_for_face_recording").attr("disabled", true);
    }else{
      $("#opt_for_face_recording").closest('label').next("div.upgrade_plan_div").remove();
      $("#opt_for_face_recording").removeAttr("disabled");
    }

  var num_placeholder_text = "Current credit balance*: " + (tmy_credits || 5) ; //NOTE: considering directly tmy credit balance and not checking if pvt test since we are showing only tmy tests in plugin.
  $('input[name="use_test[num_testers]"]').attr("placeholder", num_placeholder_text);
  if (!$.isEmptyObject(use_test_attr)) {
    if (use_test_attr['tester_platform'] == 'android_all') {
      $(".face_recording_div").removeClass('display_none').addClass('display_block');
      $(".recorder_orientation_div").removeClass('display_none').addClass('display_block');
      if (!$.isEmptyObject(use_test_attr['recorder_orientation'])) {
        $('#recorder_orientation option[value="portrait"]').attr("selected", "selected");
      }else {
        $('#recorder_orientation option[value="'+use_test_attr['recorder_orientation'] +'"]').attr("selected", "selected");
      }
    } else {
      $(".face_recording_div").removeClass('display_block').addClass('display_none');
      $(".recorder_orientation_div").removeClass('display_block').addClass('display_none');
      $('#recorder_orientation option[selected]').removeAttr("selected");
    }
    $("#title").val(use_test_attr["title"]);
    $('input[name="use_test[tester_platform]"][value="' + use_test_attr["tester_platform"] + '"]').prop("checked", true);
    $('input[name="use_test[num_testers]"]').val(use_test_attr["num_testers"]);
    $('input[name="use_test[new_testers_only]"]').prop("checked", use_test_attr["new_testers_only"]);
    if ($.isEmptyObject(use_test_attr["recording_time"])) {
      if ($("#recording_time").find('option[value="'+ default_recording_time +'"]').length == 0) {
        $("#recording_time").append($("<option></option>").attr("value", default_recording_time).text(default_recording_time+" minutes"));
      }
    }else {
      if ($("#recording_time").find('option[value="'+ use_test_attr["recording_time"] +'"]').length == 0) {
        $("#recording_time").append($("<option></option>").attr("value", use_test_attr["recording_time"]).text(use_test_attr["recording_time"]+" minutes"));
      } 
    }
    
    $("#recording_time").find('option[value="'+ use_test_attr["recording_time"] +'"]').attr("selected", "selected");
    if (customer_plan["kind"] == "paid_personal" || customer_plan["kind"] == "team") {
      $("<div class='flex flex-start upgrade_plan_div'><i>(For additional options, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#recording_time"));
    }else{
      $("#recording_time").next("div.upgrade_plan_div").remove();
    }
    $("#url").val(use_test_attr["url"]);
    $('input[name="use_test[opt_for_face_recording]"]').prop("checked", use_test_attr["opt_for_face_recording"]);
  }else{
    $("#recording_time").find('option[value="'+default_recording_time+'"]').attr("selected", "selected");
    if (customer_plan["kind"] == "paid_personal" || customer_plan["kind"] == "team") {
      $("<div class='flex flex-start upgrade_plan_div'><i>(For additional options, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#recording_time"));
    }else{
      $("#recording_time").next("div.upgrade_plan_div").remove();
    }
    $('input[name="use_test[num_testers]"]').val(5);
    $('input[name="use_test[new_testers_only]"]').prop("checked", true);
  }

  // Show hide face recording and orientation on change of device type
  $('input[name="use_test[tester_platform]"]').on("change", function() {
    if ($(this).val() == 'android_all') {
      $(".face_recording_div").removeClass('display_none').addClass('display_block');
      $(".recorder_orientation_div").removeClass('display_none').addClass('display_block');
      $('#recorder_orientation option[value="portrait"]').attr("selected", "selected");
    } else {
      $(".face_recording_div").removeClass('display_block').addClass('display_none');
      $(".recorder_orientation_div").removeClass('display_block').addClass('display_none');
      $('#recorder_orientation option[selected]').removeAttr("selected");
    }
  });

  $(".upgrade_plan").on("click", function(){
    var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
    var upgrade_url = `${website_url}/plan/upgrade?${user_params}`
    require("uxp").shell.openExternal(`${upgrade_url}`);
  })
}

//// Use Test Baisc Step End Dialog ////

//// Use Test Audience Step Dialog Start ////

let stepAudienceDialog;

const stepAudienceHtml =
  `<style>
    .audience_dialog {
      height: auto;
      width: 700px;
    }

    .audience_step {
      height: 480px;
      width: 700px;
      overflow-y: scroll;
      align-items: center;
      margin: 0px 30px 0px 30px;
    }

    .audience_dialog hr{
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    .audience_dialog table {
      margin-left: 10px !important;
    }

    .audience_dialog .floatBlock {
      margin: 0 1.81em 0 0;
    }

    .audience_dialog .floatBlock label{
      color: #666666 !important;
      font-size: 13px !important;
    }

    .audience_dialog tr{
      margin-top: 30px !important;
    }

    .audience_dialog .radioContainer {
      border: none;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      break-before: always;
      margin: 1em;
    }

    .audience_dialog input[type="checkbox"]{
      vertical-align:middle;
    }
    .audience_dialog h1 {
      margin-bottom: 10px;
      margin-top: 20px;
    }

    .audience_dialog .select-label{
      display : inline-block;
      margin-left: 4px;
    }

    .audience_dialog select{
      margin-top : 10px;
      width: 50%;
    }
    .audience_dialog .head-center {
      text-align: center !important;
      margin-bottom: 20px !important;
    }

    .audience_dialog #audience_step_button {
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 21px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: #88C149 !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }

    .audience_dialog #cancel_audience {
      border: 1px solid #444444;
      border-radius: 6px;
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #000000 !important;
      background: #ffffff !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }
    .screener_question_div {
      margin-left: 25px !important;
    }

    .audience_dialog table {
      margin-bottom: 40px !important;
      padding-bottom: 40px !important;
    }

    .audience_dialog .display_none {
        display: none !important;
      }
    .audience_dialog .display_block {
        display: block !important;
      }
    .audience_dialog h2 {
      font-size: 18px !important;
      color: #000000 !important;
     }
    .audience_dialog td,.audience_dialog label,.audience_dialog span {
      font-size: 14px !important;
      color: #000000 !important;
      font-weight: normal !important;
     }
     .audience_dialog .flex {
        display: flex !important;
        flex-direction: row !important;
        align-items: baseline;
      }
 
      .audience_dialog .start {
        justify-content: flex-start !important;
      }
      .audience_dialog .end {
        justify-content: flex-end;
      }
      .audience_dialog i {
        font-style: italic !important;
        color: #666666 !important;
      }
      .audience_dialog #add_screener_questions {
        margin-left: 25px !important;
      }
      .audience_dialog .que-center {
        justify-content: center;
        margin-top: 0px !important;
      }
      .audience_dialog textarea, .audience_dialog input[type="text"], .audience_dialog input[type="number"] {
        width: 70%;
        margin-left: 23px !important;
      }
      .audience_dialog select.screener_questions_ans_type {
        margin-top: 0px !important;
        width: 250px !important;
        margin-bottom: 0px !important;
      }
      .audience_dialog .screening_option_fields {
        margin-left: 45px !important;  
        margin-top: 15px !important;
      }
      .audience_dialog .screening_option_fields input[type="text"] {
        width: 68% !important;
      }
      .audience_dialog .add_screening_options {
        margin-left: 65px !important;
        margin-top: 15px !important;
      }
      .audience_dialog a {
        text-decoration: underline !important;
      }
      .audience_dialog select.screening_option_action {
        margin-top: 0px !important;
        width: 150px !important;
        margin-left: 102px !important;
      }
      .audience_dialog a.remove_screening_options {
        margin-left: 138px !important;
        margin-top: 0px !important;
      }
      .audience_dialog textarea {
        height: 33px !important;
      }
      .audience_dialog .require_answer_options {
        margin-left: 65px !important;
        margin-top: 15px !important;
      }
      .audience_dialog .require_answer_options span{
        font-size: 11px !important;
      }
      .audience_dialog .require_answer_options input {
        width: 5%;
        margin-top: 10px !important;
        margin-left: 0px !important;
        margin-right: 8px !important;
      }
      .audience_dialog .require_answer_options select {
        width: 14% !important;
        margin-left: 8px !important;
        margin-right: 8px !important;
      }
      .audience_dialog .secondary-text {
        font-size: 12px !important;
        margin-top: 5px !important;
        padding-bottom: 10x !important;
      }
      .audience_dialog a, .audience_dialog a span {
        font-size: 12px !important;
        color: #56abcc !important;
      }
      .audience_dialog .add_screening_options img {
        margin-right: 5px !important
      }
      .audience_dialog #add_screener_questions img {
        margin-right: 5px !important
      }
      .audience_dialog .error {
        color: red !important;
        margin-left: 25px !important;
      }
      .audience_dialog .upgrade_plan_div {
        margin-left: 25px !important;
      }
      .audience_dialog .upgrade_plan_div i{ 
        font-style: italic !important;
        color: #666666 !important;
        font-size: 12px !important;
      }
      .audience_dialog .upgrade_plan_div a{ 
        font-style: italic !important;
        font-size: 12px !important;
        margin-left: 5px !important;
      }
      .audience_dialog .more_answers span {
        font-style: italic !important;
        color: #666666 !important;
        font-size: 12px !important;
        margin-left: 65px !important;
      }
      .audience_dialog .more_questions span, span.min-options {
        font-style: italic !important;
        color: #666666 !important;
        font-size: 12px !important;
        margin-left: 25px !important;
      }
      .audience_dialog span.min-options {
        margin-left: 65px !important;
      }
      .audience_dialog span.option_count {
        font-style: italic !important;
        color: #666666 !important;
        font-size: 12px !important;
        margin-left: 65px !important;
      }
      .audience_dialog #min_age,.audience_dialog #max_age {
        width: 8% !important;
        margin-left: 5px !important;
        margin-right: 0px !important;
      }
      .audience_dialog #div_min_max_age span {
        font-size: 12px !important;
      }
      .audience_dialog #div_min_max_age .first_span {
        margin-left: 10px !important;
      }
      .audience_dialog #div_min_max_age .min_age_span, .audience_dialog #div_min_max_age .max_age_span {
        margin-left: 5px !important;
      }
      #technical_screener, #qualification_text {
        margin-top: 5px !important;
      }
      .screener_question_div .que-center span { 
        margin-right: 5px;
        margin-top: -3px !important;
      }
      .screener_question_div .que-center {
        margin-left: 25px !important;
      }
      .screener_question_div textarea {
        margin-top: 20px !important;
      }
      .audience_dialog .min_max_error {
        font-size: 12px !important;
      }
    </style>
    <div class="white-background">
    
    <form method="dialog" class="audience_dialog form-inline" id="form_audience_step">
    <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
    <div class="audience_step">
      <h1>Create a new Test - Audience (Step 2 of 4)</h1>
      <table>
        <tr>
        <td><span>Recruit from TryMyUI's panel</span></td>
        <td>
        <div id="radioContainer" name="radioContainer" class="radioContainer">

        <div class="floatBlock">
            <label for="testing_type"><input type="radio" name="use_test[testing_type]" value="trymyui_testers" checked>Use TryMyUI's panel</label>
        </div>

        
        </td>
        </tr>
        
        <tr class="own_test_title_div display_none">
          <td>
            <span>Enter a test title that will be shown to testers:</span>
          </td>
          <td>
            <input type="text" placeholder="Enter a title" id="own_test_title" name="use_test[own_test_title]">
          </td>
        </tr>

        <tr class="demographics_select">
        <td class="flex start"><div>Demographics</div><div><i>&nbsp;(Optional):</i></div></td>

        <td>
        <select name="use_test[gender][]" id="gender">    
        </select>
        </td>
  
        <td>
        <select name="use_test[age][]" id="age">        
        </select>
        </td>

        <td class="display_none" id="div_min_max_age">
          <div class="flex">
            <span class="first_span">Or, set a custom age range:</span>
            <input type="number" name="use_test[min_age]" min=18 id="min_age"/>
            <span class="min_age_span">(Min) to</span>
            <input type="number" name="use_test[max_age]" id="max_age"/>
            <span class="max_age_span">(Max)</span>
          </div>
        </td>
    
        <td>
        <select name="use_test[country][]" id="country">        
        </select>
        </td>
    
        <td>
        <select name="use_test[income][]" id="income">        
        </select>
        </td>

        <td>
        <select name="use_test[education][]" id="education">        
        </select>
        </td>
  
        <td>
        <select name="use_test[employment_type][]" id="employment_type">        
        </select>
        </td>

        <td class="display_none" id="div_employment_status">
        <select name="use_test[employment_status][]" id="employment_status">        
        </select>
        </td>
 
        <td>
        <select name="use_test[family_status][]" id="family_status">        
        </select>
        </td>
  
        <td>
        <select name="use_test[children_status][]" id="children_status">        
        </select>
        </td>

        <td>
        <select name="use_test[community_type][]" id="community_type">        
        </select>
        </td>
   
        <td>
        <select name="use_test[social_networks_usage][]" id="social_networks_usage">        
        </select>
        </td>
        </tr>

        <tr class="display_block">
        <td class="flex start"><div><span>Verbal Screener </span></div><div><i>&nbsp;(Optional):</i></div></td>
        <td>
        <span class="secondary-text">A custom screener that testers will verbally respond to</span>
        <textarea name="use_test[qualification_text]" id="qualification_text" form="form_test_script" placeholder="Enter a verbal screener, e.g. 'Must be a dog owner to take this test' "></textarea>
        </td>
        </tr>

        <tr class="display_block">
        <td class="flex start"><div></span>Technical Screener </span></div><div><i>&nbsp;(Optional):</i></div></td>
        <td>
        <span class="secondary-text">A device / OS / other technical requirements for taking this test</span>
        <textarea name="use_test[technical_screener]" id="technical_screener" form="form_test_script" placeholder="Enter a technical screener, e.g. 'Must use Google Chrome to take this test.'"></textarea>
        </td>
        </tr>

        <tr>
        <td class="flex start"><div><span>Multi-choice screener survey </span></div><div><i>&nbsp;(Optional):</i></div></td>
        </tr>
        
        <tr class="display_none screener_question_div">
        <td>
        <span class="question_index">Question 1:</span>
        <div class="flex start"><span>(</span><a href="javascript:void(0);" data-id="old_0" class="remove_screener_questions">Remove</a><span>)</span></div>
        <textarea name="use_test[screener_questions_attributes][old_0][title]" class="screener_questions" placeholder="Enter your screener question" required></textarea>
        <div class="flex que-center">
        <span>Type:</span>
        <select name="use_test[screener_questions_attributes][old_0][ans_type]" data-id="old_0" class="screener_questions_ans_type">
        <option value="single_select">Single-select</option>
        <option value="multi_select">Multi-select</option>
        </select>
        </div>
        <div class="screening_option_fields">
          <input type="text" placeholder="Enter an answer option" name="use_test[screener_questions_attributes][old_0][screening_options_attributes][old_type_0][name]" required>
          <div class="flex que-center">
          <select name="use_test[screener_questions_attributes][old_0][screening_options_attributes][old_type_0][action]" class="screening_option_action">
          </select>
          </div>
          <div class="flex que-center">
          <a href="javascript:void(0);" class="remove_screening_options" data-id="old_type_0">Remove this answer</a>
          </div>
        </div>
        <div class="screening_option_fields">
          <input type="text" placeholder="Enter an answer option" name="use_test[screener_questions_attributes][old_0][screening_options_attributes][old_type_1][name]" required>
          <div class="flex que-center">
          <select name="use_test[screener_questions_attributes][old_0][screening_options_attributes][old_type_1][action]" class="screening_option_action">
          </select>
          </div>
          <div class="flex que-center">
          <a href="javascript:void(0);" class="remove_screening_options" data-id="old_type_1">Remove this answer</a>
          </div>
        </div>
        <a href="javascript:void(0);" class="add_screening_options flex start" data-id="old_0"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a>
        <span class="min-options">*Minimum 2 options required</span>
        </div>
        </td>
        </tr>

        <tr>
        <td>
        <a href="javascript:void(0);" id="add_screener_questions" class="flex start"><div><img src="add-btn.svg" width="20"></img>&nbsp;</div>&nbsp;<div>Add screener question</div></a>
        </td>
        </tr>

        </table>
        </div>
        <hr>
        <footer class="flex end">
          <a href="javascript:void(0);" id="cancel_audience">Back</a>
          <a href="javascript:void(0);" id="audience_step_button">Continue</a>
        </footer>
    </form></div>`;


function createStepAudienceDialog(params, use_test, customer, back) {
  stepAudienceDialog = document.createElement("dialog");
  stepAudienceDialog.innerHTML = stepAudienceHtml;

  const cancelButton = stepAudienceDialog.querySelector("#cancel_audience");

  const audienceStepButton = stepAudienceDialog.querySelector("#audience_step_button");

  const addScreenerQuestionButton = stepAudienceDialog.querySelector("#add_screener_questions");

  var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");

  var addScreeningOptionButton = stepAudienceDialog.querySelectorAll(".add_screening_options");
  var removeScreeningOptionButton = stepAudienceDialog.querySelectorAll(".remove_screening_options");

  addScreenerQuestionButton.addEventListener("click", e => {      
      if (!features_allowed_for_plan("worker_screening",customer_plan["kind"])) {
        $(".upgrade_plan_div").remove();
        $("#add_screener_questions").removeAttr("disabled");
        var allowed_plan = next_feature_allowed_plan("worker_screening")
        $("<div class='flex flex-start upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
        $("#add_screener_questions").attr("disabled", true);
      }else if (($(".screener_questions").length >= allowed_screener_question_limit[customer_plan["kind"]]) && (!$(".screener_questions").closest("tr").hasClass('display_none'))) {
        $(".upgrade_plan_div").remove();
        $("#add_screener_questions").removeAttr("disabled");
        if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
          $("<div class='flex flex-start upgrade_plan_div'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
          $("#add_screener_questions").attr("disabled", true);
        }else{
          $("#add_screener_questions").next(".upgrade_plan_div").remove();
          $("#add_screener_questions").attr("disabled",true);
          if ($(".more_questions").length == 0) {
            $('<div class="more_questions"><span>(You cannot add more than 16 screener questions.)</span></div>').insertAfter($("#add_screener_questions"));
            $("#add_screener_questions").addClass("display_none");
          }
        }
      }else{
        $(".upgrade_plan_div").remove();
        $(".more_questions").remove();
        $("#add_screener_questions").removeAttr("disabled");
  
        if ($(".screener_questions").length == 1 && $(".screener_questions").closest("tr").hasClass('display_none')) {
          var added_tr = $('.screener_questions:last').closest("tr");
          $('.screener_questions:last').closest("tr").removeClass("display_none").addClass("display_block");
          $(".screener_questions_ans_type:last").find('option[value="single_select"]').prop("selected", true);
          $('.screening_option_fields select:first').append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
          $('.screening_option_fields select:last').append('<option value="Allow">allow</option><option value="Reject" selected>reject</option>');

          var selectOptionType = stepAudienceDialog.querySelectorAll(".screener_questions_ans_type");

          for (var i = 0; i < selectOptionType.length; i++) {
            selectOptionType[i].addEventListener('change', function() {
              // if (this.options[this.selectedIndex].length > 0){
              $(this).closest('tr').find(".option_count").remove();
              if (this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
                $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
                  $(element).find('option').remove();
                  $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
                });
              } else {
                var select_options = $(this).closest("tr").find('.screening_option_fields select');
                $(this).closest("tr").find(".require_answer_options").remove();
                $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
                  $(element).find('option').remove();
                  $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
                });
              }
              // }
            });
          }


          var addScreeningOptionButton = added_tr.find(".add_screening_options");

          for (var i = 0; i < addScreeningOptionButton.length; i++) {
            addScreeningOptionButton[i].addEventListener('click', function() {
              $(this).closest('tr').find(".min-options").remove();
              if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
                $(this).addClass("display_none").removeClass("display_block");
                $(this).attr("disabled",true);
                $(this).closest("tr").find(".more_answers").remove();
                $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this));
              }else{
                $(this).removeClass("display_none").addClass("display_block");
                $(this).removeAttr("disabled");
                $(this).closest("tr").find(".more_answers").remove();
                $(this).closest('tr').find(".option_count").remove();
                var add_screening_option = $(this).closest('tr');
                var clone = $(this).closest('tr').find(".screening_option_fields:last").clone();
                var que_id = $(this).attr('data-id');
                var option_id = Number(clone.find('a').attr("data-id").split("_")[2]);

                clone.find('input').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][name]").val("");
                clone.find('select').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][action]")
                clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                clone.insertAfter($(this).closest('tr').find(".screening_option_fields:last"));
                $(this).closest('tr').find(".screening_option_fields:last select option").remove();
                $(this).closest('tr').find("select:first").each(function() {
                  var select_value = this.options[this.selectedIndex].getAttribute('value');
                  if (select_value == "multi_select") {
                    $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
                  } else {
                    $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
                  }
                });


                var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");

                for (var i = 0; i < removeScreeningOptionButton.length; i++) {
                  removeScreeningOptionButton[i].addEventListener('click', function() {
                    var remove_answer = $(this);
                    var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                    var actionlist = []
                    add_screening_option.find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    
                    if (removeScreeningOptionButton.length > 2) {
                      $(this).closest('div.screening_option_fields').find(".min-options").remove();
                      var remove_allowed = true;
                      $(this).closest('tr').find("select:first").each(function() {
                        var select_value = this.options[this.selectedIndex].getAttribute('value');
                        if (select_value == "multi_select") {
                          $(this).closest('tr').find(".option_count").remove();
                          if (!(countElement('Require', actionlist) >= 1) || !(countElement('Allow', actionlist) >= 1)) {
                            var answer_value;
                            $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                              answer_value = this.selectedIndex;
                            })
                            if(answer_value == 0 || answer_value == 2) {
                              $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                              remove_allowed = false;
                            }
                          }
                        } else {
                          $(this).closest('tr').find(".option_count").remove();
                          if (countElement('Allow', actionlist) <= 1) {
                            var answer_value;
                            $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                              answer_value = this.selectedIndex;
                            })
                           
                            if(answer_value == 0) {
                              $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                              remove_allowed = false;
                            }
                          }
                        }
                      });
                      if (remove_allowed) {
                        if (!$.isEmptyObject(test_screener_questions_json)) {
                          var opt_id = $(this).attr("data-id");
                          var q_id = $(this).closest('tr').find("a").attr("data-id");
                          delete test_screener_questions_json[q_id]["screening_options_attributes"][opt_id];
                        }
                        $(this).closest('div.screening_option_fields').remove();
                      }
                    }
                    var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                    if (removeScreeningOptionButton.length == 2){
                      $(this).closest('tr').find(".min-options").remove();
                      $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter(add_screening_option.find(".add_screening_options:last"));
                     //// For removing require text box after rremoving screeenr option if count is less than 2
                    }
                    var actionlist = []
                    add_screening_option.find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    
                    if (countElement('Require', actionlist) > 1) {
                      if (add_screening_option.find(".require_answer_options").length == 0) {
                        var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                        var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                        
                        $(require_text).insertAfter(add_screening_option.find(".add_screening_options:last"));

                      }
                    } else {
                      if (!$.isEmptyObject(test_screener_questions_json)) {
                        var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                        delete test_screener_questions_json[id]["require_answer_count"];
                        delete test_screener_questions_json[id]["answer_limit_type"];
                      }
                      add_screening_option.find(".require_answer_options").remove();
                    }
                    

                    if ($(this).closest('tr').find(".screening_option_fields").length < opt_counter) {
                      $(this).closest('tr').find(".add_screening_options").removeAttr("disabled");
                      add_screening_option.find(".add_screening_options").next(".more_answers").remove();
                    }
                  });
                }

                var addScreeningActionButton = stepAudienceDialog.querySelectorAll(".screening_option_action");
                for (var i = 0; i < addScreeningActionButton.length; i++) {
                  addScreeningActionButton[i].addEventListener('change', function() {
                    var add_option = this;
                    var actionlist = []
                    $(this).closest('tr').find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    $(this).closest('tr').find("select:first").each(function() {
                      var select_value = this.options[this.selectedIndex].getAttribute('value');
                      $(this).closest('tr').find(".screening_option_action").each(function() {
                        // if (this.options[this.selectedIndex].length > 0){
                        actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                        // }
                      });
                      if (select_value == "multi_select") {
                        $(this).closest('tr').find(".option_count").remove();
                        if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                          $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          add_option.selectedIndex = 0;

                        }
                      } else {
                        $(this).closest('tr').find(".option_count").remove();
                        if (countElement('Allow', actionlist) < 1) {
                          $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          add_option.selectedIndex = 0;
                        }
                      }
                    });
                    var actionlist = []
                    $(this).closest('tr').find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    if (countElement('Require', actionlist) > 1) {
                      if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                        var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                        var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                        
                        $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                      }
                    } else {
                      if (!$.isEmptyObject(test_screener_questions_json)) {
                        var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                        delete test_screener_questions_json[id]["require_answer_count"];
                        delete test_screener_questions_json[id]["answer_limit_type"];
                      }
                      $(this).closest('tr').find(".require_answer_options").remove();
                    }
                    
                  });
                }
              }
              if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
                $(this).addClass("display_none");
                $(this).attr("disabled",true);
                $(this).closest("tr").find(".more_answers").remove();
                $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this));
              }
            });
          }

          var addScreeningActionButton = stepAudienceDialog.querySelectorAll(".screening_option_action");
          for (var i = 0; i < addScreeningActionButton.length; i++) {
            addScreeningActionButton[i].addEventListener('change', function() {
              var add_option = this;
              var actionlist = []
              $(this).closest('tr').find(".screening_option_action").each(function() {
                // if (this.options[this.selectedIndex].length > 0){
                actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                // }
              });

              if (countElement('Require', actionlist) > 1) {
                if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                  
                  $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                }
              } else {
                if (!$.isEmptyObject(test_screener_questions_json)) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  delete test_screener_questions_json[id]["require_answer_count"];
                  delete test_screener_questions_json[id]["answer_limit_type"];
                }
                $(this).closest('tr').find(".require_answer_options").remove();
              }

              $(this).closest('tr').find("select:first").each(function() {
                var select_value = this.options[this.selectedIndex].getAttribute('value');
                $(this).closest('tr').find(".screening_option_action").each(function() {
                  // if (this.options[this.selectedIndex].length > 0){
                  actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                  // }
                });
                if (select_value == "multi_select") {
                  $(this).closest('tr').find(".option_count").remove();
                  if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                    $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                    add_option.selectedIndex = 0;

                  }
                } else {
                  $(this).closest('tr').find(".option_count").remove();
                  if (countElement('Allow', actionlist) < 1) {
                    $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                    add_option.selectedIndex = 0;
                  }
                }
              });
            });
          }

          var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");

          for (var i = 0; i < removeScreenerQuestionButton.length; i++) {
            removeScreenerQuestionButton[i].addEventListener('click', function() {
              var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");
              if (!$.isEmptyObject(test_screener_questions_json)) {
                var q_id = $(this).attr("data-id");
                delete test_screener_questions_json[q_id];
              }

              $($(this).closest('tr').find("input[required]") ,$(this).closest('tr').find("textarea[required]")).each(function() {
                $(this).css("border", "none");
                if ($(this).attr("name").includes("require_answer_count")) {
                  $(this).closest("div.require_answer_options").next("span").remove();
                }else{
                  $(this).next("span").remove();
                }
                validate = true;
              })
              if (removeScreenerQuestionButton.length > 1) {
                $(this).closest('tr').remove();
                $(".screener_question_div").each(function(index) {
                  $(this).find("span:first").text("Question "+(index+1)+":");
                })
              }else{
                $(this).closest('tr').removeClass("display_block").addClass("display_none");
              }

              if (($(".screener_questions").length <= allowed_screener_question_limit[customer_plan["kind"]]) && ($(".screener_questions").closest("tr").hasClass('display_none'))) {
                $("#add_screener_questions").next(".upgrade_plan_div").remove();
                $("#add_screener_questions").removeClass("display_none").addClass("display_block");
                $("#add_screener_questions").removeAttr("disabled");
                $(".more_questions").remove();
              }
            });
          }
          if (($(".screener_questions").length >= allowed_screener_question_limit[customer_plan["kind"]]) && (!$(".screener_questions").closest("tr").hasClass('display_none'))) {
            $(".upgrade_plan_div").remove();
            $("#add_screener_questions").removeAttr("disabled");
            if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
              $("<div class='flex flex-start upgrade_plan_div'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
              $("#add_screener_questions").attr("disabled", true);
            }else{
              $("#add_screener_questions").next(".upgrade_plan_div").remove();
              $("#add_screener_questions").attr("disabled", true);
              if ($(".more_questions").length == 0) {
                $('<div class="more_questions"><span>(You cannot add more than 16 screener questions.)</span></div>').insertAfter($("#add_screener_questions"));
                $("#add_screener_questions").addClass("display_none");
              }
            }
          }
        } else {

          $("#add_screener_questions").next(".upgrade_plan_div").remove();
          $(".more_questions").remove();
          $("#add_screener_questions").removeAttr("disabled");
          var clone = $('.screener_questions:last').closest('tr').clone();
          var id = Number($('.screener_questions:last').attr('name').split("title")[0].split("][")[1].split("_")[1]);
          clone.find('textarea').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][title]");
          clone.find('a.remove_screener_questions').attr("data-id", "new_" + (id + 1)).text("Remove");
          clone.find('a.remove_screener_questions').prev("span").text("(");
          clone.find('a.remove_screener_questions').next("span").text(")");
          var que_number = Number(clone.find("span:first").text().split(" ")[1].split(":")[0]);
          clone.find("span.question_index").text("Question "+(que_number+1)+":");
          $.each(clone.find('.screening_option_fields'), function(k, v) {
            if (k > 1) {
              $(this).remove();
            }
          })
          clone.find(".require_answer_options").remove();
          clone.find('select:first').find('option').remove();
          clone.find('.screening_option_fields select:last').find('option').remove();
          clone.find('.screening_option_fields select:first').find('option').remove();
          clone.find("input:first").val("");
          clone.find('select:first').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][ans_type]").attr("data-id", "new_" + (id + 1)).append('<option value="single_select" selected>Single-select</option><option value="multi_select">Multi-select</option>');
          clone.find('select:first').closest(".que-center").find("span").text("Type:");
          clone.find('.add_screening_options').attr("data-id", "new_" + (id + 1)).html('<img src="add-btn.svg" width="20"></img><span>Add answer</span>');
          $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter(clone.find('.add_screening_options'));
          clone.find('.screening_option_fields input:first').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][screening_options_attributes][" + ("new_type_" + (id + 1)) + "][name]").val("");
          clone.find('.screening_option_fields input:last').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][screening_options_attributes][" + ("new_type_" + (id + 2)) + "][name]").val("");
          clone.find('.screening_option_fields select:first').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][screening_options_attributes][" + ("new_type_" + (id + 1)) + "][action]").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
          clone.find('.screening_option_fields select:last').attr("name", "use_test[screener_questions_attributes][" + ("new_" + (id + 1)) + "][screening_options_attributes][" + ("new_type_" + (id + 2)) + "][action]").append('<option value="Allow">allow</option><option value="Reject" selected>reject</option>');
          clone.find('.screening_option_fields a:first').attr("data-id", "new_type_" + (id + 1)).text("Remove this answer");
          clone.find('.screening_option_fields a:last').attr("data-id", "new_type_" + (id + 2)).text("Remove this answer");
          clone.insertAfter($('.screener_questions:last').closest('tr'));


          var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");

          for (var i = 0; i < removeScreenerQuestionButton.length; i++) {
            removeScreenerQuestionButton[i].addEventListener('click', function() {
              var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");
              if (!$.isEmptyObject(test_screener_questions_json)) {
                var q_id = $(this).attr("data-id");
                delete test_screener_questions_json[q_id];
              }
              $($(this).closest('tr').find("input[required]") ,$(this).closest('tr').find("textarea[required]")).each(function() {
                $(this).css("border", "none");
                if ($(this).attr("name").includes("require_answer_count")) {
                  $(this).closest("div.require_answer_options").next("span").remove();
                }else{
                  $(this).next("span").remove();
                }
                validate = true;
              })
              if (removeScreenerQuestionButton.length > 1) {
                $(this).closest('tr').remove();
                $(".screener_question_div").each(function(index) {
                  $(this).find("span:first").text("Question "+(index+1)+":");
                })
              }else{
                $(this).closest('tr').removeClass("display_block").addClass("display_none");
              }
              if ($(".screener_questions").length < allowed_screener_question_limit[customer_plan["kind"]]) {
                $("#add_screener_questions").next(".upgrade_plan_div").remove();
                $("#add_screener_questions").removeAttr("disabled");
                $(".more_questions").remove();
                $("#add_screener_questions").addClass("display_none");
              }
            });
          }

          var selectOptionType = stepAudienceDialog.querySelectorAll(".screener_questions_ans_type");

          for (var i = 0; i < selectOptionType.length; i++) {
            selectOptionType[i].addEventListener('change', function() {
              // if (this.options[this.selectedIndex].length > 0){
              $(this).closest('tr').find(".option_count").remove();
              if (this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
                $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
                  $(element).find('option').remove();
                  $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
                });
              } else {
                $(this).closest("tr").find(".require_answer_options").remove();
                var select_options = $(this).closest("tr").find('.screening_option_fields select');
                $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
                  $(element).find('option').remove();
                  $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
                });
              }
              // }
            });
          }

          var addScreeningOptionButton = clone.find(".add_screening_options");

          for (var i = 0; i < addScreeningOptionButton.length; i++) {
            addScreeningOptionButton[i].addEventListener('click', function() {
              $(this).closest('tr').find(".min-options").remove();
              if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
                $(this).addClass("display_none").removeClass("display_block");
                $(this).attr("disabled",true);
                $(this).closest("tr").find(".more_answers").remove();
                $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this))
              }else{
                $(this).closest('tr').find(".option_count").remove();
                $(this).removeClass("display_none");
                var add_screening_option = $(this).closest('tr');
                $(this).removeAttr("disabled");
                $(this).closest("tr").find(".more_answers").remove();
                var clone = $(this).closest('tr').find(".screening_option_fields:last").clone();
                var que_id = $(this).attr('data-id');
                var option_id = Number(clone.find('a').attr("data-id").split("_")[2]);
                clone.find('input').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][name]").val("");
                clone.find('select').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][action]")
                clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                clone.insertAfter($(this).closest('tr').find(".screening_option_fields:last"));
                $(this).closest('tr').find(".screening_option_fields:last select option").remove();
                $(this).closest('tr').find("select:first").each(function() {
                  var select_value = this.options[this.selectedIndex].getAttribute('value');
                  if (select_value == "multi_select") {
                    $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
                  } else {
                    $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
                  }
                });


                var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");

                for (var i = 0; i < removeScreeningOptionButton.length; i++) {
                  removeScreeningOptionButton[i].addEventListener('click', function() {
                    var remove_answer = $(this);
                    var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                    var actionlist = []
                    add_screening_option.find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    
                    if (removeScreeningOptionButton.length > 2) {
                      var remove_allowed = true;
                      $(this).closest('tr').find("select:first").each(function() {
                        var select_value = this.options[this.selectedIndex].getAttribute('value');
                        if (select_value == "multi_select") {
                          $(this).closest('tr').find(".option_count").remove();
                          if (!(countElement('Require', actionlist) >= 1) || !(countElement('Allow', actionlist) >= 1)) {
                            var answer_value;
                            $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                              answer_value = this.selectedIndex;
                            })
                            if(answer_value == 0 || answer_value == 2) {
                              $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                              remove_allowed = false;
                            }
                          }
                        } else {
                          $(this).closest('tr').find(".option_count").remove();
                          if (countElement('Allow', actionlist) <= 1) {
                            var answer_value;
                            $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                              answer_value = this.selectedIndex;
                            })
                           
                            if(answer_value == 0) {
                              $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                              remove_allowed = false;
                            }
                          }
                        }
                      });
                      if (remove_allowed) {
                        if (!$.isEmptyObject(test_screener_questions_json)) {
                          var opt_id = $(this).attr("data-id");
                          var q_id = $(this).closest('tr').find("a").attr("data-id");
                          delete test_screener_questions_json[q_id]["screening_options_attributes"][opt_id];
                        }
                        $(this).closest('div.screening_option_fields').remove();
                      }
                    }
                    var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                    if(removeScreeningOptionButton.length == 2){
                      $(this).closest('tr').find(".min-options").remove();
                      $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter(add_screening_option.find(".add_screening_options:last"));
                     //// For removing require text box after rremoving screeenr option if count is less than 2
                    }
                    var actionlist = []
                    add_screening_option.find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });
                    if (countElement('Require', actionlist) > 1) {
                      if (add_screening_option.find(".require_answer_options").length == 0) {
                        var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                        var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                        
                        $(require_text).insertAfter(add_screening_option.find(".add_screening_options:last"));
                      }
                    } else {
                      if (!$.isEmptyObject(test_screener_questions_json)) {
                        var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                        delete test_screener_questions_json[id]["require_answer_count"];
                        delete test_screener_questions_json[id]["answer_limit_type"];
                      }
                      add_screening_option.find(".require_answer_options").remove();
                    }
                    if ($(this).closest('tr').find(".screening_option_fields").length < opt_counter) {
                      $(this).closest('tr').find(".add_screening_options").removeAttr("disabled");
                      add_screening_option.find(".add_screening_options").next(".more_answers").remove();
                    }
                  });
                }

                var addScreeningActionButton = stepAudienceDialog.querySelectorAll(".screening_option_action");
                for (var i = 0; i < addScreeningActionButton.length; i++) {
                  addScreeningActionButton[i].addEventListener('change', function() {
                    var add_option = this;
                    var actionlist = []
                    $(this).closest('tr').find(".screening_option_action").each(function() {
                      // if (this.options[this.selectedIndex].length > 0){
                      actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                      // }
                    });

                    if (countElement('Require', actionlist) > 1) {
                      if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                        var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                        var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                        
                        $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                      }
                    } else {
                      if (!$.isEmptyObject(test_screener_questions_json)) {
                        var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                        delete test_screener_questions_json[id]["require_answer_count"];
                        delete test_screener_questions_json[id]["answer_limit_type"];
                      }
                      $(this).closest('tr').find(".require_answer_options").remove();
                    }
                    $(this).closest('tr').find("select:first").each(function() {
                      var select_value = this.options[this.selectedIndex].getAttribute('value');
                      $(this).closest('tr').find(".screening_option_action").each(function() {
                        // if (this.options[this.selectedIndex].length > 0){
                        actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                        // }
                      });
                      if (select_value == "multi_select") {
                        $(this).closest('tr').find(".option_count").remove();
                        if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                          $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          add_option.selectedIndex = 0;

                        }
                      } else {
                        $(this).closest('tr').find(".option_count").remove();
                        if (countElement('Allow', actionlist) < 1) {
                          $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          add_option.selectedIndex = 0;
                        }
                      }
                    });
                  });
                }
              }
              if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
                $(this).addClass("display_none");
                $(this).attr("disabled",true);
                $(this).closest("tr").find(".more_answers").remove();
                $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this));
              }
            });
          }

          var addScreeningActionButton = stepAudienceDialog.querySelectorAll(".screening_option_action");
          for (var i = 0; i < addScreeningActionButton.length; i++) {
            addScreeningActionButton[i].addEventListener('change', function() {
              var add_option = this;
              var actionlist = []
              $(this).closest('tr').find(".screening_option_action").each(function() {
                // if (this.options[this.selectedIndex].length > 0){
                actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                // }
              });
              if (countElement('Require', actionlist) > 1) {
                if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                  
                  $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                }
              } else {
                if (!$.isEmptyObject(test_screener_questions_json)) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  delete test_screener_questions_json[id]["require_answer_count"];
                  delete test_screener_questions_json[id]["answer_limit_type"];
                }
                $(this).closest('tr').find(".require_answer_options").remove();
              }
              $(this).closest('tr').find("select:first").each(function() {
                var select_value = this.options[this.selectedIndex].getAttribute('value');
                 $(this).closest('tr').find(".screening_option_action").each(function() {
                  // if (this.options[this.selectedIndex].length > 0){
                  actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                  // }
                });
                if (select_value == "multi_select") {
                  $(this).closest('tr').find(".option_count").remove();
                  if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                    $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                    add_option.selectedIndex = 0;

                  }
                } else {
                  $(this).closest('tr').find(".option_count").remove();
                  if (countElement('Allow', actionlist) < 1) {
                    $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                    add_option.selectedIndex = 0;
                  }
                }
              });
            });
          }

          if (($(".screener_questions").length >= allowed_screener_question_limit[customer_plan["kind"]]) && (!$(".screener_questions").closest("tr").hasClass('display_none'))) {
            $(".upgrade_plan_div").remove();
            $("#add_screener_questions").removeAttr("disabled");
            if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
              $("<div class='flex flex-start upgrade_plan_div'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
              $("#add_screener_questions").attr("disabled", true);
            }else{
              $("#add_screener_questions").next(".upgrade_plan_div").remove();
              $("#add_screener_questions").attr("disabled", true);
              if ($(".more_questions").length == 0) {
                $('<div class="more_questions"><span>(You cannot add more than 16 screener questions.)</span></div>').insertAfter($("#add_screener_questions"));
                $("#add_screener_questions").addClass("display_none");
              }
            }
          }
        }
      }
    
    
  });

  cancelButton.addEventListener("click", e => {
    /// To continue the step if add screener question button is nit click
    if ($(".screener_questions").length == 1 && $(".screener_questions").closest("tr").hasClass('display_none')) {
      $(".screener_questions:last").closest("tr").remove();
    }

    $('form#form_audience_step input[required], form#form_audience_step textarea[required]').each(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("require_answer_count")) {
        $(this).closest("div.require_answer_options").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#form_audience_step input[required], form#form_audience_step textarea[required]').focus(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("require_answer_count")) {
        $(this).closest("div.require_answer_options").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
    });

    var age_validate = true;
    var age_value;
    $('form#form_audience_step #age').each(function() {
      age_value = this.options[this.selectedIndex].getAttribute("value");
    })
    if (age_value == "specified") {
      var minAge = $("#min_age").val();
      var maxAge = $("#max_age").val();
      if (minAge == "") {
        age_validate = false;
        $("#min_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age is required</span>').insertAfter($("#min_age").closest("#div_min_max_age"));
      }else if (maxAge == "") {
        age_validate = false;
        $("#max_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Maximum age is required</span>').insertAfter($("#max_age").closest("#div_min_max_age"));
      }else if (parseInt(minAge) < 18) {
        age_validate = false;
        $("#min_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age must be greater than and equal to 18</span>').insertAfter($("#min_age").closest("#div_min_max_age"));
      }else if (parseInt(minAge) >= parseInt(maxAge)) {
        age_validate = false;
        $("#max_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age must be less than the maximum age</span>').insertAfter($("#max_age").closest("#div_min_max_age"));
      }
    }
    
    $('form#form_audience_step #min_age, form#form_audience_step #max_age').focus(function() {
      $(this).css("border", "none");
      $(this).closest("#div_min_max_age").next("span").remove();
    });



    if (validate && age_validate) {
      test_json["audience_step"] = {};

      useTest['use_test']['qualification_text'] = $("#qualification_text").val();
      useTest['use_test']['technical_screener'] = $("#technical_screener").val();
      useTest['use_test']['own_test_title'] = $("#own_test_title").val();

      /// For serailaizing screener questions 
      $('form#form_audience_step .screener_questions').each(function() {
        var id = Number($(this).attr('name').split("title")[0].split("][")[1].split("_")[1]);
        var name = $(this).attr('name');
        var textstr = "&" + encodeURIComponent(name) + "=" + $(this).val();
      })


      /// For serializing dropdown data
      var selectData = $("form#form_audience_step .demographics_select").find('select').map(function() {
        if (this.options[this.selectedIndex] != undefined) {
          var name = $(this).attr('name').split("[")[1].split("]")[0];
          var demographicArray = this.options[this.selectedIndex].getAttribute("value")
          useTest['use_test'][name] = Array(demographicArray);
          test_json["audience_step"][name] = Array(demographicArray);
          return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(demographicArray);
        }
      }).get().join('&');

      if (use_test) {
        useTest['use_test']['state'] = use_test['state'];
      }else{
        useTest['use_test']['state'] = ["any"];
      }

      var obj = $("form#form_audience_step").serializeArray();
      
      test_json["audience_step"]['qualification_text'] = $("#qualification_text").val();
      test_json["audience_step"]['technical_screener'] = $("#technical_screener").val();
      test_json["audience_step"]['own_test_title'] = $("#own_test_title").val();

      $.each(obj, function(i, v) {
        if (!(v.name.indexOf("screener_questions_attributes") > -1)){
          var name = v.name.split("[")[1].split("]")[0];
          useTest['use_test'][name] = v.value;
          test_json["audience_step"][name] = v.value || '';
        }
      });


      $.each($("form#form_audience_step .screener_question_div"), function(k,v){
        var input_array = [];
        input_array.push($(v).find('input').serializeArray());
        input_array = $.map( input_array, function(n){
          return n;
        });
        test_screener_questions = {};
        $.each(input_array, function(key, val) {
          var array = val['name'].replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
            if (test_screener_questions_json[array[2]] == undefined) {
              test_screener_questions_json[array[2]] = {}
              if (array.length == 7) {
                if (test_screener_questions_json[array[2]][array[3]] == undefined) {
                  test_screener_questions_json[array[2]][array[3]] = {}
                }
              }
            };
            if (array.length == 5) {
              test_screener_questions_json[array[2]][array[3]] = val['value'];
            }else {
              if (test_screener_questions_json[array[2]][array[3]][array[4]] == undefined) {
                test_screener_questions_json[array[2]][array[3]][array[4]] = {}
              }
              test_screener_questions_json[array[2]][array[3]][array[4]][array[5]] = val['value'];
            }
        });
          var array =  $(v).find('textarea').attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
          if (test_screener_questions_json[array[2]] == undefined) {
            test_screener_questions_json[array[2]] = {}
          };
          test_screener_questions_json[array[2]][array[3]] = $(v).find('textarea').val();
      })

       var select_screeenr_arary = $("form#form_audience_step .screener_question_div").find('select').map(function() {
        var select_screener = this.options[this.selectedIndex].getAttribute("value");
        var array = $(this).attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
        if (test_screener_questions_json[array[2]] == undefined) {
            test_screener_questions_json[array[2]] = {}
            if (array.length == 7) {
              if (test_screener_questions_json[array[2]][array[3]] == undefined) {
                test_screener_questions_json[array[2]][array[3]] = {}
              }
            }
          };
          if (array.length == 5) {
            test_screener_questions_json[array[2]][array[3]] = select_screener;
          }else {
            if (test_screener_questions_json[array[2]][array[3]][array[4]] == undefined) {
              test_screener_questions_json[array[2]][array[3]][array[4]] = {}
            }
            test_screener_questions_json[array[2]][array[3]][array[4]][array[5]] = select_screener;
          }
        return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(select_screener);
      }).get().join('&');

      if (!$.isEmptyObject(test_screener_questions_json)) {
        test_json["audience_step"]["screener_questions_attributes"] = test_screener_questions_json;
        useTest["use_test"]["screener_questions_attributes"] = test_screener_questions_json;
      }else{
        test_json["audience_step"]["screener_questions_attributes"] = {};
        useTest["use_test"]["screener_questions_attributes"] = {};
      }

      stepAudienceDialog.close("reasonCanceled");
      const callNextStep = callBasicStep(use_test,customer,true);

    } else {
      e.preventDefault();
    }
  })

  audienceStepButton.addEventListener("click", e => {

    /// To continue the step if add screener question button is nit click
    if ($(".screener_questions").length == 1 && $(".screener_questions").closest("tr").hasClass('display_none')) {
      $(".screener_questions:last").closest("tr").remove();
    }

    $('form#form_audience_step input[required], form#form_audience_step textarea[required]').each(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("require_answer_count")) {
        $(this).closest("div.require_answer_options").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#form_audience_step input[required], form#form_audience_step textarea[required]').focus(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("require_answer_count")) {
        $(this).closest("div.require_answer_options").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
    });

    var age_validate = true;
    var age_value;
    $('form#form_audience_step #age').each(function() {
      age_value = this.options[this.selectedIndex].getAttribute("value");
    })
    if (age_value == "specified") {
      var minAge = $("#min_age").val();
      var maxAge = $("#max_age").val();
      if (minAge == "") {
        age_validate = false;
        $("#min_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age is required</span>').insertAfter($("#min_age").closest("#div_min_max_age"));
      }else if (maxAge == "") {
        age_validate = false;
        $("#max_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Maximum age is required</span>').insertAfter($("#max_age").closest("#div_min_max_age"));
      }else if (parseInt(minAge) < 18) {
        age_validate = false;
        $("#min_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age must be greater than and equal to 18</span>').insertAfter($("#min_age").closest("#div_min_max_age"));
      }else if (parseInt(minAge) >= parseInt(maxAge)) {
        age_validate = false;
        $("#max_age").css("border", "1px solid red");
        $('<span class="error min_max_error">Minimum age must be less than the maximum age</span>').insertAfter($("#max_age").closest("#div_min_max_age"));
      }
    }

    $('form#form_audience_step #min_age, form#form_audience_step #max_age').focus(function() {
      $(this).css("border", "none");
      $(this).closest("#div_min_max_age").next("span").remove();
    });

    if (validate && age_validate) {
      test_json["audience_step"] = {};
      useTest['use_test']['qualification_text'] = $("#qualification_text").val();
      useTest['use_test']['technical_screener'] = $("#technical_screener").val();
      useTest["use_test"]['own_test_title'] = $("#own_test_title").val();


      /// For serailaizing screener questions 
      $('form#form_audience_step .screener_questions').each(function() {
        var id = Number($(this).attr('name').split("title")[0].split("][")[1].split("_")[1]);
        var name = $(this).attr('name');
        var textstr = "&" + encodeURIComponent(name) + "=" + $(this).val();
      })


      /// For serializing dropdown data
      var selectData = $("form#form_audience_step .demographics_select").find('select').map(function() {
        if (this.options[this.selectedIndex] != undefined) {
          var name = $(this).attr('name').split("[")[1].split("]")[0];
          var demographicArray = this.options[this.selectedIndex].getAttribute("value")
          useTest['use_test'][name] = Array(demographicArray);
          test_json["audience_step"][name] = Array(demographicArray);
          return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(demographicArray);
        }
      }).get().join('&');

      if (use_test) {
        useTest['use_test']['state'] = use_test['state'];
      }else{
        useTest['use_test']['state'] = ["any"];
      }

      var obj = $("form#form_audience_step").serializeArray();
      test_json["audience_step"]['qualification_text'] = $("#qualification_text").val();
      test_json["audience_step"]['technical_screener'] = $("#technical_screener").val();
      test_json["audience_step"]['own_test_title'] = $("#own_test_title").val();

      $.each(obj, function(i, v) {
        if (!(v.name.indexOf("screener_questions_attributes") > -1)){
          var name = v.name.split("[")[1].split("]")[0];
          useTest['use_test'][name] = v.value;
          test_json["audience_step"][name] = v.value || '';
        }
      });

      test_screener_questions = {};
      $.each($("form#form_audience_step .screener_question_div"), function(k,v){
        var input_array = [];
        input_array.push($(v).find('input').serializeArray());
        input_array = $.map( input_array, function(n){
          return n;
        });
        // test_screener_questions = {};
        $.each(input_array, function(key, val) {
          var array = val['name'].replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
            if (test_screener_questions_json[array[2]] == undefined) {
              test_screener_questions_json[array[2]] = {}
              if (array.length == 7) {
                if (test_screener_questions_json[array[2]][array[3]] == undefined) {
                  test_screener_questions_json[array[2]][array[3]] = {}
                }
              }
            };
            if (array.length == 5) {
              test_screener_questions_json[array[2]][array[3]] = val['value'];
            }else {
              if (test_screener_questions_json[array[2]][array[3]][array[4]] == undefined) {
                test_screener_questions_json[array[2]][array[3]][array[4]] = {}
              }
              test_screener_questions_json[array[2]][array[3]][array[4]][array[5]] = val['value'];
            }
        });
          var array =  $(v).find('textarea').attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
          if (test_screener_questions_json[array[2]] == undefined) {
            test_screener_questions_json[array[2]] = {}
          };
          test_screener_questions_json[array[2]][array[3]] = $(v).find('textarea').val();
      })

      var select_screeenr_arary = $("form#form_audience_step .screener_question_div").find('select').map(function() {
        var select_screener = this.options[this.selectedIndex].getAttribute("value");
        var array = $(this).attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
        if (test_screener_questions_json[array[2]] == undefined) {
            test_screener_questions_json[array[2]] = {}
            if (array.length == 7) {
              if (test_screener_questions_json[array[2]][array[3]] == undefined) {
                test_screener_questions_json[array[2]][array[3]] = {}
              }
            }
          };
          if (array.length == 5) {
            test_screener_questions_json[array[2]][array[3]] = select_screener;
          }else {
            if (test_screener_questions_json[array[2]][array[3]][array[4]] == undefined) {
              test_screener_questions_json[array[2]][array[3]][array[4]] = {}
            }
            test_screener_questions_json[array[2]][array[3]][array[4]][array[5]] = select_screener;
          }
        return encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent(select_screener);
      }).get().join('&');
  
      if (!$.isEmptyObject(test_screener_questions_json)) {
        test_json["audience_step"]["screener_questions_attributes"] = test_screener_questions_json;
        useTest["use_test"]["screener_questions_attributes"] = test_screener_questions_json;
      }else{
        test_json["audience_step"]["screener_questions_attributes"] = {};
        useTest["use_test"]["screener_questions_attributes"] = {};
      }

      stepAudienceDialog.close("reasonCanceled");
      stepAudienceDialog.remove();
      const callNextStep = callTestScriptStep("", use_test, customer,false);

    } else {
      e.preventDefault();
    }

  });
  document.appendChild(stepAudienceDialog);
  var screener_questions;
  var use_test_attr;
  if (back) {
    use_test_attr = useTest["use_test"];
    screener_questions = useTest["use_test"]["screener_questions_attributes"];
  }else {
    if (!$.isEmptyObject(test_json["audience_step"])){
      use_test_attr = useTest["use_test"];
    }else {
      use_test_attr = use_test;
    }

    if (!$.isEmptyObject(useTest["use_test"]["screener_questions_attributes"])){
      screener_questions = useTest["use_test"]["screener_questions_attributes"];
    }else{
      screener_questions = test_screener_questions;
    }
  }
    if (!features_allowed_for_plan("worker_screening",customer_plan["kind"])) {
      $(".upgrade_plan_div").remove();
      $("#add_screener_questions").removeAttr("disabled");
      var allowed_plan = next_feature_allowed_plan("worker_screening")
      $("<div class='flex flex-start upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
      $("#add_screener_questions").attr("disabled", true);
    }else{
      $(".upgrade_plan_div").remove();
      $("#add_screener_questions").removeAttr("disabled");
    }

    if (($(".screener_questions").length >= allowed_screener_question_limit[customer_plan["kind"]]) && (!$(".screener_questions").closest("tr").hasClass('display_none'))) {
      $(".upgrade_plan_div").remove();
      $("#add_screener_questions").removeAttr("disabled");
      if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
        $("<div class='flex flex-start upgrade_plan_div'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_screener_questions"));
        $("#add_screener_questions").attr("disabled", true);
      }else{
        $("#add_screener_questions").next(".upgrade_plan_div").remove();
        $("#add_screener_questions").attr("disabled", true);
        if ($(".more_questions").length == 0) {
          $('<div class="more_questions"><span>(You cannot add more than 16 screener questions.)</span></div>').insertAfter($("#add_screener_questions"));
          $("#add_screener_questions").addClass("display_none");
        }
      }
    }

  var selectOptionType = stepAudienceDialog.querySelectorAll(".screener_questions_ans_type");

  for (var i = 0; i < selectOptionType.length; i++) {
    selectOptionType[i].addEventListener('change', function() {
      $(this).closest('tr').find(".option_count").remove();

      // if (this.options[this.selectedIndex].length > 0){
      if (this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
        $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
          $(element).find('option').remove();
          $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
        });
      } else {
        $(this).closest("tr").find(".require_answer_options").remove();
        var select_options = $(this).closest("tr").find('.screening_option_fields select');
        $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
          $(element).find('option[value="Require"]').remove();
        });
      }
      // }
    });
  }

  if (use_test_attr && use_test_attr["age"] == "specified") {
    $("#div_min_max_age").addClass("display_block").removeClass("display_none");
    $("#min_age").val(use_test_attr["min_age"]);
    $("#max_age").val(use_test_attr["max_age"]);
  }else{
    $("#div_min_max_age").addClass("display_none").removeClass("display_block");
    $("#min_age").val("");
    $("#max_age").val("");
  }

  if (use_test_attr && use_test_attr["employment_type"] == "employed") {
    $("#div_employment_status").addClass("display_block").removeClass("display_none");
  }else{
    $("#div_employment_status").addClass("display_none").removeClass("display_block");
  }

  $.each(demographics, function(key, value) {
    if ($("#" + key).length) {
      $.each(value, function(k, val) {
        if(!$.isEmptyObject(use_test_attr) && !$.isEmptyObject(use_test_attr[key])) {
          $("#" + key).append($("<option></option>").attr("value", val[1]).text(val[0]));
          $("#" + key).find('option[value="'+ use_test_attr[key] +'"]').prop("selected", true)
        }else{
          if (val[1] == "any") {
            $("#" + key).append($("<option selected></option>").attr("value", val[1]).text(val[0]));
          } else {
            $("#" + key).append($("<option></option>").attr("value", val[1]).text(val[0]));
          }
        }
      });
    }
  });

  $("#age").on("change",function(){
    if (this.options[this.selectedIndex].getAttribute('value') == "specified") {
      $("#div_min_max_age").addClass("display_block").removeClass("display_none");
    }else{
      $("#div_min_max_age").addClass("display_none").removeClass("display_block");
      $("#min_age").val("");
      $("#max_age").val("");
    }
  })

  $("#employment_type").on("change",function(){
    $("#employment_status").find("option").remove();
    $.each(demographics['employment_type'], function(k, val) {
      if (val[1] == "any") {
        $("#employment_status").append($("<option selected></option>").attr("value", val[1]).text(val[0]));
      } else {
        $("#employment_status").append($("<option></option>").attr("value", val[1]).text(val[0]));
      }
    });
    if (this.options[this.selectedIndex].getAttribute('value') == "employed") {
      $("#div_employment_status").addClass("display_block").removeClass("display_none");
    }else{
      $("#div_employment_status").addClass("display_none").removeClass("display_block");
    }
  })
  /// For retaining values of audience step
    
    /// For adding already created screener questions
    if (!$.isEmptyObject(screener_questions)) {

      /// For removing tr which we are using if there is no screener question
      if ($(".screener_questions:last").closest("tr").hasClass("display_none")) {
        $(".screener_questions:last").closest("tr").remove();
      }

      var screener_question_tr = '<tr class="screener_question_div"><td></td></tr>';
      var que_no = 1;
      $.each(screener_questions, function(key, value) {
        var screeer_que = `<span class="question_index">Question `+ que_no + `:</span><div class="flex start"><span>(</span><a href="javascript:void(0);" data-id="` + key + `" class="remove_screener_questions">Remove</a><span>)</span></div><textarea name="use_test[screener_questions_attributes][` + key + `][title]" class="screener_questions" placeholder="Screener Question" required>` + value["title"] + `</textarea>`;
        var ans_type = `<div class="flex que-center"><span>Type: </span><select name="use_test[screener_questions_attributes][` + key + `][ans_type]" data-id="` + key + `" class="screener_questions_ans_type">
          <option value="single_select">Single-select</option>
          <option value="multi_select">Multi-select</option>
          </select></div>`;
        var div_options = "";
        $.each(value["screening_options_attributes"], function(k, v) {  
          var screening_options = `<div class="screening_option_fields">
            <input type="text" name="use_test[screener_questions_attributes][` + key + `][screening_options_attributes][` + k + `][name]" value="` + v["name"] + `" required>
            <div class="flex que-center">
            <select name="use_test[screener_questions_attributes][` + key + `][screening_options_attributes][` + k + `][action]" class="screening_option_action">
            </select>
            </div>
            <div class="flex que-center">
            <a href="javascript:void(0);" class="remove_screening_options" data-id="` + k + `">Remove this answer</a>
            </div>
            </div>`;
          div_options += screening_options;
        });

        var option_button = `<a href="javascript:void(0);" class="add_screening_options flex start" data-id="` + key + `"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a>`;

        if (value["answer_limit_type"] != undefined) {
          var require_text = `<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][` + key + `][answer_limit_type]"><option value="at_least">at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][` + key + `][require_answer_count]" class="require_answer_count" value="` + value["require_answer_count"] + `" required><span>of the "Required" answers to be eligible</span></div>`;
          var final_div = screeer_que + ans_type + div_options + option_button + require_text;
        } else {
          var final_div = screeer_que + ans_type + div_options + option_button;
        }
        var final_tr = $(screener_question_tr).append(final_div);
     
        $(final_tr).find('select:first option[value="' + value["ans_type"] + '"]').prop("selected", true);
        if ($(final_tr).find(".require_answer_options").length > 0) {
          $(final_tr).find('.require_answer_options option[value="' + value["answer_limit_type"] + '"]').prop("selected", true);
        }

        $.each($(final_tr).find(".screening_option_action"), function() {
          var action_id = $(this).closest(".screening_option_fields").find(".remove_screening_options").attr("data-id");
          if (value["ans_type"] == "multi_select") {
            $(this).append('<option value="Allow">allow</option><option value="Reject">reject</option><option value="Require">require</option>');
          } else {
            $(this).append('<option value="Allow">allow</option><option value="Reject">reject</option>');
          }
          $(this).find('option[value="' + value["screening_options_attributes"][action_id]["action"] + '"]').prop("selected", true);
        })
        if ($(final_tr).find(".screening_option_fields").length == 2) {
          $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter($(final_tr).find(".add_screening_options"))
        }
        $(final_tr).insertBefore($("#add_screener_questions").closest("tr"));
        // to trigger events when add screening option is not clicked
        var removeScreeningOptionButton = final_tr.find(".remove_screening_options");

        for (var i = 0; i < removeScreeningOptionButton.length; i++) {
          removeScreeningOptionButton[i].addEventListener('click', function() {
            var remove_answer = $(this);
            var removeScreeningOptionButton = final_tr.find(".remove_screening_options");
            var actionlist = []
            final_tr.find(".screening_option_action").each(function() {
              // if (this.options[this.selectedIndex].length > 0){
              actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
              // }
            });
            
            if (removeScreeningOptionButton.length > 2) {
              var remove_allowed = true;
              $(this).closest('tr').find("select:first").each(function() {
                var select_value = this.options[this.selectedIndex].getAttribute('value');
                if (select_value == "multi_select") {
                  final_tr.find(".option_count").remove();
                  if (!(countElement('Require', actionlist) >= 1) || !(countElement('Allow', actionlist) >= 1)) {
                    var answer_value;
                    $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                      answer_value = this.selectedIndex;
                    })
                    if(answer_value == 0 || answer_value == 2) {
                      $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(final_tr.find(".add_screening_options"));
                      remove_allowed = false;
                    }
                  }
                } else {
                  final_tr.find(".option_count").remove();
                  if (countElement('Allow', actionlist) <= 1) {
                    var answer_value;
                    $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                      answer_value = this.selectedIndex;
                    })
                   
                    if(answer_value == 0) {
                      $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(final_tr.find(".add_screening_options"));
                      remove_allowed = false;
                    }
                  }
                }
              });
              if (remove_allowed) {
                if (!$.isEmptyObject(test_screener_questions_json)) {
                  var opt_id = $(this).attr("data-id");
                  var q_id = final_tr.find("a").attr("data-id");
                  delete test_screener_questions_json[q_id]["screening_options_attributes"][opt_id];
                }
                $(this).closest('div.screening_option_fields').remove();
              }
            }
            var removeScreeningOptionButton = final_tr.find(".remove_screening_options");
            if(removeScreeningOptionButton.length == 2){
              $(this).closest('tr').find(".min-options").remove();
              $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter(final_tr.find(".add_screening_options:last"));
            }
            //// For removing require text box after rremoving screeenr option if count is less than 2
            var actionlist = []
            final_tr.find(".screening_option_action").each(function() {
              // if (this.options[this.selectedIndex].length > 0){
              actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
              // }
            });
            if (countElement('Require', actionlist) > 1) {
              if (final_tr.find(".require_answer_options").length == 0) {
                var id = final_tr.find(".remove_screener_questions:last").attr("data-id");
                var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                
                $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
              }
            } else {
              if (!$.isEmptyObject(test_screener_questions_json)) {
                var id = final_tr.find(".remove_screener_questions:last").attr("data-id");
                delete test_screener_questions_json[id]["require_answer_count"];
                delete test_screener_questions_json[id]["answer_limit_type"];
              }
              final_tr.find(".require_answer_options").remove();
            }
            if ($(this).closest('tr').find(".screening_option_fields").length < opt_counter) {
              $(this).closest('tr').find(".add_screening_options").removeAttr("disabled");
              final_tr.find(".add_screening_options").next(".more_answers").remove();
            }
          });
        }

        var addScreeningActionButton = final_tr.find(".screening_option_action");
        for (var i = 0; i < addScreeningActionButton.length; i++) {
          addScreeningActionButton[i].addEventListener('change', function() {
            var add_option = this;
            var actionlist = []
            $(this).closest('tr').find(".screening_option_action").each(function() {
              // if (this.options[this.selectedIndex].length > 0){
              actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
              // }
            });
            if (countElement('Require', actionlist) > 1) {
              if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                
                $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
              }
            } else {
              $(this).closest('tr').find(".require_answer_options").remove();
            }

            $(this).closest('tr').find("select:first").each(function() {
              var select_value = this.options[this.selectedIndex].getAttribute('value');
              $(this).closest('tr').find(".screening_option_action").each(function() {
                // if (this.options[this.selectedIndex].length > 0){
                actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                // }
              });
              if (select_value == "multi_select") {
                $(this).closest('tr').find(".option_count").remove();
                if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                  $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                  add_option.selectedIndex = 0;

                }
              } else {
                $(this).closest('tr').find(".option_count").remove();
                if (countElement('Allow', actionlist) < 1) {
                  $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                  add_option.selectedIndex = 0;
                }
              }
            });
          });
        }
        que_no ++;
      });


      var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");

      for (var i = 0; i < removeScreenerQuestionButton.length; i++) {
        removeScreenerQuestionButton[i].addEventListener('click', function() {
          var removeScreenerQuestionButton = stepAudienceDialog.querySelectorAll(".remove_screener_questions");
          if (!$.isEmptyObject(test_screener_questions_json)) {
            var q_id = $(this).attr("data-id");
            delete test_screener_questions_json[q_id];
          }

          $($(this).closest('tr').find("input[required]") ,$(this).closest('tr').find("textarea[required]")).each(function() {
            $(this).css("border", "none");
            if ($(this).attr("name").includes("require_answer_count")) {
              $(this).closest("div.require_answer_options").next("span").remove();
            }else{
              $(this).next("span").remove();
            }
            validate = true;
          })

          if (removeScreenerQuestionButton.length > 1) {
            $(this).closest('tr').remove();
            $(".screener_question_div").each(function(index) {
              $(this).find("span:first").text("Question "+(index+1)+":");
            })
          }else{
            $(this).closest('tr').removeClass("display_block").addClass("display_none");
          }

          if ($(".screener_questions").length < allowed_screener_question_limit[customer_plan["kind"]]) {
            $("#add_screener_questions").next(".upgrade_plan_div").remove();
            $("#add_screener_questions").removeAttr("disabled");
            $("#add_screener_questions").next(".more_questions").remove();
          }
        });
      }

      var selectOptionType = stepAudienceDialog.querySelectorAll(".screener_questions_ans_type");

      for (var i = 0; i < selectOptionType.length; i++) {
        selectOptionType[i].addEventListener('change', function() {
          // if (this.options[this.selectedIndex].length > 0){
          $(this).closest('tr').find(".option_count").remove();
          if (this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
            $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
              $(element).find('option').remove();
              $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
            });
          } else {
            var select_options = $(this).closest("tr").find('.screening_option_fields select');
            $(this).closest("tr").find(".require_answer_options").remove();
            $(this).closest("tr").find('.screening_option_fields select').each(function(index, element) {
              $(element).find('option').remove();
              $(element).append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
              var actionlist = []
              $(this).closest('tr').find(".screening_option_action").each(function() {
                // if (this.options[this.selectedIndex].length > 0){
                actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                // }
              });
              if (countElement('Require', actionlist) > 1) {
                if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                  
                  $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                }
              } else {
                if (!$.isEmptyObject(test_screener_questions_json)) {
                  var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                  delete test_screener_questions_json[id]["require_answer_count"];
                  delete test_screener_questions_json[id]["answer_limit_type"];
                }
                $(this).closest('tr').find(".require_answer_options").remove();
              }
            });
          }
          // }
        });
      }

      var addScreeningOptionButton = stepAudienceDialog.querySelectorAll(".add_screening_options");

      for (var i = 0; i < addScreeningOptionButton.length; i++) {
        addScreeningOptionButton[i].addEventListener('click', function() {
          $(this).closest('tr').find(".min-options").remove();
          if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
            $(this).closest("tr").find(".more_answers").remove();
            $(this).addClass("display_none").removeClass("display_block");
            $(this).attr("disabled",true);
            $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this))
          }else{
            $(this).removeAttr("disabled");
            $(this).closest("tr").find(".more_answers").remove();
            $(this).closest('tr').find(".option_count").remove();
            var add_screening_option = $(this).closest('tr');
            var clone = $(this).closest('tr').find(".screening_option_fields:last").clone();
            var que_id = $(this).attr('data-id');
            var option_id = Number(clone.find('a').attr("data-id").split("_")[2]);
            clone.find('input').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][name]").val("");
            clone.find('select').attr("name", "use_test[screener_questions_attributes][" + que_id + "][screening_options_attributes][" + ("new_type_" + (option_id + 1)) + "][action]")
            clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
            clone.insertAfter($(this).closest('tr').find(".screening_option_fields:last"));
            $(this).closest('tr').find(".screening_option_fields:last select option").remove();
            $(this).closest('tr').find("select:first").each(function() {
              var select_value = this.options[this.selectedIndex].getAttribute('value');
              if (select_value == "multi_select") {
                $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option><option value="Require">require</option>');
              } else {
                $(this).closest('tr').find(".screening_option_fields:last select").append('<option value="Allow" selected>allow</option><option value="Reject">reject</option>');
              }
            });


            var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");

            for (var i = 0; i < removeScreeningOptionButton.length; i++) {
              removeScreeningOptionButton[i].addEventListener('click', function() {
                var remove_answer = $(this);
                var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                var actionlist = []
                add_screening_option.find(".screening_option_action").each(function() {
                  // if (this.options[this.selectedIndex].length > 0){
                  actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                  // }
                });
                
                if (removeScreeningOptionButton.length > 2) {
                  var remove_allowed = true;
                  $(this).closest('tr').find("select:first").each(function() {
                    var select_value = this.options[this.selectedIndex].getAttribute('value');
                    if (select_value == "multi_select") {
                      $(this).closest('tr').find(".option_count").remove();
                      if (!(countElement('Require', actionlist) >= 1) || !(countElement('Allow', actionlist) >= 1)) {
                        var answer_value;
                        $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                          answer_value = this.selectedIndex;
                        })
                        if(answer_value == 0 || answer_value == 2) {
                          $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          remove_allowed = false;
                        }
                      }
                    } else {
                      $(this).closest('tr').find(".option_count").remove();
                      if (countElement('Allow', actionlist) <= 1) {
                        var answer_value;
                        $(remove_answer).closest('div.screening_option_fields').find("select").each(function() {
                          answer_value = this.selectedIndex;
                        })
                       
                        if(answer_value == 0) {
                          $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter(add_screening_option.find(".add_screening_options"));
                          remove_allowed = false;
                        }
                      }
                    }
                  });
                  if (remove_allowed) {
                    if (!$.isEmptyObject(test_screener_questions_json)) {
                      var opt_id = $(this).attr("data-id");
                      var q_id = $(this).closest('tr').find("a").attr("data-id");
                      delete test_screener_questions_json[q_id]["screening_options_attributes"][opt_id];
                    }
                    $(this).closest('div.screening_option_fields').remove();
                  }
                }
                var removeScreeningOptionButton = add_screening_option.find(".remove_screening_options");
                if(removeScreeningOptionButton.length == 2){
                  $(this).closest('tr').find(".min-options").remove();
                  $("<span class='min-options'>*Minimum 2 options required</span>").insertAfter(add_screening_option.find(".add_screening_options:last"));
                }
                 //// For removing require text box after rremoving screeenr option if count is less than 2
                  var actionlist = []
                  add_screening_option.find(".screening_option_action").each(function() {
                    // if (this.options[this.selectedIndex].length > 0){
                    actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                    // }
                  });
                if (countElement('Require', actionlist) > 1) {
                  if (add_screening_option.find(".require_answer_options").length == 0) {
                    var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                    var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                    
                    $(require_text).insertAfter(add_screening_option.find(".add_screening_options:last"));
                  }
                } else {
                  if (!$.isEmptyObject(test_screener_questions_json)) {
                    var id = add_screening_option.find(".remove_screener_questions:last").attr("data-id");
                    delete test_screener_questions_json[id]["require_answer_count"];
                    delete test_screener_questions_json[id]["answer_limit_type"];
                  }
                  add_screening_option.find(".require_answer_options").remove();
                }
                if ($(this).closest('tr').find(".screening_option_fields").length < opt_counter) {
                  $(this).closest('tr').find(".add_screening_options").removeAttr("disabled");
                  add_screening_option.find(".add_screening_options").next(".more_answers").remove();
                }
              });
            }

            var addScreeningActionButton = stepAudienceDialog.querySelectorAll(".screening_option_action");
            for (var i = 0; i < addScreeningActionButton.length; i++) {
              addScreeningActionButton[i].addEventListener('change', function() {
                var add_option = this;
                var actionlist = []
                $(this).closest('tr').find(".screening_option_action").each(function() {
                  // if (this.options[this.selectedIndex].length > 0){
                  actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                  // }
                });
                if (countElement('Require', actionlist) > 1) {
                  if ($(this).closest('tr').find(".require_answer_options").length == 0) {
                    var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                    var require_text = '<div class="require_answer_options flex start"><span>Testers must select</span><select  name="use_test[screener_questions_attributes][' + id + '][answer_limit_type]"><option value="at_least" selected>at least</option><option value="exactly">exactly</option></select><input type="number" name="use_test[screener_questions_attributes][' + id + '][require_answer_count]" class="require_answer_count" value="1" required><span>of the "Required" answers to be eligible</span></div>';
                    
                    $(require_text).insertAfter($(this).closest('tr').find(".add_screening_options:last"));
                  }
                } else {
                  if (!$.isEmptyObject(test_screener_questions_json)) {
                    var id = $(this).closest('tr').find(".remove_screener_questions:last").attr("data-id");
                    delete test_screener_questions_json[id]["require_answer_count"];
                    delete test_screener_questions_json[id]["answer_limit_type"];
                  }
                  $(this).closest('tr').find(".require_answer_options").remove();
                }
                $(this).closest('tr').find("select:first").each(function() {
                  var select_value = this.options[this.selectedIndex].getAttribute('value');
                  $(this).closest('tr').find(".screening_option_action").each(function() {
                    // if (this.options[this.selectedIndex].length > 0){
                    actionlist.push(this.options[this.selectedIndex].getAttribute('value'));
                    // }
                  });
                  if (select_value == "multi_select") {
                    $(this).closest('tr').find(".option_count").remove();
                    if (((countElement('Require', actionlist) <= 1) && (countElement('Allow', actionlist) < 1)) || ((countElement('Allow', actionlist) <= 1) && (countElement('Require', actionlist) < 1))) {
                      $('<span class="option_count">At least 1 answer must be Required or Allowed for all screener questions</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                      add_option.selectedIndex = 0;

                    }
                  } else {
                    $(this).closest('tr').find(".option_count").remove();
                    if (countElement('Allow', actionlist) < 1) {
                      $('<span class="option_count">Please select at least one answer action as Allow</span>').insertAfter($(this).closest('tr').find(".add_screening_options"));
                      add_option.selectedIndex = 0;
                    }
                  }
                });
              });
            }
          }
          if ($(this).closest('tr').find(".screening_option_fields").length > opt_counter) {
            $(this).addClass("display_none");
            $(this).closest("tr").find(".more_answers").remove();
            $(this).attr("disabled",true);
            $('<div class="more_answers"><span>(You cannot add more than 10 answers.)</span></div>').insertAfter($(this));
          }
        });
      }

    }

  if (!$.isEmptyObject(use_test_attr)) {
    $("#qualification_text").val(use_test_attr["qualification_text"]);
    $("#technical_screener").val(use_test_attr["technical_screener"]);
    $('input[name="use_test[testing_type]"][value="' + use_test_attr["testing_type"] + '"]').prop("checked", true);
  }

  var tester_type = use_test_attr && use_test_attr["testing_type"] ? use_test_attr["testing_type"] : $('input[name="use_test[testing_type]"]').val();
  var own_title = use_test_attr && use_test_attr["own_test_title"] ? use_test_attr["own_test_title"] : customer_attr["company_name"]

  if (tester_type == 'trymyui_testers') {
    $(".own_test_title_div").addClass('display_none').removeClass('display_block');
    $("#own_test_title").val("");
  } else {
    $(".own_test_title_div").addClass('display_block').removeClass('display_none');
    $("#own_test_title").val(own_title);    
  }

  // Show hide test title and white labeling on change of testing type
  $('input[name="use_test[testing_type]"]').on("change", function() {
    if ($(this).val() == 'trymyui_testers') {
      $(".own_test_title_div").addClass('display_none').removeClass('display_block');
      $("#own_test_title").val("");
    } else {
      $(".own_test_title_div").addClass('display_block').removeClass('display_none');
      $("#own_test_title").val(own_title);
    }
  });

  $(".upgrade_plan").on("click", function(){
    var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
    var upgrade_url = `${website_url}/plan/upgrade?${user_params}`
    require("uxp").shell.openExternal(`${upgrade_url}`);
  })

  
    
}

//// Use Test Audience Step Dialog End ////


//// Use Test Test Script Step dialog Start ////
let stepTestScriptDialog;

const stepTestScriptHtml =
  `<style>
      .test_script_dialog {
        height: auto;
        width: 700px;
      }

      .test_script_step {
        height: 480px;
        width: 700px;
        overflow-y: scroll;
        align-items: center;
        margin: 0px 30px 0px 30px;
      }

      .test_script_dialog input[type="text"], .test_script_dialog input[type="number"], .test_script_dialog textarea {
        width: 70%;
        margin-left: 25px !important;
      }
        
      .test_script_dialog h1 {
        margin-top: 20px !important;
       }
      .test_script_dialog hr{
        margin-top: 0px !important;
        margin-bottom: 0px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
      }
      .test_script_dialog table {
        margin-left: 10px !important;
      }

      .test_script_dialog tr{
        margin-top: 30px !important;
      }

      .test_script_dialog .head-center {
        text-align: center !important;
        margin-bottom: 20px !important;
      }
      
      .test_script_dialog #test_script_test {
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 21px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .test_script_dialog #cancel_test_script {
        border: 1px solid #444444;
        border-radius: 6px;
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #000000 !important;
        background: #ffffff !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }
      .test_script_dialog h2 {
        font-size: 18px !important;
        color: #000000 !important;
       }
      .test_script_dialog textarea {
        height: 33px !important;
      }
      .test_script_dialog a {
        text-decoration: underline !important;
      }
      .test_script_dialog td,.test_script_dialog label,.test_script_dialog span {
        font-size: 14px !important;
        color: #000000 !important;
        font-weight: normal !important;
       }
       .test_script_dialog .flex {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
        .test_script_dialog .center {
          justify-content: center;
        }
        .test_script_dialog .start {
          justify-content: flex-start;
        }
        .test_script_dialog .end {
          justify-content: flex-end;
        }
        .test_script_dialog .start-input {
          justify-content: center;
          margin-right: 35px !important;
        }
        .test_script_dialog .start-input span{
          margin-left: 3px !important;

        }
        .test_script_dialog .impression_div {
          margin-left: 25px !important;
        }
        .test_script_dialog .task_div {
          margin-left: 25px !important;
        }
        .test_script_dialog tr.task_tr {
          margin-top: 15px !important;
        }
        .test_script_dialog #add_tasks {
          margin-left: 25px !important;
          margin-bottom: 30px !important;
        }
        .test_script_dialog #add_tasks img{
          margin-right: 5px !important;
        }
        .test_script_dialog .impression_div span {
          font-size: 12px !important;
        }
        .test_script_dialog .start-input label, .start-input span {
          font-size: 12px !important;
        }
        .test_script_dialog a, .test_script_dialog a span {
          font-size: 12px !important;
          color: #56abcc !important;
        }
        .test_script_dialog .error {
        color: red !important;
        margin-left: 25px !important;
       }
      .test_script_dialog .upgrade_plan_div {
        margin-left: 180px !important;
      }
      .test_script_dialog .upgrade_plan_div i{ 
        font-style: italic !important;
        color: #666666 !important;
        font-size: 12px !important;
      }
      .test_script_dialog .upgrade_plan_div a{ 
        font-style: italic !important;
        font-size: 12px !important;
        margin-left: 5px !important;
      }
      .test_script_dialog .display_none {
        display: none !important;
      }
      .test_script_dialog .display_block {
        display: block !important;
      }
      </style>
    <div class="white-background">
    <form method="dialog" class="test_script_dialog form-inline" id="form_test_script">
    <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
    <div class="test_script_step">
    <h1>Create a new Test - Test script (Step 3 of 4)</h1>
    <table>
    <tr>
      <td><span>Scenario:</span></td>
      <td><textarea name="use_test[scenario]" id="scenario" form="form_test_script" placeholder="Set the stage for your test participants" required></textarea>
      </td>
      </tr>

      <tr>
      <td><span>First impression test:</span></td>
      <td class="impression_div">
        <label for="do_impression_test" class="row flex start" >
          <input type="checkbox" name="use_test[do_impression_test]" id="do_impression_test" value="true">
          <span>Begin each tester's session with an impression test on my starting URL</span><a href="javascript:void(0);" id="impr_info_link">Learn more></a>
        </label>
      </td>
      </tr>

      <tr>
      <td><span>Tasks:</span></td>
      </tr>

      <tr class="task_tr">
      <td class="task_div">
      <span class="task_index">Task 1:</span>
      <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_tasks" data-id="old_0">Remove</a><span>)</span></div>
      <textarea name="use_test[ut_tasks_attributes][old_0][description]" class="ut_task_description" form="form_test_script" placeholder="Enter your task" required></textarea>
      <div class="flex start-input">
        <div class="include_text"><span>Include:</span></div>
        <div><label class="row flex start"><input type="checkbox" class="seq_input" name="use_test[ut_tasks_attributes][old_0][opt_for_seq]" value="true"><span>Task usability rating</span></label></div>
        <div><label class="row flex start"><input type="checkbox" class="task_completion_input" name="use_test[ut_tasks_attributes][old_0][opt_for_task_completion]" value="true"><span>Task completion question</span></label></div>
      </div>
      </td>
      </tr>

      <tr class="task_tr">
      <td class="task_div">
      <span class="task_index">Task 2:</span>
      <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_tasks" data-id="old_1">Remove</a><span>)</span></div>
      <textarea name="use_test[ut_tasks_attributes][old_1][description]" class="ut_task_description" form="form_test_script" placeholder="Enter your task" required></textarea>
      <div class="flex start-input">
        <div class="include_text"><span>Include:</span></div>
        <div><label class="row flex start"><input type="checkbox" class="seq_input" name="use_test[ut_tasks_attributes][old_1][opt_for_seq]" value="true"><span>Task usability rating </span></label></div>
        <div><label class="row flex start"><input type="checkbox" class="task_completion_input" name="use_test[ut_tasks_attributes][old_1][opt_for_task_completion]" value="true"><span>Task completion question</span></label></div>
      </div>
      </td>
      </tr>

      <tr class="task_tr">
      <td class="task_div">
      <span class="task_index">Task 3:</span>
      <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_tasks" data-id="old_2">Remove</a><span>)</span></div>
      <textarea name="use_test[ut_tasks_attributes][old_2][description]" class="ut_task_description" form="form_test_script" placeholder="Enter your task" required></textarea>
      <div class="flex start-input">
        <div class="include_text"><span>Include:</span></div>
        <div><label class="row flex start"><input type="checkbox" class="seq_input" name="use_test[ut_tasks_attributes][old_2][opt_for_seq]" value="true"><span>Task usability rating</span></label></div>
        <div><label class="row flex start"><input type="checkbox" class="task_completion_input" name="use_test[ut_tasks_attributes][old_2][opt_for_task_completion]" value="true"><span>Task completion question</span></label></div>
      </div>
      </td>
      </tr>

      <tr><td>
        <a href="javascript:void(0);" id="add_tasks" class="flex start"><div><img src="add-btn.svg" width="20"></img>&nbsp;</div>&nbsp;<div>Add a task</div></a>
      </td></tr>
      </table>
      </div>
      <hr>
      <footer class="flex end">
        <a javascript="void(0);" id="cancel_test_script">Back</a>
        <a javascript="void(0);" id="test_script_test">Continue</a>
      </footer>
    </form></div>`;


function createStepTestScriptDialog(params, use_test, customer, back) {
  stepTestScriptDialog = document.createElement("dialog");
  stepTestScriptDialog.innerHTML = stepTestScriptHtml;

  const cancelButton = stepTestScriptDialog.querySelector("#cancel_test_script");

  const testScriptTestButton = stepTestScriptDialog.querySelector("#test_script_test");


  const addTasksButton = stepTestScriptDialog.querySelector("#add_tasks");
  const impr_learn_more = stepTestScriptDialog.querySelector("#impr_info_link");

  var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");


  impr_learn_more.addEventListener("click", e => {
    const site_url = `${website_url}/impression-testing` 
    require("uxp").shell.openExternal(`${site_url}`);
  })

  addTasksButton.addEventListener("click", e => {
    var clone = $('.ut_task_description:last').closest('tr').clone();
    var id = Number($('.ut_task_description:last').attr('name').split("description")[0].split("][")[1].split("_")[1]);
    clone.find('textarea').attr("name", "use_test[ut_tasks_attributes][" + ("new_" + (id + 1)) + "][description]").val("");
    var task_index = Number(clone.find('span:first').text().split(" ")[1].split(":")[0]);
    clone.find('span:first').text("Task "+(task_index + 1)+":")
    clone.find('a:first').attr("data-id", "new_" + (id + 1)).text("Remove");
    clone.find('a').prev("span").text("(");
    clone.find('a').next("span").text(")");
    clone.find("div.include_text span").text("Include:");
    clone.find('input:first').attr("name", "use_test[ut_tasks_attributes][" + ("new_" + (id + 1)) + "][opt_for_seq]").prop("checked", false);
    clone.find('label:first span').text("Task usability rating");
    clone.find('input:last').attr("name", "use_test[ut_tasks_attributes][" + ("new_" + (id + 1)) + "][opt_for_task_completion]").prop("checked", false);
    clone.find('label:last span').text("Task completion question");
      clone.find(".upgrade_plan_div").remove();
      clone.find(".seq_input").removeAttr("disabled");
      clone.find(".task_completion_input").removeAttr("disabled");
    if (!features_allowed_for_plan("seq",customer_plan["kind"])) {
      var allowed_plan = next_feature_allowed_plan("seq")
      $("<div class='flex start-input upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter(clone.find(".start-input"));
      clone.find(".seq_input").attr("disabled", true);
      clone.find(".task_completion_input").attr("disabled", true);
    }else{
      clone.find(".upgrade_plan_div").remove();
      clone.find(".seq_input").removeAttr("disabled");
      clone.find(".task_completion_input").removeAttr("disabled");
    }
  
    clone.insertAfter($('.ut_task_description:last').closest('tr'));
    $(".upgrade_plan").on("click", function(){
      var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
      var upgrade_url = `${website_url}/plan/upgrade?${user_params}`
      require("uxp").shell.openExternal(`${upgrade_url}`);
    })
    var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");

    for (var i = 0; i < removeTasksButton.length; i++) {
      removeTasksButton[i].addEventListener('click', function() {
        var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");
        if (removeTasksButton.length > 1) {
          if (!$.isEmptyObject(ut_tasks_json)) {
            var task_id = $(this).attr("data-id");
            delete ut_tasks_json[task_id];
          }
          $(this).closest('tr').remove();
          $(".task_tr").each(function(index) {
            $(this).find("span:first").text("Task "+(index+1)+":");
          })

        }
      });
    }
  });

  var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");
  for (var i = 0; i < removeTasksButton.length; i++) {
    removeTasksButton[i].addEventListener('click', function() {
      var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");
      if (removeTasksButton.length > 1) {
        if (!$.isEmptyObject(ut_tasks_json)) {
          var task_id = $(this).attr("data-id");
          delete ut_tasks_json[task_id];
        }
        $(".task_tr").each(function(index) {
          $(this).find("span:first").text("Task "+(index+1)+":");
        })
      }
    });
  }



  cancelButton.addEventListener("click", e => {
    $('form#form_test_script input[required], form#form_test_script textarea[required]').each(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#form_test_script input[required], form#form_test_script textarea[required]').focus(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
    });

    if (validate) {
        /// For serailaizing tasks 
      test_json["test_script_step"] = {};

      $('form#form_test_script .ut_task_description').each(function() {
        var id = $(this).closest("tr").find("a:first").attr("data-id");
        var name = $(this).attr('name');

        if (ut_tasks_json[id] == undefined) {
          ut_tasks_json[id] = {};
        }
        ut_tasks_json[id]["description"] = $(this).val();
        ut_tasks_json[id]["opt_for_seq"] = $(this).closest('tr').find('input:first').is(":checked");
        ut_tasks_json[id]["opt_for_task_completion"] = $(this).closest('tr').find('input:last').is(":checked");
      })


      test_json["test_script_step"]["scenario"] = $("#scenario").val();
      test_json["test_script_step"]["do_impression_test"] = $("#do_impression_test").is(":checked");
      test_json["test_script_step"]["ut_tasks_attributes"] = ut_tasks_json;
      useTest['use_test']["scenario"] = $("#scenario").val();
      useTest['use_test']["do_impression_test"] = $("#do_impression_test").is(":checked");
      useTest['use_test']["ut_tasks_attributes"] = ut_tasks_json;
      if (!$.isEmptyObject(ut_tasks_json)) {
        ut_tasks = ut_tasks_json;
      }
 
      stepTestScriptDialog.close("reasonCanceled");
      const callNextStep = callAudienceStep("", use_test, customer,true);

    } else {
      e.preventDefault();
    }
  });

  testScriptTestButton.addEventListener("click", e => {
    $('form#form_test_script input[required], form#form_test_script textarea[required]').each(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#form_test_script input[required], form#form_test_script textarea[required]').focus(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
    });

    if (validate) {
      test_json["test_script_step"] = {};
      /// For serailaizing tasks 
      
      $('form#form_test_script .ut_task_description').each(function() {
        var id = $(this).closest("tr").find("a:first").attr("data-id");
        var name = $(this).attr('name');

        if (ut_tasks_json[id] == undefined) {
          ut_tasks_json[id] = {};
        }        
        ut_tasks_json[id]["description"] = $(this).val();
        ut_tasks_json[id]["opt_for_seq"] = $(this).closest('tr').find('input:first').is(":checked");
        ut_tasks_json[id]["opt_for_task_completion"] = $(this).closest('tr').find('input:last').is(":checked");
      })

      test_json["test_script_step"]["scenario"] = $("#scenario").val();
      test_json["test_script_step"]["do_impression_test"] = $("#do_impression_test").is(":checked");
      test_json["test_script_step"]["ut_tasks_attributes"] = ut_tasks_json;
      useTest['use_test']["scenario"] = $("#scenario").val();
      useTest['use_test']["do_impression_test"] = $("#do_impression_test").is(":checked");
      useTest['use_test']["ut_tasks_attributes"] = ut_tasks_json;

      if (!$.isEmptyObject(ut_tasks_json)) {
        ut_tasks = ut_tasks_json;
      }
   
      stepTestScriptDialog.close("reasonCanceled");
      const callNextStep = callPostTestStep("", use_test, customer);

    } else {
      e.preventDefault();
    }

  });

  document.appendChild(stepTestScriptDialog);

  var tasks;
  if (back) {
    tasks = useTest['use_test']["ut_tasks_attributes"];
    // For retaining the value of scenario and impresssion test checkbox
    $("#scenario").val(useTest['use_test']['scenario']);
    $("#do_impression_test").prop("checked", useTest['use_test']['do_impression_test']); 
  }else {
    if (useTest["type"] == "edit_test") {
      tasks = useTest['use_test']["ut_tasks_attributes"];
      $("#scenario").val(useTest['use_test']['scenario']);
      $("#do_impression_test").prop("checked", useTest['use_test']['do_impression_test']); 
    }else if (!$.isEmptyObject(useTest) && !$.isEmptyObject(useTest['use_test']["ut_tasks_attributes"]) && useTest["type"] != "edit_test") {
      tasks = useTest['use_test']["ut_tasks_attributes"];
      // For retaining the value of scenario and impresssion test checkbox
      $("#scenario").val(useTest['use_test']['scenario']);
      $("#do_impression_test").prop("checked", useTest['use_test']['do_impression_test']); 
    }else if (!$.isEmptyObject(use_test)){
      tasks = ut_tasks;
      // For retaining the value of scenario and impresssion test checkbox
      $("#scenario").val(use_test['scenario']);
      $("#do_impression_test").prop("checked", use_test['do_impression_test']); 
    }else {
      tasks = ut_tasks;
    }
  }
  

  

  var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");

  for (var i = 0; i < removeTasksButton.length; i++) {
    removeTasksButton[i].addEventListener('click', function() {
      var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");
      if (removeTasksButton.length > 1) {
        if (!$.isEmptyObject(ut_tasks_json)) {
          var task_id = $(this).attr("data-id");
          delete ut_tasks_json[task_id];
        }
        $(this).closest('tr').remove();
        $(this).closest('tr').remove();
        $(".task_tr").each(function(index) {
          $(this).find("span:first").text("Task "+(index+1)+":");
        })
      }
    });
  }
    
    

  if (!$.isEmptyObject(tasks)) {

    // If tasks added while editing test are greater than default no we display on dialog
    if (Object.keys(tasks).length > $(".ut_task_description").length) {

      var add_task_length = (Object.keys(tasks).length - $(".ut_task_description").length);
      for (var i = 0; i < add_task_length; i++) {
        var clone = $('.ut_task_description:last').closest('tr').clone();
        var id = Number($('.ut_task_description:last').attr('name').split("description")[0].split("][")[1].split("_")[1]);
        var task_index = Number(clone.find('span:first').text().split(" ")[1].split(":")[0]);
        clone.find("div.include_text span").text("Include:");
        clone.find('span:first').text("Task "+(task_index + 1)+":")
        clone.find('textarea').attr("name", "use_test[ut_tasks_attributes][" + ("old_" + (id + 1)) + "][description]");
        clone.find('input:first').attr("name", "use_test[ut_tasks_attributes][" + ("old_" + (id + 1)) + "][opt_for_seq]");
        clone.find('label:first span').text("Task usability rating");
        clone.find('input:last').attr("name", "use_test[ut_tasks_attributes][" + ("old_" + (id + 1)) + "][opt_for_task_completion]");
        clone.find('label:last span').text("Task completion question");
        clone.find('a:first').attr("data-id", "old_" + (id + 1)).text("Remove");
        clone.find('a').prev("span").text("(");
        clone.find('a').next("span").text(")");
        clone.insertAfter($('.ut_task_description:last').closest('tr'));
      }
    }

    if ($(".ut_task_description").length > Object.keys(tasks).length){
      var task_count = $(".ut_task_description").length - Object.keys(tasks).length
      for (var i = 0; i < task_count; i++) {
        if ($(".task_tr").length > 1) {
          if (!$.isEmptyObject(ut_tasks_json)) {
            var task_id = $(this).attr("data-id");
            delete ut_tasks_json[task_id];
          }
          $(".task_tr:last").remove();
          $(this).closest('tr').remove();
          $(".task_tr").each(function(index) {
            $(this).find("span:first").text("Task "+(index+1)+":");
          })
        }
      }
    }

    var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");

    for (var i = 0; i < removeTasksButton.length; i++) {
      removeTasksButton[i].addEventListener('click', function() {
        var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");
        if (removeTasksButton.length > 1) {
          if (!$.isEmptyObject(ut_tasks_json)) {
            var task_id = $(this).attr("data-id");
            delete ut_tasks_json[task_id];
          }
          $(this).closest('tr').remove();
          $(this).closest('tr').remove();
          $(".task_tr").each(function(index) {
            $(this).find("span:first").text("Task "+(index+1)+":");
          })
        }
      });
    }
    
    

    /// For adding already created tasks
    var task_no = 1;
    $.each(tasks, function(key,value){
      var task_div = $(".task_tr")[task_no - 1];
      $(task_div).find('a').attr("data-id", key);
      $(task_div).find("div.include_text span").text("Include:");
      $(task_div).find(".ut_task_description").attr("name", "use_test[ut_tasks_attributes][" + key + "][description]");
      $(task_div).find(".ut_task_description").text(value["description"]);
      $(task_div).find('span:first').text("Task "+task_no+":");
      $(task_div).find('input:first').attr("name", "use_test[ut_tasks_attributes][" + key + "][opt_for_seq]").prop("checked", value["opt_for_seq"]);
      $(task_div).find('label:first span').text("Task usability rating");
      $(task_div).find('input:last').attr("name", "use_test[ut_tasks_attributes][" + key + "][opt_for_task_completion]").prop("checked", value["opt_for_task_completion"]);
      $(task_div).find('label:last span').text("Task completion question");
      task_no++;
    }) 
  }

    $(".upgrade_plan_div").remove();
    if ((!features_allowed_for_plan("seq",customer_plan["kind"])) ||(order_active && useTest["type"] != "edit_test")) {
      var allowed_plan = next_feature_allowed_plan("seq")
      $("<div class='flex start-input upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($(".task_tr .start-input"));
      $(".seq_input").attr("disabled", true);
      $(".task_completion_input").attr("disabled", true);
    }else{
      $(".upgrade_plan_div").remove();
      $(".seq_input").removeAttr("disabled");
      $(".task_completion_input").removeAttr("disabled");
    }
  
  if (order_active && useTest["type"] != "edit_test") {
    $("#add_tasks").addClass("display_none");
    $("#do_impression_test").attr("disabled", true);
  }else{
    $("#add_tasks").removeClass("display_none");
    $("#do_impression_test").removeAttr("disabled");
  }

  $(".upgrade_plan").on("click", function(){
    var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
    var upgrade_url = `${website_url}/plan/upgrade?${user_params}`
    require("uxp").shell.openExternal(`${upgrade_url}`);
  })
  var removeTasksButton = stepTestScriptDialog.querySelectorAll(".remove_tasks");

}

function countElement(item, array) {
  var count = 0;
  $.each(array, function(i, v) {
    if (v === item) {
      count++;
    }
  });
  return count;
}

//// Use Test Test Script Step Dialog End ////


//// Use Test Post Test Step Dialog Start ////

let stepPostTestDialog;

const stepPostTestHtml =
  `<style>
    .post-test-dialog {
      height: auto;
      width: 700px;
    }

    .post_test_step {
      height: 480px;
      width: 700px;
      overflow-y: scroll;
      align-items: center;
      margin: 0px 30px 0px 30px;
    }

    .post-test-dialog input[type="checkbox"]{
      vertical-align:middle;
    }

    .post-test-dialog .select-label{
      display : inline-block;
      margin-top : 10px;
      margin-left: 4px;
    }

    .post-test-dialog h1 {
        margin-top: 20px !important;
     }
    .post-test-dialog hr{
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    .post-test-dialog input[type="text"], .post-test-dialog input[type="number"], .post-test-dialog textarea {
        width: 70%;
        margin-left: 23px !important;
        margin-bottom: 10px !important;
      }
      .post-test-dialog textarea {
        height: 33px !important;
      }
      .post-test-dialog a {
        text-decoration: underline !important;
      }
      .post-test-dialog button {
        width: 20%;
      }

      .post-test-dialog table {
        margin-left: 10px !important;
      }

      .post-test-dialog tr{
        margin-top: 30px !important;
      }

      .post-test-dialog .head-center {
        text-align: center !important;
        margin-bottom: 20px !important;
      }
     
      .post-test-dialog .green_button {
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 21px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .post-test-dialog .disabled_button {
        width: 150px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: grey !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .post-test-dialog #cancel_post_test {
        border: 1px solid #444444;
        border-radius: 6px;
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #000000 !important;
        background: #ffffff !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .post-test-dialog h2 {
        font-size: 18px !important;
        color: #000000 !important;
       }
      .post-test-dialog td,.post-test-dialog label,.post-test-dialog span {
        font-size: 14px !important;
        color: #000000 !important;
        font-weight: normal !important;
       }
       .post-test-dialog .flex {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
        .post-test-dialog .center {
          justify-content: center;
        }
        .post-test-dialog .start {
          justify-content: flex-start;
        }
        .post-test-dialog .end {
          justify-content: flex-end;
        }
        .post-test-dialog .ml-25 {
          margin-left: 20px !important;
          margin-top: 15px !important;
        }
        .post-test-dialog select {
          width: 40% !important;
          margin-left: 35px !important;
        }
        .post-test-dialog .require_participant {
          margin-left: 35px !important;
          font-size: 12px !important;
        }
        .post-test-dialog i {
          font-style: italic !important;
          color: black !important;
        }
        .post-test-dialog label.start span {
          font-size: 12px !important;
        }
        .post-test-dialog #add_questions img {
          margin-right: 5px !important;
        }
        .post-test-dialog a, .post-test-dialog a span {
          font-size: 12px !important;
          color: #56abcc !important;
        }
        .post-test-dialog .error {
          color: red !important;
          margin-left: 25px !important;
        }
       .post-test-dialog .que-center {
          justify-content: center;
          margin-top: 0px !important;
        }
        .post-test-dialog .survey_questions_div select {
          width: 43% !important;
          margin-top: 0px !important;
          margin-left: 0px !important;
        }
        .post-test-dialog .survey_questions_div .que-center span {
          margin-right: 5px;
          margin-top: -10px !important;
        }
        .post-test-dialog .question_options_div {
          margin-left: 43px !important;
        }
        .post-test-dialog .slider_rating {
          margin-left: 188px !important;
        }

        .post-test-dialog .slider_rating input {
          width: 15% !important;
          margin-left: 12px !important;
        }

        .post-test-dialog .slider_rating .label_div input {
          margin-left: 15px !important;
        }
   
        .post-test-dialog .question_options_div input[type="text"] {
          width: 68%;
          margin-bottom: 5px !important;
        }
        .post-test-dialog .add_question_options {
          margin-left: 25px !important;
          margin-top: 15px !important;
        }
        .post-test-dialog .add_question_options img{
          margin-right: 5px !important;
        }
        .post-test-dialog .remove_question_options {
          margin-top: 0px !important;
          margin-left: 165px !important;
          margin-bottom: 15px !important;
        }
        .post-test-dialog .display_none {
          display: none !important;
        }
        .post-test-dialog .survey_questions_div {
          margin-bottom: 30px !important;
        }

        .post-test-dialog .upgrade_plan_div{
          margin-left: 35px !important;
        }
        .post-test-dialog .upgrade_plan_div i, .post-test-dialog .upgrade_plan_div_question i{ 
          font-style: italic !important;
          color: #666666 !important;
          font-size: 12px !important;
        }
        .post-test-dialog .upgrade_plan_div a, .post-test-dialog .upgrade_plan_div_question a{ 
          font-style: italic !important;
          font-size: 12px !important;
          margin-left: 5px !important;
        }
        .post-test-dialog .more_options span {
          font-style: italic !important;
          color: #666666 !important;
          font-size: 12px !important;
          margin-left: 25px !important;
        }
        .post-test-dialog .min_max_value {
          font-style: italic !important;
          color: #666666 !important;
          font-size: 12px !important;
          margin-left: 175px !important;
        }
        .post-test-dialog .min_max_error {
          margin-left: 175px !important;
        }
        .post-test-dialog table {
          margin-bottom: 40px !important;
          padding-bottom: 40px !important;
        }
        .post-test-dialog .disabled {
          background-color: grey !important;
        }
      </style>
    <div class="white-background">
    <form method="dialog" class="post-test-dialog" id="form_post_test_step">
    <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
    <div class="post_test_step">
      <h1>Create a new test - Post-test (Step 4 of 4)</h1>
      <table>

        <tr>
        <td><span>Post-test survey:</span></td>
        </tr>
        <tr class="ml-25 survey_questions_div">
        <td>
        <span class="survey_index">Question 1:</span>
        <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_questions" data-id="old_0">Remove</a><span>)</span></div>
        <textarea name="use_test[questions_attributes][old_0][question]" class="questions" form="form_test_script" placeholder="Question" required></textarea>
        <div class="flex que-center">
          <span>Type:</span>
          <select class="question_type" name="use_test[questions_attributes][old_0][question_type]" data-id="old_0">
          </select>
        </div>
        </td>
        </tr>

        <tr class="ml-25 survey_questions_div">
        <td>
        <span class="survey_index">Question 2:</span>
        <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_questions" data-id="old_1">Remove</a><span>)</span></div>
        <textarea name="use_test[questions_attributes][old_1][question]" class="questions" form="form_test_script" placeholder="Question" required></textarea>
        <div class="flex que-center">
          <span>Type:</span>
          <select class="question_type" name="use_test[questions_attributes][old_1][question_type]" data-id="old_1">
          </select>
        </div>
        </td>
        </tr>

        <tr class="ml-25 survey_questions_div">
        <td>
        <span class="survey_index">Question 3:</span>
        <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_questions" data-id="old_2">Remove</a><span>)</span></div>
        <textarea name="use_test[questions_attributes][old_2][question]" class="questions" form="form_test_script" placeholder="Question" required></textarea>
        <div class="flex que-center">
          <span>Type:</span>
          <select class="question_type" name="use_test[questions_attributes][old_2][question_type]" data-id="old_2">
          </select>
        </div>
        </td>
        </tr>

        <tr class="ml-25 survey_questions_div">
        <td>
        <span class="survey_index">Question 4:</span>
        <div class="flex start"><span>(</span><a href="javascript:void(0);" class="remove_questions" data-id="old_3">Remove</a><span>)</span></div>
        <textarea name="use_test[questions_attributes][old_3][question]" class="questions" form="form_test_script" placeholder="Question" required></textarea>
        <div class="flex que-center">
          <span>Type:</span>
          <select class="question_type" name="use_test[questions_attributes][old_3][question_type]" data-id="old_3">
          </select>
        </div>
        </td>
        </tr>
        
        <tr class="ml-25">
        <td>
          <a href="javascript:void(0);" id="add_questions" class="flex start"><div><img src="add-btn.svg" width="20"></img>&nbsp;</div>&nbsp;<div>Add a question</div></a>
        </td>
        </tr>
        
        <tr>
        <td><span>System usability scoring:</span></td>
        </tr>
        <tr class="ml-25">
        <td>
          <label for="opt_for_sus" class="row flex start">
            <input type="checkbox" name="use_test[opt_for_sus]" id="opt_for_sus" value="true">
            <span>Include a system usability questionnaire at the end of my test</span><i>(recommended)</i>
          </label>
          <select name="use_test[sus_survey_id]" id="sus_survey_id">        
          </select>
        </td>
        </tr>
        <tr class=ml-25>
          <td><a href="javascript:void(0);" id="sus_learn_more">Learn more></a></td>
        </tr>


        <tr>
        <td><span>NPS:</span></td>
        </tr>
        <tr class="ml-25">
        <td>
          <label for="opt_for_nps" class="row flex start">
            <input type="checkbox" name="use_test[opt_for_nps]" id="opt_for_nps" value="true">
            <span>Include Net Promoter Score results with my test</span>
          </label>
        </td>
        </tr>

        <tr class="ux_crowd_tr"> 
        <td><span>UX Crowd:</span></td>
        </tr>
        <tr class="ml-25">
        <td>
          <label for="opt_for_ux_crowd" class="row flex start">
            <input type="checkbox" name="use_test[opt_for_ux_crowd]" id="opt_for_ux_crowd" value="true">
            <span>Include crowdsourced usability analysis with my test</span>
          </label>
          <span class="require_participant">(Requires 10+ test participants)</span>
        </td>
        </tr>
        </table>
        </div>
        <hr>
        <footer class="flex end">
          <a href="javascript:void(0);" id="cancel_post_test">Back</a>
          <a href="javascript:void(0);" id="post_test_step_button" class="green_button">Finish</a>
        </footer>
    </form></div>`;



function createStepPostTestDialog(params, use_test, customer) {
  stepPostTestDialog = document.createElement("dialog");
  stepPostTestDialog.innerHTML = stepPostTestHtml;

  const cancelButton = stepPostTestDialog.querySelector("#cancel_post_test");

  const postTestButton = stepPostTestDialog.querySelector("#post_test_step_button");
  const addQuestionsButton = stepPostTestDialog.querySelector("#add_questions");
  const sus_learn_more = stepPostTestDialog.querySelector("#sus_learn_more");
  var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");
  const ux_Crowd_Checkbox = stepPostTestDialog.querySelector("#opt_for_ux_crowd");
  var selectQuestionType = stepPostTestDialog.querySelectorAll(".question_type");
  var addQuestionOptions = stepPostTestDialog.querySelectorAll(".add_question_options");

  sus_learn_more.addEventListener("click", e => {
    const site_url = `${website_url}/features#ux-diagnostics` 
    require("uxp").shell.openExternal(`${site_url}`);
  })

  addQuestionsButton.addEventListener("click", e => {
      if ($(".questions").length >= allowed_question_limit_planwise[customer_plan["kind"]]) {
        $("#add_questions").next(".upgrade_plan_div_question").remove();
        $("#add_questions").removeAttr("disabled");
        if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
          $("<div class='flex flex-start upgrade_plan_div_question'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_questions"));
          $("#add_questions").attr("disabled", true);
        }else{
          $("#add_questions").next(".upgrade_plan_div_question").remove();
          $("#add_questions").addClass("display_none");
        }
      }else{
        $("#add_questions").next(".upgrade_plan_div_question").remove();
        $("#add_questions").removeAttr("disabled");
        if ($('.questions:last').closest("tr").hasClass("display_none") && $('.questions').closest("tr").length == 1){
          $('.questions:last').closest("tr").removeClass("display_none").addClass("display_block");
          $('.questions:last').closest("tr").find(".slider_rating").remove();
          $('.questions:last').closest("tr").find(".question_options_div").remove();
          $.each(survey_question_types, function(key, value) {
            if (key == 'free_response'){
              $('.questions:last').closest("tr").find('select').append($("<option selected></option>").attr("value",key).text(value)); 
            }else{
              $('.questions:last').closest("tr").find('select').append($("<option></option>").attr("value",key).text(value)); 
            }
          });

          var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");

          for (var i = 0; i < removeQuestionsButton.length; i++) {
            removeQuestionsButton[i].addEventListener('click', function() {
              var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");
              if (!$.isEmptyObject(survey_questions_json)) {
                var q_id = $(this).attr("data-id");
                delete survey_questions_json[q_id];
              }
              if (removeQuestionsButton.length == 1) {
                $(this).closest('tr').addClass("display_none"); 
              }else{
                $(this).closest('tr').remove();
                $(".survey_questions_div").each(function(index) {
                  $(this).find("span:first").text("Question "+(index+1)+":");
                })
              }

              if ($(".questions").length < allowed_question_limit_planwise[customer_plan["kind"]]) {
                $("#add_questions").next(".upgrade_plan_div_question").remove();
                $("#add_questions").removeClass("display_none");
                $("#add_questions").removeAttr("disabled");
              }
            });
          }


           var selectQuestionType = stepPostTestDialog.querySelectorAll(".question_type");

          for (var i = 0; i < selectQuestionType.length; i++) {
            selectQuestionType[i].addEventListener('change', function() {
              // if (this.options[this.selectedIndex].length > 0){
              var id = $(this).attr("data-id");
              if (this.options[this.selectedIndex].getAttribute('value') == "single_select" || this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
                $(this).closest("tr").find(".slider_rating").remove();
                $(this).closest("tr").find(".question_options_div").remove();
                var question_options = `<div class="question_options_div"><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_0][answer]" data-id="old_opt_0" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_0">Remove this answer</a></div></div><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_1][answer]" data-id="old_opt_1" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_1">Remove this answer</a></div></div><a href="javascript:void(0);" class="add_question_options flex start" data-id="`+id+`"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a></div>`
                $(question_options).insertAfter($(this).closest("div"));

                 var addQuestionOptions =  $(this).closest("tr").find(".add_question_options");

                for (var i = 0; i < addQuestionOptions.length; i++) {
                  addQuestionOptions[i].addEventListener('click', function() {
                    if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                      $(this).attr("disabled",true);
                      $(this).closest("tr").find(".more_options").remove();
                      $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                    }else{
                      $(this).removeAttr("disabled");
                      $(this).closest("tr").find(".more_options").remove();
                      var add_question_option = $(this).closest('tr');
                      var clone = $(this).closest('tr').find(".question_options:last").clone();
                      var que_id = $(this).attr('data-id');
                      var option_id = Number(clone.find("a").attr("data-id").split("_")[2]);
                      clone.find('input').attr("name", "use_test[questions_attributes][" + que_id + "][question_options_attributes][" + ("new_type_" + (option_id + 1)) + "][answer]").val("");
                      clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                      clone.insertAfter($(this).closest('tr').find(".question_options:last"));
                      

                      var removeQuestionOptionButton = add_question_option.find(".remove_question_options");

                      for (var i = 0; i < removeQuestionOptionButton.length; i++) {
                        removeQuestionOptionButton[i].addEventListener('click', function() {
                          var removeQuestionOptionButton = add_question_option.find(".remove_question_options");
                          if (removeQuestionOptionButton.length > 2) {
                            if (!$.isEmptyObject(survey_questions_json)) {
                              var opt_id = $(this).attr("data-id");
                              var q_id = $(this).closest('tr').find("a:first").attr("data-id");
                              delete survey_questions_json[q_id]["question_options_attributes"][opt_id];
                            }
                            $(this).closest('div.question_options').remove();
                          } 
                          if (add_question_option.closest('tr').find(".question_options").length < survey_opt_counter) {
                            add_question_option.find(".add_question_options").removeAttr("disabled");
                            add_question_option.find(".add_question_options").next(".more_options").remove();
                          }          
                        });
                      }
                    }
                    if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                      $(this).attr("disabled",true);
                      $(this).closest("tr").find(".more_options").remove();
                      $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                    }
                  })
                }

              }else if (this.options[this.selectedIndex].getAttribute('value') == "slider_rating") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
                var slider_options = `<div class="slider_rating"><div class="flex start value_div"><span>min value:</span><input type="number" class="min_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_value]" min="0" required"><span>max value:</span><input type="number" class="max_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_value]" max="10" required"></div><div class="flex start label_div"><span>min label:</span><input type="text" class="min_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_label]" required"><span>max label:</span><input type="text" class="max_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_label]" required"></div></div>`
                $(slider_options).insertAfter($(this).closest("div"));
                $("input.min_value").on('focusin', function(){
                  $(".min_max_value").remove();
                  $(this).data('val', $(this).val());
                }).on('change', function(){
                    var minInput = $(this);
                    var minVal = parseInt(minInput.val());
                    var maxInput = $(this).closest(".slider_rating").find(".max_value");
                    var maxVal = parseInt(maxInput.val());
                    var prev = $(this).data('val');
                    $(".min_max_value").remove();
                    if (minVal < 0) {
                      $('<span class="min_max_value">Minimum value must be greater than and equal to 0</span>').insertAfter($(this).closest(".slider_rating"));
                      minVal.val(1);
                    }else if (minVal < 0 || minVal > 9) {
                      $('<span class="min_max_value">Minimun value must be greater than and equal to 0 and less than 9 value</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(1);
                    } else if (minVal >= maxVal) {
                      $('<span class="min_max_value">Minimum value must be less than the maximum</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(prev);
                    }
                });
                $("input.max_value").on('focusin', function(){
                    $(".min_max_value").remove();
                    $(this).data('val', $(this).val());
                }).on('change', function(){
                    var maxInput = $(this);
                    var maxVal = parseInt(maxInput.val());
                    var minInput = $(this).closest(".slider_rating").find(".min_value");
                    var minVal = parseInt(minInput.val());
                    var prev = $(this).data('val');
                    if (maxVal < 1 || maxVal > 10) {
                      $('<span class="min_max_value">Maximum value cannot exceed 10</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(5);
                    } else if (maxVal <= minVal) {
                      $('<span class="min_max_value">Maximum value must be greater than the minimum</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(prev);
                    }
                });
              }else if (this.options[this.selectedIndex].getAttribute('value') == "free_response") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
              }
            })
          }
        }else{
          $("#add_questions").next(".upgrade_plan_div_question").remove();
          $("#add_questions").removeAttr("disabled");
          var clone = $('.questions:last').closest('tr').clone();
          var id = Number($('.questions:last').attr('name').split("question")[1].split("][")[1].split("_")[1]);
          clone.find('textarea').attr("name", "use_test[questions_attributes][" + ("new_" + (id + 1)) + "][question]").val("");
          clone.find('a:first').attr("data-id", "new_" + (id + 1)).text("Remove");
          clone.find('a').prev("span").text("(");
          clone.find('a').next("span").text(")");
          var que_index = Number(clone.find('span:first').text().split(" ")[1].split(":")[0]);
          clone.find('span:first').text("Question "+(que_index + 1)+":");
          clone.find('select').attr("name", "use_test[questions_attributes][" + ("new_" + (id + 1)) + "][question_type]");
          clone.find('select').attr("data-id", "new_" + (id + 1));
          clone.find('select option').remove();
          clone.find('select').closest('div').find('span').text("Type:");
          $.each(survey_question_types, function(key, value) {
            if (key == 'free_response'){
              clone.find('select').append($("<option selected></option>").attr("value",key).text(value)); 
            }else{
              clone.find('select').append($("<option></option>").attr("value",key).text(value)); 
            }
          });
          clone.find(".slider_rating").remove();
          clone.find(".question_options_div").remove();
          clone.insertAfter($('.questions:last').closest('tr'));
          var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");

          for (var i = 0; i < removeQuestionsButton.length; i++) {
            removeQuestionsButton[i].addEventListener('click', function() {
              var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");
              if (!$.isEmptyObject(survey_questions_json)) {
                var q_id = $(this).attr("data-id");
                delete survey_questions_json[q_id];
              }
              if (removeQuestionsButton.length == 1) {
                $(this).closest('tr').addClass("display_none"); 
              }else{
                $(this).closest('tr').remove();
                $(".survey_questions_div").each(function(index) {
                  $(this).find("span:first").text("Question "+(index+1)+":");
                })
              }
              if ($(".questions").length < allowed_question_limit_planwise[customer_plan["kind"]]) {
                $("#add_questions").next(".upgrade_plan_div_question").remove();
                $("#add_questions").removeClass("display_none");
                $("#add_questions").removeAttr("disabled");
              }
            });
          }


           var selectQuestionType = stepPostTestDialog.querySelectorAll(".question_type");

           for (var i = 0; i < selectQuestionType.length; i++) {
            selectQuestionType[i].addEventListener('change', function() {
              // if (this.options[this.selectedIndex].length > 0){
              var id = $(this).attr("data-id");
              if (this.options[this.selectedIndex].getAttribute('value') == "single_select" || this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
                $(this).closest("tr").find(".slider_rating").remove();
                $(this).closest("tr").find(".question_options_div").remove();
                var question_options = `<div class="question_options_div"><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_0][answer]" data-id="old_opt_0" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_0">Remove this answer</a></div></div><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_1][answer]" data-id="old_opt_1" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_1">Remove this answer</a></div></div><a href="javascript:void(0);" class="add_question_options flex start" data-id="`+id+`"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a></div>`
                $(question_options).insertAfter($(this).closest("div"));
                var addQuestionOptions = $(this).closest("tr").find(".add_question_options");

                for (var i = 0; i < addQuestionOptions.length; i++) {
                  addQuestionOptions[i].addEventListener('click', function() {
                    if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                      $(this).attr("disabled",true);
                      $(this).closest("tr").find(".more_options").remove();
                      $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                    }else{
                      $(this).removeAttr("disabled");
                      $(this).closest("tr").find(".more_options").remove();
                      var add_question_option = $(this).closest('tr');
                      var clone = $(this).closest('tr').find(".question_options:last").clone();
                      var que_id = $(this).attr('data-id');
                      var option_id = Number(clone.find("a").attr("data-id").split("_")[2]);
                      clone.find('input').attr("name", "use_test[questions_attributes][" + que_id + "][question_options_attributes][" + ("new_type_" + (option_id + 1)) + "][answer]").val("");
                      clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                      clone.insertAfter($(this).closest('tr').find(".question_options:last"));
                      

                      var removeQuestionOptionButton = add_question_option.find(".remove_question_options");

                      for (var i = 0; i < removeQuestionOptionButton.length; i++) {
                        removeQuestionOptionButton[i].addEventListener('click', function() {
                          var removeQuestionOptionButton = add_question_option.find(".remove_question_options");
                          if (removeQuestionOptionButton.length > 2) {
                            if (!$.isEmptyObject(survey_questions_json)) {
                              var opt_id = $(this).attr("data-id");
                              var q_id = $(this).closest('tr').find("a:first").attr("data-id");
                              delete survey_questions_json[q_id]["question_options_attributes"][opt_id];
                            }
                            $(this).closest('div.question_options').remove();
                          }
                          if (add_question_option.closest('tr').find(".question_options").length < survey_opt_counter) {
                            add_question_option.find(".add_question_options").removeAttr("disabled");
                            add_question_option.find(".add_question_options").next(".more_options").remove();
                          }                 
                        });
                      }
                    }
                    if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                      $(this).attr("disabled",true);
                      $(this).closest("tr").find(".more_options").remove();
                      $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                    }
                  })
                }

              }else if (this.options[this.selectedIndex].getAttribute('value') == "slider_rating") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
                var slider_options = `<div class="slider_rating"><div class="flex start value_div"><span>min value:</span><input type="number" class="min_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_value]" min="0" required"><span>max value:</span><input type="number" class="max_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_value]" max="10" required"></div><div class="flex start label_div"><span>min label:</span><input type="text" class="min_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_label]" required"><span>max label:</span><input type="text" class="max_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_label]" required"></div></div>`
                $(slider_options).insertAfter($(this).closest("div"));
                $("input.min_value").on('focusin', function(){
                  $(".min_max_value").remove();
                  $(this).data('val', $(this).val());
                }).on('change', function(){
                    var minInput = $(this);
                    var minVal = parseInt(minInput.val());
                    var maxInput = $(this).closest(".slider_rating").find(".max_value");
                    var maxVal = parseInt(maxInput.val());
                    var prev = $(this).data('val');
                    $(".min_max_value").remove();
                    if (minVal < 0) {
                      $('<span class="min_max_value">Minimum value must be greater than and equal to 0</span>').insertAfter($(this).closest(".slider_rating"));
                      minVal.val(1);
                    }else if (minVal < 0 || minVal > 9) {
                      $('<span class="min_max_value">Minimun value must be greater than and equal to 0 and less than 9 value</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(1);
                    } else if (minVal >= maxVal) {
                      $('<span class="min_max_value">Minimum value must be less than the maximum</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(prev);
                    }
                });
                $("input.max_value").on('focusin', function(){
                    $(".min_max_value").remove();
                    $(this).data('val', $(this).val());
                }).on('change', function(){
                    var maxInput = $(this);
                    var maxVal = parseInt(maxInput.val());
                    var minInput = $(this).closest(".slider_rating").find(".min_value");
                    var minVal = parseInt(minInput.val());
                    var prev = $(this).data('val');
                    if (maxVal < 1 || maxVal > 10) {
                      $('<span class="min_max_value">Maximum value cannot exceed 10</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(5);
                    } else if (maxVal <= minVal) {
                      $('<span class="min_max_value">Maximum value must be greater than the minimum</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(prev);
                    }
                });
              }else if (this.options[this.selectedIndex].getAttribute('value') == "free_response") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
              }
            })
          }
        }
        if ($(".questions").length >= allowed_question_limit_planwise[customer_plan["kind"]]) {
          $("#add_questions").next(".upgrade_plan_div_question").remove();
          $("#add_questions").removeAttr("disabled");
          if ((customer_plan["kind"] == "paid_personal") || (customer_plan["kind"] == "team")){
            $("<div class='flex flex-start upgrade_plan_div_question'><i>(For additional questions, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#add_questions"));
            $("#add_questions").attr("disabled", true);
          }else{
            $("#add_questions").next(".upgrade_plan_div_question").remove();
            $("#add_questions").addClass("display_none");
          }
        }
      }
    
  });

  var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");

  for (var i = 0; i < removeQuestionsButton.length; i++) {
    removeQuestionsButton[i].addEventListener('click', function() {
      var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");
      if (!$.isEmptyObject(survey_questions_json)) {
        var q_id = $(this).attr("data-id");
        delete survey_questions_json[q_id];
      }
      if (removeQuestionsButton.length == 1) {
        $(this).closest('tr').addClass("display_none"); 
      }else{
        $(this).closest('tr').remove();
        $(".survey_questions_div").each(function(index) {
          $(this).find("span:first").text("Question "+(index+1)+":");
        })
      }
      if ($(".questions").length < allowed_question_limit_planwise[customer_plan["kind"]]) {
        $("#add_questions").next(".upgrade_plan_div_question").remove();
        $("#add_questions").removeClass("display_none");
        $("#add_questions").removeAttr("disabled");
      }
    });
  }


  cancelButton.addEventListener("click", e => {
    $('form#form_post_test_step input[required], form#form_post_test_step textarea[required],form#form_post_test_step input[type="number"]').each(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("min_value") || $(this).attr("name").includes("max_value")){
        $(this).closest(".slider_rating").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });




    $('form#form_post_test_step input[required], form#form_post_test_step textarea[required],form#form_post_test_step input[type="number"]').focus(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("min_value") || $(this).attr("name").includes("max_value")){
        $(this).closest(".slider_rating").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
    });


    if ($("#opt_for_sus").is(":checked")) {
      if ($("#sus_survey_id").val() == "") {
        validate = false;
      } else {
        validate = true;
      }
    }

    $('form#form_post_test_step .max_value, form#form_post_test_step .min_value').each(function() {
      $(this).css("border", "none");
      $(this).closest(".slider_rating").next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });

    $('form#form_post_test_step .max_value, form#form_post_test_step .min_value').focus(function() {
      $(this).css("border", "none");
      $(this).closest(".slider_rating").next("span").remove();
    });
    

    if (validate) {
      test_json["post_test_step"] = {};


      // For serilaizing checkboxes
      var checkBoxDataSetup = $("form#form_post_test_step").find('input[type=checkbox]').map(function() {
        if (this.checked) {
          return encodeURIComponent($(this).attr('name')) + '=' + true;
        } else {
          return encodeURIComponent($(this).attr('name')) + '=' + false;
        }
      }).get().join('&');

      /// For serializing dropdown data
      var selectData = $("form#form_post_test_step").find('select#sus_survey_id').map(function() {
        var name = $(this).attr('name').split("[")[1].split("]")[0];
        if (this.options[this.selectedIndex] != undefined) {
          var value = this.options[this.selectedIndex].getAttribute("value");
          var select_name = $(this).attr('name');
          useTest['use_test'][name] = value;
          test_json["post_test_step"][name] = value;
          return encodeURIComponent(select_name) + '=' + encodeURIComponent(value);
        }
      }).get().join('&');

      // test_screener_questions = {};
      $.each($("form#form_post_test_step .survey_questions_div"), function(k,v){
        var input_array = [];
        input_array.push($(v).find('input').serializeArray());
        input_array = $.map( input_array, function(n){
          return n;
        });
        // test_screener_questions = {};
        $.each(input_array, function(key, val) {
          var array = val['name'].replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
            if (survey_questions_json[array[2]] == undefined) {
              survey_questions_json[array[2]] = {}
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {}
              }
            };
            if (array.length == 6) {
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {};
              }
              survey_questions_json[array[2]][array[3]][array[4]] = val['value'];
            }else {
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {}
              }
              if (survey_questions_json[array[2]][array[3]][array[4]] == undefined) {
                survey_questions_json[array[2]][array[3]][array[4]] = {}
              }
              survey_questions_json[array[2]][array[3]][array[4]][array[5]] = val['value'];
            }
        });
        var array =  $(v).find('textarea').attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
        if (survey_questions_json[array[2]] == undefined) {
          survey_questions_json[array[2]] = {}
        };
        survey_questions_json[array[2]][array[3]] = $(v).find('textarea').val();

        $(v).find('select').map(function() {
          var select_survey = this.options[this.selectedIndex].getAttribute("value");
          var array = $(this).attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
          if (survey_questions_json[array[2]] == undefined) {
            survey_questions_json[array[2]] = {}
          };
          survey_questions_json[array[2]][array[3]] = select_survey;
        })

      })
  
      if (!$.isEmptyObject(survey_questions_json)) {
        test_json["post_test_step"]["questions_attributes"] = survey_questions_json;
        useTest["use_test"]["questions_attributes"] = survey_questions_json;
      }else{
        test_json["post_test_step"]["questions_attributes"] = {};
        useTest["use_test"]["questions_attributes"] = {};
      }

      test_json["post_test_step"]["opt_for_sus"] = $("#opt_for_sus").is(":checked");
      test_json["post_test_step"]["opt_for_nps"] = $("#opt_for_nps").is(":checked");
      test_json["post_test_step"]["opt_for_ux_crowd"] = $("#opt_for_ux_crowd").is(":checked");
      useTest['use_test']["opt_for_sus"] = $("#opt_for_sus").is(":checked");
      useTest['use_test']["opt_for_nps"] = $("#opt_for_nps").is(":checked");
      useTest['use_test']["opt_for_ux_crowd"] = $("#opt_for_ux_crowd").is(":checked");

      if ($("#opt_for_ux_crowd").is(":checked") && useTest['use_test']['num_testers'] < 10) {
        useTest['use_test']['num_testers'] = 10;
      }

      stepPostTestDialog.close("reasonCanceled");
      callTestScriptStep("", use_test, customer,true);

    } else {
      e.preventDefault();
    }
  })

  postTestButton.addEventListener("click", e => {
    $('form#form_post_test_step input[required], form#form_post_test_step textarea[required], form#form_post_test_step input[type="number"]').each(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("min_value") || $(this).attr("name").includes("max_value")){
        $(this).closest(".slider_rating").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });




    $('form#form_post_test_step input[required], form#form_post_test_step textarea[required], form#form_post_test_step input[type="number"]').focus(function() {
      $(this).css("border", "none");
      if ($(this).attr("name").includes("min_value") || $(this).attr("name").includes("max_value")){
        $(this).closest(".slider_rating").next("span").remove();
      }else{
        $(this).next("span").remove();
      }
    });


    if ($("#opt_for_sus").is(":checked")) {
      if ($("#sus_survey_id").val() == "") {
        validate = false;
      } else {
        validate = true;
      }
    }


    $('form#form_post_test_step .max_value, form#form_post_test_step .min_value').each(function() {
      $(this).css("border", "none");
      $(this).closest(".slider_rating").next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });

    $('form#form_post_test_step .max_value, form#form_post_test_step .min_value').focus(function() {
      $(this).css("border", "none");
      $(this).closest(".slider_rating").next("span").remove();
    });

    if (validate) {

      test_json["post_test_step"] = {};


      /// For serializing dropdown data
      var selectData = $("form#form_post_test_step").find('select#sus_survey_id').map(function() {
        var name = $(this).attr('name').split("[")[1].split("]")[0];
        if (this.options[this.selectedIndex] != undefined) {
          var value = this.options[this.selectedIndex].getAttribute("value");
          var select_name = $(this).attr('name');
          useTest['use_test'][name] = value;
          test_json["post_test_step"][name] = value;
          return encodeURIComponent(select_name) + '=' + encodeURIComponent(value);
        }
      }).get().join('&');

      
      // test_screener_questions = {};
      $.each($("form#form_post_test_step .survey_questions_div"), function(k,v){
        var input_array = [];
        input_array.push($(v).find('input').serializeArray());
        input_array = $.map( input_array, function(n){
          return n;
        });
        // test_screener_questions = {};
        $.each(input_array, function(key, val) {
          var array = val['name'].replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
            if (survey_questions_json[array[2]] == undefined) {
              survey_questions_json[array[2]] = {}
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {}
              }
            };
            if (array.length == 6) {
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {};
              }
              survey_questions_json[array[2]][array[3]][array[4]] = val['value'];
            }else {
              if (survey_questions_json[array[2]][array[3]] == undefined) {
                survey_questions_json[array[2]][array[3]] = {}
              }

              if (survey_questions_json[array[2]][array[3]][array[4]] == undefined) {
                survey_questions_json[array[2]][array[3]][array[4]] = {}
              }
              survey_questions_json[array[2]][array[3]][array[4]][array[5]] = val['value'];
            }
        });
        var array =  $(v).find('textarea').attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
        if (survey_questions_json[array[2]] == undefined) {
          survey_questions_json[array[2]] = {}
        };
        survey_questions_json[array[2]][array[3]] = $(v).find('textarea').val();
        
        $(v).find('select').map(function() {
          var select_survey = this.options[this.selectedIndex].getAttribute("value");
          var array = $(this).attr('name').replace(/]/g, ",").replace(/\[/g, ",").replace(/,,/g,",").split(",");
          if (survey_questions_json[array[2]] == undefined) {
            survey_questions_json[array[2]] = {}
          };
          survey_questions_json[array[2]][array[3]] = select_survey;
        })
      })

  
      if (!$.isEmptyObject(survey_questions_json)) {
        test_json["post_test_step"]["questions_attributes"] = survey_questions_json;
        useTest["use_test"]["questions_attributes"] = survey_questions_json;
      }else{
        test_json["post_test_step"]["questions_attributes"] = {};
        useTest["use_test"]["questions_attributes"] = {};
      }

      test_json["post_test_step"]["opt_for_sus"] = $("#opt_for_sus").is(":checked");
      test_json["post_test_step"]["opt_for_nps"] = $("#opt_for_nps").is(":checked");
      test_json["post_test_step"]["opt_for_ux_crowd"] = $("#opt_for_ux_crowd").is(":checked");
      useTest['use_test']["opt_for_sus"] = $("#opt_for_sus").is(":checked");
      useTest['use_test']["opt_for_nps"] = $("#opt_for_nps").is(":checked");
      useTest['use_test']["opt_for_ux_crowd"] = $("#opt_for_ux_crowd").is(":checked");

      if ($("#opt_for_ux_crowd").is(":checked") && useTest['use_test']['num_testers'] < 10) {
        useTest['use_test']['num_testers'] = 10;
      }

      $("#post_test_step_button").addClass("disabled_button").removeClass(".green_button");
      $("#post_test_step_button").text("Please wait...");
      $("#post_test_step_button").attr("disabled", true);
      const url1 = `${website_url}/use_tests/update_use_test_adobexd`;
      const callUpdateUseTest = xhrRequestPostUpdateUseTest(url1, 'POST', useTest);

    } else {
      e.preventDefault();
    }

  });

  document.appendChild(stepPostTestDialog);


  // For adding sus survey options on select
  $("#sus_survey_id").append($("<option></option>").attr({
    "value": "",
    "data-key": ""
  }).text("Select a questionnaire model").prop("selected", true));
  $.each(sus_surveys, function(key, value) {
    $("#sus_survey_id").append($("<option></option>").attr({
      "value": value[1],
      "data-key": value[2]
    }).text(value[0]));
  });

  
  $("#sus_survey_id").on("change", function() {
    $("#opt_for_nps").prop("disabled", false);
    if ($(this).val() == "") {
      $("#opt_for_sus").prop("checked", false);
    } else {
      $("#opt_for_sus").prop("checked", true);
    }
    if (this.options[this.selectedIndex].getAttribute("data-key") == "supr_q") {
      $("#opt_for_nps").prop("checked", true);
      $("#opt_for_nps").prop("disabled", true);
    }
  });

  $("#opt_for_sus").on("change", function() {
    if (!$(this).is(":checked")) {
      $('#sus_survey_id option:first').attr("selected", "selected");
    }
  });

  $("#opt_for_ux_crowd").on("change", function() {
    $(this).closest("tr").find("p.ux_crowd_error").remove();
    if ($(this).is(":checked") && useTest['use_test']['num_testers'] < 10) {
      $(this).closest("tr").append("<p class='error ux_crowd_error'>Once you opt for this feature number of testers will get set to 10.</p>");
    }else{
      $(this).closest("tr").find("p.ux_crowd_error").remove();
    }
  });


    var survey_questions;
    var use_test_attr;
    if (useTest["type"] == "edit_test") {
      survey_questions = default_questions;
    }else if (!$.isEmptyObject(useTest) && !$.isEmptyObject(useTest['use_test']["questions_attributes"]) && useTest["type"] != "edit_test") {
      survey_questions = useTest['use_test']["questions_attributes"];
      use_test_attr = useTest['use_test'];
    }else if ($.isEmptyObject(useTest['use_test']["questions_attributes"]) && !$.isEmptyObject(use_test)) {
      survey_questions = default_questions;
      use_test_attr = use_test;
    }else{
      survey_questions = default_questions;
    }

      if (!features_allowed_for_plan("sus",customer_plan["kind"])) {
        var allowed_plan = next_feature_allowed_plan("sus")
        $("<div class='flex start-input upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#opt_for_sus").closest("label"));
        $("#opt_for_sus").attr("disabled", true);
        $("#sus_survey_id").addClass("display_none");
      }else{
        if (!features_allowed_for_plan("post_test_additional_survey",customer_plan["kind"])) {
          $("<div class='flex start-input upgrade_plan_div'><i>(For additional options, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#sus_survey_id"));
        }else{
          $("#sus_survey_id").next(".upgrade_plan_div").remove();
        }
        $("#opt_for_sus").closest("label").next(".upgrade_plan_div").remove();
        $("#opt_for_sus").removeAttr("disabled");
        $("#sus_survey_id").removeClass("display_none");
      }

      if (!features_allowed_for_plan("nps",customer_plan["kind"])) {
        var allowed_plan = next_feature_allowed_plan("nps")
        $("<div class='flex start-input upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#opt_for_nps").closest("label"));
        $("#opt_for_nps").attr("disabled", true);
      }else{
        $("#opt_for_nps").closest("label").next(".upgrade_plan_div").remove();
        $("#opt_for_nps").removeAttr("disabled");
      }

      if (!features_allowed_for_plan("uxcrowd",customer_plan["kind"])) {
        var allowed_plan = next_feature_allowed_plan("uxcrowd")
        $("<div class='flex start-input upgrade_plan_div'><i>("+ toTitleCase(allowed_plan) +" level feature, </i><a href='javascript:void(0);' class='upgrade_plan'>upgrade your plan here ></a><i>)</i></div>").insertAfter($("#opt_for_ux_crowd").closest("label").next('span'));
        $("#opt_for_ux_crowd").attr("disabled", true);
      }else{
        $("#opt_for_ux_crowd").closest("label").next('span').next(".upgrade_plan_div").remove();
        $("#opt_for_ux_crowd").removeAttr("disabled");
      }

      
      if ((order_active && useTest["type"] != "edit_test") || !features_allowed_for_plan("uxcrowd",customer_plan["kind"])) {
        $("#opt_for_ux_crowd").attr("disabled", true);
      }else{
        $("#opt_for_ux_crowd").removeAttr("disabled");
      }

  if (!$.isEmptyObject(survey_questions)) {


    // If questions added while editing test are greater than default no we display on dialog
    if (Object.keys(survey_questions).length > $(".questions").length) {
      var add_que_length = (Object.keys(survey_questions).length - $(".questions").length);
      for (var i = 0; i < add_que_length; i++) {
        var clone = $('.questions:last').closest('tr').clone();
        var id = Number($('.questions:last').attr('name').split("question")[1].split("][")[1].split("_")[1]);

        clone.find('textarea').attr("name", "use_test[questions_attributes][" + ("old_" + (id + 1)) + "][question]");
        clone.find('a:first').attr("data-id", "old_" + (id + 1)).text("Remove");
        clone.find('a').prev("span").text("(");
        clone.find('a').next("span").text(")");
        var que_index = Number(clone.find('span:first').text().split(" ")[1].split(":")[0]);
        clone.find('span:first').text("Question "+(que_index + 1)+":")
        clone.find("select").attr("data-id","old_" + (id + 1));
        clone.find("select").attr("name", "use_test[questions_attributes][" + ("old_" + (id + 1)) + "][question_type]");
        clone.find('select').closest('div').find('span').text("Type:");
        $.each(survey_question_types, function(key, value) {
          if (key == 'free_response'){
            clone.find('select').append($("<option selected></option>").attr("value",key).text(value)); 
          }else{
             clone.find('select').append($("<option></option>").attr("value",key).text(value)); 
          }
        });
        clone.find(".slider_rating").remove();
        clone.find(".question_options_div").remove();
        clone.insertAfter($('.questions:last').closest('tr'));
      }
    }
    if (Object.keys(survey_questions).length < $(".questions").length) {
      var que_count = $(".questions").length - Object.keys(survey_questions).length
      for (var i=0; i < que_count; i++) {
        if ($('.questions').length > 1) {
          $('.questions:last').closest('tr').remove();
        }else{
          $('.questions:last').closest('tr').addClass("display_none");
        }
      }
    }

  $.each($(".survey_questions_div"), function() {
    var que_type = $(this).find("select");
    $.each(survey_question_types, function(key, value) {
      if (key == 'free_response'){
        que_type.append($("<option selected></option>").attr("value",key).text(value)); 
      }else{
        que_type.append($("<option></option>").attr("value",key).text(value)); 
      }
    });
  })


    /// For adding already created questions

    var counter = 0;
    $.each(survey_questions, function(key, value) {
      var question = $(".survey_questions_div")[counter];
      $(question).find(".questions").attr("name", "use_test[questions_attributes][" + key + "][question]").text(value["question"]);
      $(question).find("a:first").attr("data-id", key);
      $(question).find("select").attr("data-id",key);
      $(question).find("select").attr("name", "use_test[questions_attributes][" + key + "][question_type]");
      $(question).find("select").find("option").remove();
      $.each(survey_question_types, function(key, value) {
        $(question).find("select").append($("<option></option>").attr("value",key).text(value)); 
      });
      if ($(question).find('select option[value="'+ value["question_type"]+'"]').length == 0) {
        $(question).find("select").append($("<option></option>").attr("value",value["question_type"]).text(default_survey_question_types[value["question_type"]])); 
      }
      $(question).find('select option[value="'+ value["question_type"]+'"]').prop("selected", true); 
      var option_div;
      if ((value["question_type"] == "single_select") || (value["question_type"] == "multi_select")) {
        var div_options = "";
        $.each(value["question_options_attributes"],function(k,v){
          var que_options = `<div class="question_options"><input type="text" name="use_test[questions_attributes][`+ key +`][question_options_attributes][`+ k +`][answer]" data-id="`+ k +`" value="`+ v["answer"]+`" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="`+ k +`">Remove this answer</a></div></div>`
          div_options += que_options;
        })
        var add_option = `<a href="javascript:void(0);" class="add_question_options flex start" data-id="`+key+`"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a>`
        option_div = `<div class="question_options_div">`+div_options + add_option+`</div>`;
        $(option_div).insertAfter($(question).find('select').closest("div"));
      }else if (value["question_type"] == "slider_rating"){
        option_div = `<div class="slider_rating"><div class="flex start value_div"><span>min value:</span><input type="number" class="min_value" name="use_test[questions_attributes][`+ key +`][question_slider_rating_attributes][min_value]" value="`+ value["question_slider_rating_attributes"]["min_value"] +`" min ="0" required"><span>max value:</span><input type="number" class="max_value" name="use_test[questions_attributes][`+ key +`][question_slider_rating_attributes][max_value]" value="`+ value["question_slider_rating_attributes"]["max_value"] +`" max="10" required"></div><div class="flex start label_div"><span>min label:</span><input type="text" class="min_label" name="use_test[questions_attributes][`+ key +`][question_slider_rating_attributes][min_label]" value="`+ value["question_slider_rating_attributes"]["min_label"] +`" required"><span>max label:</span><input type="text" class="max_label" name="use_test[questions_attributes][`+ key +`][question_slider_rating_attributes][max_label]" value="`+ value["question_slider_rating_attributes"]["max_label"] +`" required"></div></div>`
          $(option_div).insertAfter($(question).find('select').closest("div"));
          $("input.min_value").on('focusin', function(){
            $(".min_max_value").remove();
            $(this).data('val', $(this).val());
          }).on('change', function(){
              var minInput = $(this);
              var minVal = parseInt(minInput.val());
              var maxInput = $(this).closest(".slider_rating").find(".max_value");
              var maxVal = parseInt(maxInput.val());
              var prev = $(this).data('val');
              $(".min_max_value").remove();
              if (minVal < 0) {
                $('<span class="min_max_value">Minimum value must be greater than and equal to 0</span>').insertAfter($(this).closest(".slider_rating"));
                minVal.val(1);
              }else if (minVal < 0 || minVal > 9) {
                $('<span class="min_max_value">Minimun value must be greater than and equal to 0 and less than 9 value</span>').insertAfter($(this).closest(".slider_rating"));
                minInput.val(1);
              } else if (minVal >= maxVal) {
                $('<span class="min_max_value">Minimum value must be less than the maximum</span>').insertAfter($(this).closest(".slider_rating"));
                minInput.val(prev);
              }
          });
          $("input.max_value").on('focusin', function(){
              $(".min_max_value").remove();
              $(this).data('val', $(this).val());
          }).on('change', function(){
              var maxInput = $(this);
              var maxVal = parseInt(maxInput.val());
              var minInput = $(this).closest(".slider_rating").find(".min_value");
              var minVal = parseInt(minInput.val());
              var prev = $(this).data('val');
              if (maxVal < 1 || maxVal > 10) {
                $('<span class="min_max_value">Maximum value cannot exceed 10</span>').insertAfter($(this).closest(".slider_rating"));
                maxInput.val(5);
              } else if (maxVal <= minVal) {
                $('<span class="min_max_value">Maximum value must be greater than the minimum</span>').insertAfter($(this).closest(".slider_rating"));
                maxInput.val(prev);
              }
          });
      }

         var addQuestionOptions = $(question).find(".add_question_options");

          for (var i = 0; i < addQuestionOptions.length; i++) {
            addQuestionOptions[i].addEventListener('click', function() {
              if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                $(this).attr("disabled",true);
                $(this).closest("tr").find(".more_options").remove();
                $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
              }else{
                $(this).removeAttr("disabled");
                $(this).closest("tr").find(".more_options").remove();
                var add_question_option = $(this).closest('tr');
                var clone = $(this).closest('tr').find(".question_options:last").clone();
                var que_id = $(this).attr('data-id');
                var option_id = Number(clone.find("a").attr("data-id").split("_")[2]);
                clone.find('input').attr("name", "use_test[questions_attributes][" + que_id + "][question_options_attributes][" + ("new_type_" + (option_id + 1)) + "][answer]").val("");
                clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                clone.insertAfter($(this).closest('tr').find(".question_options:last"));
                
                for (var i = 0; i < removeQuestionOptionButton.length; i++) {
                  removeQuestionOptionButton[i].addEventListener('click', function() {
                    var removeQuestionOptionButton = add_question_option.find(".remove_question_options");
                    if (removeQuestionOptionButton.length > 2) {
                      if (!$.isEmptyObject(survey_questions_json)) {
                        var opt_id = $(this).attr("data-id");
                        var q_id = $(this).closest('tr').find("a:first").attr("data-id");
                        delete survey_questions_json[q_id]["question_options_attributes"][opt_id];
                      }
                      $(this).closest('div.question_options').remove();
                    }
                    if ($(this).closest('tr').find(".question_options").length < survey_opt_counter) {
                      add_question_option.find(".add_question_options").removeAttr("disabled");
                      add_question_option.find(".add_question_options").next(".more_options").remove();
                    }              
                  });
                }
              }

            })
          }

         
          var selectQuestionType = stepPostTestDialog.querySelectorAll(".question_type");
          for (var i = 0; i < selectQuestionType.length; i++) {
            selectQuestionType[i].addEventListener('change', function() {
              // if (this.options[this.selectedIndex].length > 0){
              var id = $(this).attr("data-id");
              if (this.options[this.selectedIndex].getAttribute('value') == "single_select" || this.options[this.selectedIndex].getAttribute('value') == "multi_select") {
                $(this).closest("tr").find(".slider_rating").remove();
                $(this).closest("tr").find(".question_options_div").remove();
                var question_options = `<div class="question_options_div"><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_0][answer]" data-id="old_opt_0" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_0">Remove this answer</a></div></div><div class="question_options"><input type="text" name="use_test[questions_attributes][`+ id +`][question_options_attributes][old_opt_1][answer]" data-id="old_opt_1" required><div class="flex que-center"><a href="javascript:void(0);" class="remove_question_options" data-id="old_type_1">Remove this answer</a></div></div><a href="javascript:void(0);" class="add_question_options flex start" data-id="`+id+`"><img src="add-btn.svg" width="20"></img><span>Add answer</span></a></div>`
                $(question_options).insertAfter($(this).closest("div"));
                 var addQuestionOptions = $(this).closest("tr").find(".add_question_options");

                  for (var i = 0; i < addQuestionOptions.length; i++) {
                    addQuestionOptions[i].addEventListener('click', function() {
                      if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                        $(this).attr("disabled",true);
                        $(this).closest("tr").find(".more_options").remove();
                        $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                      }else{
                        $(this).removeAttr("disabled");
                        $(this).closest("tr").find(".more_options").remove();
                        var add_question_option = $(this).closest('tr');
                        var clone = $(this).closest('tr').find(".question_options:last").clone();
                        var que_id = $(this).attr('data-id');
                        var option_id = Number(clone.find("a").attr("data-id").split("_")[2]);
                        clone.find('input').attr("name", "use_test[questions_attributes][" + que_id + "][question_options_attributes][" + ("new_type_" + (option_id + 1)) + "][answer]").val("");
                        clone.find('a').attr("data-id", "new_type_" + (option_id + 1)).text("Remove this answer");
                        clone.insertAfter($(this).closest('tr').find(".question_options:last"));
                        

                        var removeQuestionOptionButton = add_question_option.find(".remove_question_options");

                        for (var i = 0; i < removeQuestionOptionButton.length; i++) {
                          removeQuestionOptionButton[i].addEventListener('click', function() {
                            var removeQuestionOptionButton = add_question_option.find(".remove_question_options");
                            if (removeQuestionOptionButton.length > 2) {
                              if (!$.isEmptyObject(survey_questions_json)) {
                                var opt_id = $(this).attr("data-id");
                                var q_id = $(this).closest('tr').find("a:first").attr("data-id");
                                delete survey_questions_json[q_id]["question_options_attributes"][opt_id];
                              }
                              $(this).closest('div.question_options').remove();
                            }
                            if ($(this).closest('tr').find(".question_options").length < survey_opt_counter) {
                              add_question_option.find(".add_question_options").removeAttr("disabled");
                              add_question_option.find(".add_question_options").next(".more_options").remove();
                            }              
                          });
                        }
                      }
                      if ($(this).closest('tr').find(".question_options").length > survey_opt_counter) {
                        $(this).attr("disabled",true);
                        $(this).closest("tr").find(".more_options").remove();
                        $('<div class="more_options"><span>(You cannot add more than 5 answers per survey questions.)</span></div>').insertAfter($(this));
                      }
                    })
                  }

              }else if (this.options[this.selectedIndex].getAttribute('value') == "slider_rating") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
                var slider_options = `<div class="slider_rating"><div class="flex start value_div"><span>min value:</span><input type="number" class="min_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_value]" min="0" required"><span>max value:</span><input type="number" class="max_value" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_value]" max="10" required"></div><div class="flex start label_div"><span>min label:</span><input type="text" class="min_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][min_label]" required"><span>max label:</span><input type="text" class="max_label" name="use_test[questions_attributes][`+ id +`][question_slider_rating_attributes][max_label]" required"></div></div>`
                $(slider_options).insertAfter($(this).closest("div"));
                $("input.min_value").on('focusin', function(){
                  $(".min_max_value").remove();
                  $(this).data('val', $(this).val());
                }).on('change', function(){
                    var minInput = $(this);
                    var minVal = parseInt(minInput.val());
                    var maxInput = $(this).closest(".slider_rating").find(".max_value");
                    var maxVal = parseInt(maxInput.val());
                    var prev = $(this).data('val');
                    $(".min_max_value").remove();
                    if (minVal < 0) {
                      $('<span class="min_max_value">Minimum value must be greater than and equal to 0</span>').insertAfter($(this).closest(".slider_rating"));
                      minVal.val(1);
                    }else if (minVal < 0 || minVal > 9) {
                      $('<span class="min_max_value">Minimun value must be greater than and equal to 0 and less than 9 value</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(1);
                    } else if (minVal >= maxVal) {
                      $('<span class="min_max_value">Minimum value must be less than the maximum</span>').insertAfter($(this).closest(".slider_rating"));
                      minInput.val(prev);
                    }
                });
                $("input.max_value").on('focusin', function(){
                    $(".min_max_value").remove();
                    $(this).data('val', $(this).val());
                }).on('change', function(){
                    var maxInput = $(this);
                    var maxVal = parseInt(maxInput.val());
                    var minInput = $(this).closest(".slider_rating").find(".min_value");
                    var minVal = parseInt(minInput.val());
                    var prev = $(this).data('val');
                    if (maxVal < 1 || maxVal > 10) {
                      $('<span class="min_max_value">Maximum value cannot exceed 10</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(5);
                    } else if (maxVal <= minVal) {
                      $('<span class="min_max_value">Maximum value must be greater than the minimum</span>').insertAfter($(this).closest(".slider_rating"));
                      maxInput.val(prev);
                    }
                });
              }else if (this.options[this.selectedIndex].getAttribute('value') == "free_response") {
                $(this).closest("tr").find(".question_options_div").remove();
                $(this).closest("tr").find(".slider_rating").remove();
              }
            })
          }

          var removeQuestionOptionButton = $(question).find(".remove_question_options");

          for (var i = 0; i < removeQuestionOptionButton.length; i++) {
            removeQuestionOptionButton[i].addEventListener('click', function() {
              var removeQuestionOptionButton = $(question).find(".remove_question_options");
              if (removeQuestionOptionButton.length > 2) {
                if (!$.isEmptyObject(survey_questions_json)) {
                  var opt_id = $(this).attr("data-id");
                  var q_id = $(this).closest('tr').find("a:first").attr("data-id");
                  delete survey_questions_json[q_id]["question_options_attributes"][opt_id];
                }
                $(this).closest('div.question_options').remove();
              }
              if ($(this).closest('tr').find(".question_options").length < survey_opt_counter) {
                $(question).find(".add_question_options").removeAttr("disabled");
                $(question).find(".add_question_options").next(".more_options").remove();

              }                
            });
          }
      counter++;
    })

    var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");

    for (var i = 0; i < removeQuestionsButton.length; i++) {
      removeQuestionsButton[i].addEventListener('click', function() {
        var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");
        if (!$.isEmptyObject(survey_questions_json)) {
          var q_id = $(this).attr("data-id");
          delete survey_questions_json[q_id];
        }
        if (removeQuestionsButton.length == 1) {
          $(this).closest('tr').addClass("display_none"); 
        }else{
          $(this).closest('tr').remove();
          $(".survey_questions_div").each(function(index) {
            $(this).find("span:first").text("Question "+(index+1)+":");
          })
        }

        if ($(".questions").length < allowed_question_limit_planwise[customer_plan["kind"]]) {
          $("#add_questions").next(".upgrade_plan_div_question").remove();
          $("#add_questions").removeClass("display_none");
          $("#add_questions").removeAttr("disabled");
        }
      });
    }   
  }

  $(".upgrade_plan").on("click", function(){
    var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
    var upgrade_url = `${website_url}/plan/upgrade?${user_params}`
    require("uxp").shell.openExternal(`${upgrade_url}`);
  })

  var removeQuestionsButton = stepPostTestDialog.querySelectorAll(".remove_questions");

  if (!$.isEmptyObject(use_test_attr)) {
    $('input[name="use_test[opt_for_sus]"]').prop("checked", use_test_attr['opt_for_sus']);
    $('input[name="use_test[opt_for_nps]"]').prop("checked", use_test_attr['opt_for_nps']);
    $('input[name="use_test[opt_for_ux_crowd]"]').prop("checked", use_test_attr['opt_for_ux_crowd']);
    if ($('#sus_survey_id option[value="' + use_test_attr["sus_survey_id"] + '"]').length == 0) {
      $.each(default_sus_surveys, function(key, value) {
        if (Number(use_test_attr["sus_survey_id"]) == Number(value[1])) {
          $("#sus_survey_id").append($("<option></option>").attr({
            "value": value[1],
            "data-key": value[2]
          }).text(value[0]));
        }
      });
    }
    $('#sus_survey_id option[value="' + use_test_attr["sus_survey_id"] + '"]').prop("selected", true);
  }

}

//// Use Test And Customer Successful Creation Dialog Start ////

let placeOrderDialog;

const createPlaceOrderHtml =
  `<style>
    .place_order_dialog {
      height: auto;
      width: 500px;
    }
    .place_order_step {
      height: auto;
      width: 500px;
      overflow-y: scroll;
      margin: 10px 20px;
    }

    .place_order_dialog .display_none {
      display: none !important;
    }

    .place_order_dialog .display_block {
      display: block !important;
    }

    .place_order_dialog input[type="number"]{
      width: 50%;
      margin-left: 0px !important;
    }
    .place_order_dialog button {
      width: 30%;
    }

    .place_order_dialog .head-center {
      text-align: center !important;
      margin-left:50px !important;
      margin-right: 50px !important;
    }

    .place_order_dialog .green_button {
      width: 165px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 21px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: #88C149 !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }

    .place_order_dialog .disabled_button {
      width: 165px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: grey !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }

    .place_order_dialog .grey_button {
      border: 1px solid #444444;
      border-radius: 6px;
      width: 165px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #000000 !important;
      background: #ffffff !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }

    .place_order_dialog h2 {
      font-size: 18px !important;
      color: #000000 !important;
     }
     .place_order_dialog td,.place_order_dialog label,.place_order_dialog span {
      font-size: 14px !important;
      color: #000000 !important;
      font-weight: normal !important;
     }
     .place_order_dialog .flex {
        display: flex;
        flex-direction: row;
        align-items: baseline;
      }
      .place_order_dialog .center {
        justify-content: center;
      }
      .place_order_dialog .start {
        justify-content: flex-start;
      }
      .place_order_dialog .mt-20 {
        margin-top: 20px !important;
      }
      .place_order_dialog .mlr-50 {
        margin-left: 50px !important;
        margin-right: 50px !important;
      }
      .place_order_dialog #go_to_site,.place_order_dialog #not_enough_credits_div{
        font-style: italic !important;
        font-size: 14px !important;
      }
      .place_order_dialog .confirm_testers {
        font-weight: bold !important;
      }
      .place_order_dialog #not_enough_credits_div span{
        font-weight: bold !important;
      }
      .place_order_dialog .testers_div {
        margin-left: 25px !important;
      }
      #not_enough_credits_div span {
        margin-right: 5px !important; 
      }
      .place_order_dialog #go_to_site_div i {
        margin-right: 5px !important;
      }
      .place_order_dialog a {
        text-decoration: underline !important;
      }
    </style>
    <div class="white-background">
    <form method="dialog" class="place_order_dialog">
      <div class="mlr-50">
      <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
      </div>
      <div class="place_order_step">
      <div class="mt-20">
        <span id="success_msg">Thank you for registering with TryMyUI.</span>
      </div>
      <div class="mt-20 display_block" id="go_to_site_div">
        <div class="flex start">
          <i>View your test on TryMyUI.com for more options:</i><a href="javascript:void(0);" id="go_to_site"> Go to site></a>
        </div>
      </div>
      <div class="mt-20 testers_div">
        <span class="confirm_testers">Confirm number of testers:</span>
        <input name="num_testers" id="num_testers" type="number" max="50">
      </div>
      <div class="mt-20 testers_div">
        <span>Number of credits you have*:</span> 
        <input name="balance_credits" id="balance_credits" type="number" disabled>
        <span>*1 credit is used to order 1 tester</span>
      </div>
      <div class="mt-20 display_none" id="not_enough_credits_div">
        <div class="flex start">
          <span>Not enough credits: </span><i>to launch this test, please finish on the TryMyUI website</i>
        </div>
      </div>
      </div>
      <footer class="mt-20 flex center">
      <a href="javascript:void(0);" id="go_to_dashboard_dialog" class="grey_button">Exit to home</a>
      <a href="javascript:void(0);" id="place_order" class="display_block green_button">Launch test now</a>
      <a href="javascript:void(0);" id="checkout_order" class="display_none green_button">Launch from site</a>
      </footer>
    </form></div>`;


function createPlaceOrderDialog(user, msg, use_test, source) {
  placeOrderDialog = document.createElement("dialog");
  placeOrderDialog.innerHTML = createPlaceOrderHtml;
  const orderCheckoutButton = placeOrderDialog.querySelector("#checkout_order");
  const placeOrderDialogButton = placeOrderDialog.querySelector("#place_order");
  const goToDashboardDialogButton = placeOrderDialog.querySelector("#go_to_dashboard_dialog");
  const numTesterInput = placeOrderDialog.querySelector("#num_testers");
  const goToSite = placeOrderDialog.querySelector("#go_to_site");

  var user_params = `token=${auth_token}&id=${customer_id}&source=adobexd`
  var num_ordered = Number(use_test["num_testers"]);

  const login_url = `${website_url}/login?${user_params}`;
  var credits;
  if (credit_type_value == "trymyui") {
    credits = tmy_credits;
  }else if (credit_type_value == "private") {
    credits = private_credits;
  }
  numTesterInput.addEventListener("change", function() {
    if (Number($(this).val()) > Number(credits)) {
      $("#checkout_order").addClass("display_block").removeClass("display_none");
      $("#place_order").addClass("display_none").removeClass("display_block");
      $("#go_to_site_div").addClass("display_none").removeClass("display_block");
      $("#not_enough_credits_div").addClass("display_block").removeClass("display_none");
    }else{
      $("#place_order").addClass("display_block").removeClass("display_none");
      $("#checkout_order").addClass("display_none").removeClass("display_block");
      $("#go_to_site_div").addClass("display_block").removeClass("display_none");
      $("#not_enough_credits_div").addClass("display_none").removeClass("display_block");
    }
    num_ordered = Number($(this).val());
  })

  orderCheckoutButton.addEventListener("click", e => {
    const checkout_url = `${website_url}/use_tests/${use_test["id"]}/checkout?purchase_context=add_testers`;
    const url = `${checkout_url}&${user_params}&num_ordered=${num_ordered}`;

    require("uxp").shell.openExternal(`${url}`);
    placeOrderDialog.close("reasonCanceled");
  });

  placeOrderDialogButton.addEventListener("click", e => {
    const url1 = `${website_url}/purchase/order_adobexd`;
    $("#place_order").addClass("disabled_button").removeClass("green_button");
    $("#place_order").text("Please wait...");
    const callPlaceOrder = xhrRequestPlaceOrder(url1, 'POST', user["id"],use_test["id"], num_ordered);
  });

  goToDashboardDialogButton.addEventListener("click", e => {
    $("#go_to_dashboard_dialog").addClass("disabled_button").removeClass("grey_button");
    $("#go_to_dashboard_dialog").text("Please wait...");
    e.preventDefault();
  	var use_test_id = [use_test["id"]];
    var password = user["password"];
    var email = user["email"];
    var remember_user = false;
    const url = `${website_url}/login_adobexd?user[plain_password]=${user["password"]}&user[email]=${user["email"]}&user[remember_user]=${user["remember_user"]}`;
    const callPost = xhrRequest(url, 'POST', password, email, remember_user);
  })

  goToSite.addEventListener("click", e => {
    const site_url = `${website_url}/use_tests?${user_params}` 
    require("uxp").shell.openExternal(`${site_url}`);
  })

  document.appendChild(placeOrderDialog);
 	$("#success_msg").text(msg);
  if (Number(use_test["num_testers"]) > Number(credits)) {
    $("#checkout_order").addClass("display_block").removeClass("display_none");
    $("#place_order").addClass("display_none").removeClass("display_block");
    $("#go_to_site_div").addClass("display_none").removeClass("display_block");
    $("#not_enough_credits_div").addClass("display_block").removeClass("display_none");
  }else{
    $("#place_order").addClass("display_block").removeClass("display_none");
    $("#checkout_order").addClass("display_none").removeClass("display_block");
    $(".go_to_site_div").addClass("display_block").removeClass("display_none");
    $(".not_enough_credits_div").addClass("display_none").removeClass("display_block");
  }
  $("input[name='num_testers']").val(Number(use_test["num_testers"]));
  $("#balance_credits").val(credits);
}

//// After Use Test Create Customer Account Dialog end ////



//// Use Test And Customer Successful Creation Dialog Start ////

let successDialog;

const createSuccessHtml =
  `<style>
    .success_dialog {
      height: auto;
      width: 450px;
      margin: 20px 50px !important;
    }

    .success_step {
      height: auto;
      width: 450px;
      overflow-y: scroll;
    }

    .success_dialog .display_none {
      display: none;
    }

    .success_dialog .display_block {
      display: block;
    }

    .success_dialog button {
      width: 30%;
    }

    .success_dialog .head-center {
      text-align: center !important;
      margin-left:50px !important;
      margin-right: 50px !important;
    }
      .success_dialog .green_button {
        width: 165px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .success_dialog .disabled_button {
        width: 165px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: grey !important;
        padding: 4px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
      }

      .success_dialog h2 {
        font-size: 18px !important;
        color: #000000 !important;
       }
       .success_dialog td,.success_dialog label,.success_dialog span {
        font-size: 14px !important;
        color: #000000 !important;
        font-weight: normal !important;
       }
       .success_dialog .flex {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
        .success_dialog .center {
          justify-content: center;
        }
        .success_dialog .start {
          justify-content: flex-start;
        }
        .success_dialog .mt-20 {
          margin-top: 20px !important;
        }
        .success_dialog .mlr-50 {
          margin-left: 50px !important;
          margin-right: 50px !important;
        }
 
        .success_dialog .testers_div strong{
          font-weight: bold !important;
        }
        .success_dialog .testers_div {
          margin-left: 25px !important;
        }
        .success_dialog a {
        text-decoration: underline !important;
      }

    </style>
    <div class="white-background">
    <form method="dialog" class="success_dialog">
     <div class="mlr-50">
      <header class="head-center">
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <hr>
      </div>
      <div classs="success_step">
      <div class="mt-20">
        <span id="order_msg">Order placed</span>
      </div>
      <div class="flex start testers_div mt-20">
        <strong>Test: </strong><span id="test_title"></span>
      </div>
      <div class="flex start testers_div mt-20">
        <strong>Device: </strong><span id="device"></span>
      </div>
      <div class="flex start testers_div mt-20">
        <strong>Testers: </strong><span id="testers"></span>
      </div>
      <div class="mt-20">
        <span>We will notify you by email when your test results are ready to view.</span>
      </div>
      </div>
      <footer class="mt-20 flex center">
      <a href="javascript:void(0);" id="go_to_dashboard" class="green_button">Return to home</a>
      </footer>
    </form></div>`;

function createSuccessDialog(user, use_test, msg, device_type) {
  successDialog = document.createElement("dialog");
  successDialog.innerHTML = createSuccessHtml;

  const goToDashboardButton = successDialog.querySelector("#go_to_dashboard");

  goToDashboardButton.addEventListener("click", e => {
    $("#go_to_dashboard").addClass("disabled_button").removeClass("green_button");
    $("#go_to_dashboard").text("Please wait...");
    e.preventDefault();
  	var use_test_id = [use_test["id"]];
    var password = user["password"];
    var email = user["email"];
    var remember_user = false;
    const url = `${website_url}/login_adobexd?user[plain_password]=${user["password"]}&user[email]=${user["email"]}&user[remember_user]=${user["remember_user"]}`;
    const callPost = xhrRequest(url, 'POST', password, email, remember_user);

  })

  document.appendChild(successDialog);
    $("#order_msg").text(msg);
    $("#test_title").text(" "+use_test["title"]);
    $("#device").text(" "+ device_type);
    $("#testers").text(" "+use_test["num_testers"]);
  }


//// Error Login Dialog Start ////

let errorDialog;

const createErrorHtml =
  `<style>
    .error_dialog {
      height: auto;
      width: 300px;
      margin:40px;
      overflow-y: scroll;
     text-align: center;
    }
    .error_dialog header {
      align-items: center;
      text-align: center;
      margin-bottom: 10px !important;
     }
    .error_dialog .flex {
      display: flex;
      flex-direction: row;
    }
    .error_dialog .center {
      justify-content: center;
    }
    .error_dialog #next_login {
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 21px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #FFFFFF !important;
      background: #88C149 !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }

    .error_dialog #error_close {
      border: 1px solid #444444;
      border-radius: 6px;
      width: 120px;
      height: 33px !important;
      border-radius: 4px !important;
      font-style: normal;
      font-size: 14px !important;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.5px;
      color: #000000 !important;
      background: #ffffff !important;
      padding: 4px 20px;
      text-decoration: none !important;
      margin-left:8px;
      margin-right:8px;
    }
    .error_dialog a {
        text-decoration: underline !important;
      }
      .error_dialog p {
        margin-top: 10px !important;
      }
</style>
    <div class="white-background">
    <form method="dialog" class="error_dialog">
    <header>
      <img src="trymyui_logo.png" alt="TryMyUi" width="150">
    </header>
    <hr>
      <p>Something went wrong. Please contact at support@trymyui.com</p>
      <footer class="flex center">
        <a href="javascript:void(0);" id="error_close">Close</a>
        <a href="javascript:void(0);" id="next_login" >Back</a>
      </footer>
    </form></div>`;


function createDialogError(message) {
  errorDialog = document.createElement("dialog");
  errorDialog.innerHTML = createErrorHtml;

  const errorCloseButton = errorDialog.querySelector("#error_close");

  errorCloseButton.onclick = () => errorDialog.close("reasonCanceled");

  const loginButton = errorDialog.querySelector("#next_login");

  loginButton.addEventListener("click", e => {
    errorDialog.close("reasonCanceled");
    createDialogLogin();
    loginDialog.showModal();
  });

  document.appendChild(errorDialog);
  $('p').text(message);
}

//// Error Login Dialog End ////


//// Customer Use Tests Edit/New Dialog Start ////

let testDialog;

const createTestHtml =
  `<style>
      .logout {
        text-align: right !important;
      }
      .logout a {
        font-size: 14px !important;
        color: #56abcc !important;
      }
    .test-dialog {
      height: auto;
      width: 400;
      text-align: center !important;
      margin: 10px 50px !important;
    }

      .test-dialog select {  
      	width: 50% !important;
        justify-content: center !important;
        text-align: center !important;
        margin-left: 0px !important;
        height: auto;
      }

      .test-dialog button {
        width: 30% !important;
      }

      .test-dialog .logout {
        text-align: right;
      }
      .test-dialog #use_test_id {
       justify-content: center !important;
       text-align: center !important;
       width: 50% !important;
       max-height: 50px;
        overflow: auto;
      }
      .test-dialog .row {
        justify-content: center !important;
      }
	    .test-dialog #edit_test_button {
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #428aca !important;
        padding: 5px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
        margin-top: 5px;
	    }

      .test-dialog #create_test {
        width: 120px;
        height: 33px !important;
        border-radius: 4px !important;
        font-style: normal;
        font-size: 14px !important;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5px;
        color: #FFFFFF !important;
        background: #88C149 !important;
        padding: 5px 20px;
        text-decoration: none !important;
        margin-left:8px;
        margin-right:8px;
        margin-top: 10px;
        margin-bottom:20px;
      }

	     .test-dialog header {
	     	align-items: center;
	     	text-align: center;
	     }
       .test-dialog .error {
        color: red !important;
        margin-top: -5px !important;
        margin-bottom: 10px !important;
       }
	     .test-dialog h2 {
	     	font-size: 18px !important;
	     	color: #000000 !important;
	     	padding-top: 20px !important;
	     }
	     .test-dialog span {
	     	font-size: 14px !important;
	     	color: #000000 !important;
	     	font-weight: normal !important;
	     }
	     .test-dialog hr {
	     	display: block !important;
	     }
       .test-dialog .create_test_div {
        margin-top: 30px !important;
       }
       .test-dialog a {
        text-decoration: underline !important;
      }
      .test-dialog a, .test-dialog a span {
        font-size: 12px !important;
        color: #56abcc !important;
      }
      .edit_test_div {
        margin-top: 10px;
      }
    </style>
    <div class="overlay-background">
    <div class="logout">
      <a href="javascript:void(0);" id="logout"><strong>Logout</strong></a>
    </div>
    <form method="dialog" class="test-dialog"  id="edit_test">
        <header>
        <img src="trymyui_logo.png" alt="TryMyUi" width="150">
      </header>
      <div class="row">
          <h2>My tests</h2>
        </div>
      <hr>
        <div class="edit_test_div">
         <span>Edit test:</span>
         <div class="row">
          <select name="use_test_id" id="use_test_id">
          <option value="" selected>Please select a test/draft</option>
          </select>
          </div>
          <div class="row">
          <a href="javascript:void(0);" id="edit_test_button">Edit test</a>
          </div>
          <div class="row create_test_div">
            <span>Or, create a new test:</span>
            </div>
            <div class="row">
          <a href="javascript:void(0);" id="create_test" type="submit">Create test</a>
          </div>
        </div>
    </form></div>`;


function createDialogUseTest(user,use_test_ids) {
  testDialog = document.createElement("dialog");
  testDialog.innerHTML = createTestHtml;

  const createTestButton = testDialog.querySelector("#create_test");

  const editTestButton = testDialog.querySelector("#edit_test_button");
  const logoutButton = testDialog.querySelector("#logout");

  logoutButton.addEventListener("click", e => {
    testDialog.close("reasonCanceled");
    deleteFile().then(function() {
    if (entryDialog) {
      entryDialog.close("reasonCanceled");
      entryDialog.remove();
    }
    createDialogEntry();
    entryDialog.showModal();
    });
  });

  createTestButton.addEventListener("click", e => {
    testDialog.close("reasonCanceled");
    const url = `${website_url}/use_tests/create_use_test_adobexd`;
    testDialog.close("reasonCanceled");
    testDialog.remove();
    const callGet = xhrRequestGetCreateTest(url, 'GET',user, "edit_test");

  });


  editTestButton.addEventListener("click", e => {
    var use_test_id;
    $("#use_test_id").each(function() {
      use_test_id = this.options[this.selectedIndex].getAttribute('value');
    })
    if (use_test_id == "") {
      e.preventDefault();
      $("#use_test_id").css("border", "1px solid red");
      $("<div class='row error'><span class='error' style='color: red !important;'>Please select a test</span></div>").insertAfter($("#use_test_id").closest("div"));
    }else {
      const url = `${website_url}/use_tests/edit_use_test_adobexd`;
      testDialog.close("reasonCanceled");
      testDialog.remove();
      const callGet = xhrRequestEditTest(url, 'GET', use_test_id);
    }
    
  });

  document.appendChild(testDialog);
  $.each(use_test_ids, function(key, value) {
    $("#use_test_id").append($("<option></option>").attr("value", value[1]).text(value[0])); 
  });
  $("#use_test_id").on("change",function() {
    $(this).css("border", "none");
    $(this).closest("div").next(".row.error").remove();
  })
}

//// Customer Use Tests Edit/New Dialog Start ////


//// Customer Login Dialog Start ////

let loginDialog;

const loginHtml =
  `<style>
        .dialog {
            height: auto;
            width: 300px;
            margin: 20px 100px !important;
        }
        .dialog header {
          margin-bottom: 20px !important;
        }
        .dialog #password, .dialog #email_address {
          width: 100%;
          background-color: white !important;
        }      
        .dialog .center {
        	display: flex;
        	flex-direction: row;
        	justify-content: center;
        }

        .dialog .end-flex {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          margin-left: 10% !important;
        }

        .dialog hr {
        	margin-bottom: 20px !important;
        }
        .dialog .green_button {
          width: 120px;
          height: 33px !important;
          border-radius: 4px !important;
          font-style: normal;
          font-size: 14px !important;
          line-height: 20px;
          text-align: center;
          letter-spacing: 0.5px;
          color: #FFFFFF !important;
          background: #88C149 !important;
          padding: 5px 20px 3px 20px;
          text-decoration: none;
          margin-left:8px;
          margin-right:8px;
        }

        .dialog .disabled_button {
          width: 150px;
          height: 33px !important;
          border-radius: 4px !important;
          font-style: normal;
          font-size: 14px !important;
          line-height: 20px;
          text-align: center;
          letter-spacing: 0.5px;
          color: #FFFFFF !important;
          background: grey !important;
          padding: 5px 20px 3px 20px;
          text-decoration: none;
          margin-left:8px;
          margin-right:8px;
        }

        .dialog #cancel {
          border: 1px solid #444444;
          border-radius: 6px;
          width: 120px;
          height: 33px !important;
          border-radius: 4px !important;
          font-style: normal;
          font-size: 14px !important;
          line-height: 20px;
          text-align: center;
          letter-spacing: 0.5px;
          color: #000000 !important;
          background: #ffffff !important;
          padding: 4px 20px 3px 20px;
          text-decoration: none;
          margin-left:8px;
          margin-right:8px;
        }
        .dialog .flex {
          display: flex;
          flex-direction: row;
        }
        .dialog .center {
          justify-content: center;
        }

		   .dialog  h2 {
	     	font-size: 18px !important;
	     	color: #000000 !important;
	     	padding-top: 20px !important;
	     }
	     .dialog span {
	     	font-size: 14px !important;
	     	color: #000000 !important;
	     	font-weight: normal !important;
	     }
       .dialog .error {
        color: red !important;
       }
       .dialog .mb10 {
        margin-bottom: 10px !important;
       }
       .dialog .remember_user {
          margin-top: 0px !important;
       }
       .dialog .remember_user span{
        font-size: 12px !important;
       }
       .dialog .remember_user input[type="checkbox"]{
          margin-left: 0px !important;
        }
        .dialog .mb0 {
          margin-bottom: 0px !important;
        }
    </style>
    <div class="white-background">
    <form method="dialog" class="dialog" id="login_dialog">
      <header>
       	<img src="trymyui_logo.png" alt="TryMyUi" width="150" style="margin-bottom:20px !important;">
      </header>
      <div class="row center">
      	<h2>Sign in to your TryMyUI account</h2>
      </div>
      <hr>

       <div class="mb10">
       <span>Email:</span>
        <label>
	        <input type="text" name="email_address" id="email_address" required/>
        </label>
        </div>
        <div class="mb0">
        <span>Password:</span>
        <label>
	        <input type="password" name="password" id="password" required/>
        </label>
        </div>
        <div class="mb10">
        <label for="remember_user_chkbox" class="row flex end-flex remember_user">
          <span>Remember me</span>
          <input type="checkbox" name="remember_user" id="remember_user"">
        </label>
        </div>
        <footer class="flex center">
            <a href="javascript:void(0);" id="cancel">Back</a>
		
          	<a href="javascript:void(0);" id="sign_in" class="green_button">Sign in</a>
        </footer>
    </form>
    </div>`;

function createDialogLogin() {
  loginDialog = document.createElement("dialog");
  loginDialog.innerHTML = loginHtml;

  const cancelButton = loginDialog.querySelector("#cancel");

  const okButton = loginDialog.querySelector("#sign_in");

  cancelButton.addEventListener("click", e => {
    loginDialog.close("reasonCanceled");
    if (entryDialog) {
      entryDialog.close("reasonCanceled");
      entryDialog.remove();
    }
    createDialogEntry();
    entryDialog.showModal();
  })

  okButton.addEventListener("click", e => {

    $('form#login_dialog input').each(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
      var getInputVal = $(this).val();
      isEmpty(getInputVal, $(this));
      if (!validate) {
        return false;
      }
    });


    $('form#login_dialog input').focus(function() {
      $(this).css("border", "none");
      $(this).next("span").remove();
    });

    var email = $("#email_address").val();
    var regex_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex_email.test(email)) {
      $("#email_address").css("border", "none");
      $("#email_address").next("span").remove();
      validate = false;
      $("#email_address").after("<span class='error'>Invalid Email</span>");
      $("#email_address").css("border", "1px solid red");
    } else {
      validate = true;
      $("#email_address").css("border", "none");
      $("#email_address").next("span").remove();
    }

    if (validate) {
      var password = loginDialog.querySelector('#password').value;
      var email = loginDialog.querySelector('#email_address').value;
      var remember_user = $('#remember_user').is(":checked");

      const url = `${website_url}/login_adobexd?user[plain_password]=${password}&user[email]=${email}&user[remember_user]=${remember_user}`;
      $("#sign_in").addClass("disabled_button").removeClass(".green_button");
      $("#sign_in").text("Please wait...")
      $("#sign_in").attr("disabled", true);
      const callPost = xhrRequest(url, 'POST', password, email, remember_user);
    }else {
      e.preventDefault();
    }

    
  });

  document.appendChild(loginDialog);
}

//// Customer Login Dialog Start ////



let progressLoaderDialog;

const progressLoaderHtml =
  `<style>
        .progress_dialog {
            height: auto;
            width: 300px;
        }
    </style>
    <div class="progress_dialog">
      <p>Your Request is in progress for trymyui.</p>
    </div>`;

function createProgressDialog() {
  progressLoaderDialog = document.createElement("dialog");
  progressLoaderDialog.innerHTML = progressLoaderHtml;

  document.appendChild(progressLoaderDialog);
}



/// Function for use test edit/new dialog start/////

function xhrRequest(url, method, password, email, remember_user) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (loginDialog){
        loginDialog.close("reasonCanceled");
        loginDialog.remove();
      }
      if (successDialog) {
        successDialog.close("reasonCanceled"); 
        successDialog.remove();
      }
      if (placeOrderDialog) {
        placeOrderDialog.close("reasonCanceled");
        placeOrderDialog.remove();
      }
      if (newTestDialog) {
        newTestDialog.close("reasonCanceled");
        newTestDialog.remove();
      }
      if (req.response.success) {
        use_test_ids = req.response.use_tests; // for adding customer use tests in dropdown
        //set tmy/pvt test credit balance on login to be used further
        tmy_credits = req.response.tmy_credits
        private_credits = req.response.private_credits
        if (Boolean(remember_user)) {
          writeFile(req.response.auth_token);
        }
        
        // if (!testDialog) {
        	if (testDialog){
        		testDialog.close("reasonCanceled");
        		testDialog.remove();
        	}
          createDialogUseTest(req.response.user, req.response.use_tests);
          return testDialog.showModal();
        // }
      } else {
        if (errorDialog){
          errorDialog.close("reasonCanceled");
          errorDialog.remove();
        }
        createDialogError(req.response.errors);
        return errorDialog.showModal();
      }
    }
    req.onerror = (err) => {
      if (loginDialog){
        loginDialog.close("reasonCanceled");
        loginDialog.remove();
      }
      if (successDialog) {
        successDialog.close("reasonCanceled"); 
        successDialog.remove();
      }
      if (placeOrderDialog) {
        placeOrderDialog.close("reasonCanceled");
        placeOrderDialog.remove();
      }
      if (errorDialog){
        errorDialog.close("reasonCanceled");
        errorDialog.remove();
      }
      createDialogError("Invalid email or password.");
      return errorDialog.showModal();
    }
    req.open(method, url, true);
    req.responseType = 'json';
    req.send(`password=${password}&email=${email}&remember_user=${remember_user}`);
  });
}

/// Function for use test edit/new dialog end/////

/// Function for use test basic step dialog end///

function xhrRequestGetCreateTest(url, method, user, type) {
    var email = $.isEmptyObject(user) ? "" : user["email"]
      $.ajax({
      url: url,
      type: method,
      data: {email: email, type:type},
      dataType: 'json',
      success: function(response) {
      if (response.success) {
        default_questions = response.questions; //for adding default questions on setup step
        demographics = response.demographics; // for adding options on select tag for each demographics 
        video_recording_times = response.video_recording_times; // for adding options for video recording times 
        sus_surveys = response.sus_surveys;
        default_sus_surveys =  response.default_sus_surveys;
        survey_question_types = response.survey_question_types;
        default_survey_question_types = response.default_survey_question_types;
        default_recording_time = response.default_recording_time;
        customer_plan = response.plan;
        if (!$.isEmptyObject(user)) {
          useTest['user'] = user;
        }
        useTest['use_test'] = {};
        test_json = {};
        test_screener_questions_json = {};
        ut_tasks_json = {};
        ut_tasks = {};
        if (type == "edit_test") {
          if (newTestDialog) {
            newTestDialog.close("reasonCanceled");
            newTestDialog.remove();
          }
          createNewUseTestDialog("",user,type);
          return newTestDialog.showModal();
        }else {
          if (registrationDialog) {
            registrationDialog.close("reasonCanceled");
            registrationDialog.remove();
          }
          createRegistrationDialog();
          return registrationDialog.showModal();
        }
          
        
      } else {
        if (errorDialog){
          errorDialog.close("reasonCanceled");
          errorDialog.remove();
        }
        createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
        return errorDialog.showModal();
      }
    },
    error: function(request, error) {
      if (errorDialog){
        errorDialog.close("reasonCanceled");
        errorDialog.remove();
      }
      createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
      return errorDialog.showModal();
    }
  });
}

/// Function for use test basic step dialog end///

/// Function for use test and customer creation start///

function xhrRequestPostUpdateUseTest(url, method, newstr) {
  $.ajax({
    url: url,
    type: method,
    data: newstr,
    dataType: 'json',
    success: function(response) {
      if (stepPostTestDialog) {
        stepPostTestDialog.close("reasonCanceled");
        stepPostTestDialog.remove();
      }
      if (response.success) {
        auth_token = response.auth_token;
        customer_id = response.customer_id;
        tmy_credits = response.tmy_credits;
        private_credits = response.private_credits;
        credit_type_value = response.credit_type_value;    
        if (placeOrderDialog) {
          placeOrderDialog.close("reasonCanceled");
          placeOrderDialog.remove();
        }
        createPlaceOrderDialog(response.user, response.message, response.use_test);
        return placeOrderDialog.showModal();
      } else {
        if (errorDialog){
          errorDialog.close("reasonCanceled");
          errorDialog.remove();
        }
        createDialogError(response.errors);
        return errorDialog.showModal();
      }
    },
    error: function(request, error) {
      if (stepPostTestDialog) {
        stepPostTestDialog.close("reasonCanceled");
        stepPostTestDialog.remove();
      }
      if (errorDialog){
        errorDialog.close("reasonCanceled");
        errorDialog.remove();
      }
      createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
      return errorDialog.showModal();
    }
  });
}

/// Function for placing order for the use test///

function xhrRequestPlaceOrder(url, method, user_id,use_test_id,num_ordered) {
  $.ajax({
    url: url,
    type: method,
    data: {user_id: user_id, use_test_id: use_test_id, num_ordered: num_ordered, token: auth_token, source: "adobexd"},
    dataType: 'json',
    success: function(response) {
      placeOrderDialog.close("reasonCanceled");
      placeOrderDialog.remove();
      if (response.success) {
        if (successDialog) {
          successDialog.close("reasonCanceled");
          successDialog.remove();
        }
        createSuccessDialog(response.user, response.use_test, response.message, response.device_type);
        return successDialog.showModal();
        
      } else {
        if (errorDialog){
          errorDialog.close("reasonCanceled");
          errorDialog.remove();
        }
        createDialogError(response.error);
        return errorDialog.showModal();
      }
    },
    error: function(request, error) {
      placeOrderDialog.close("reasonCanceled");
      placeOrderDialog.remove();
      if (errorDialog){
        errorDialog.close("reasonCanceled");
        errorDialog.remove();
      }
      createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
      return errorDialog.showModal();
    }
  });
}

/// Function for use test edit start///

function xhrRequestEditTest(url, method, use_test) {
  $.ajax({
    url: url,
    type: method,
    data: {
      use_test_id: use_test
    },
    dataType: 'json',
    success: function(response) {
      // if (response.success) {
      useTest["use_test"] = {};
      delete useTest.type;
      default_questions = response.questions; // for retaining the questions of selected use test for editing
      ut_tasks = response.tasks; // for retaining the tasks of selected use test for editing
      default_demographics_field = response.default_demographics; // for array fo default demographics keys
      demographics = response.demographics; // for adding options on select tag for each demographics 
      video_recording_times = response.video_recording_times; // for adding options for video recording times 
      customer_attr = response.user;
      // useTest['use_test'] = response.use_test;
      useTest['user'] = response.user;
      sus_surveys = response.sus_surveys;
      default_sus_surveys =  response.default_sus_surveys;
      survey_question_types = response.survey_question_types;
      default_survey_question_types = response.default_survey_question_types;
      test_screener_questions = jQuery.parseJSON(response.screener_questions);
      auth_token = response.auth_token;
      customer_plan = response.plan;
      default_recording_time = response.default_recording_time;
      order_active = response.order_active;
      customer_id = response.customer_id;
      // if (!newTestDialog) {
      	if (newTestDialog) {
      		newTestDialog.close("reasonCanceled");
      		newTestDialog.remove()
      	}
        createNewUseTestDialog(response.use_test, response.customer,"");
        return newTestDialog.showModal();
      // }

    },
    error: function(request, error) {
      if (errorDialog){
        errorDialog.close("reasonCanceled");
        errorDialog.remove();
      }
      createDialogError("Sorry, there seems to be something wrong. Please contact support@trymyui.com");
      return errorDialog.showModal();
    }
  });
}

/// Function for use test edit end///

/// Function for checking validations of empty fields start///

function isEmpty(val, elem) {
  if ($(elem).attr("name").includes("require_answer_count")) {
    $(elem).closest("div.require_answer_options").next("span").remove();
  }else if ($(elem).attr("name").includes("phone_number")){
    $(elem).closest("td").next("span").remove();
  }else if($(elem).attr("name").includes("max_value") || $(elem).attr("name").includes("min_value")){
    $(elem).closest(".slider_rating").next("span").remove();
  }else{
    $(elem).next("span").remove();
  }
  $(elem).css("border", "none");
  if (val.length == 0 || val.length == null) {
    validate = false;
    if ($(elem).attr("name").includes("require_answer_count")) {
      $(elem).closest("div.require_answer_options").after("<span class='error' style='color: red !important;'>This field is required</span>");
    }else if ($(elem).attr("name").includes("phone_number")){
      $(elem).closest("td").after("<span class='error' style='color: red !important;'>This field is required</span>");
    }else if($(elem).attr("name").includes("min_value")){
      $(elem).closest(".slider_rating").after("<span class='error min_max_error' style='color: red !important;'>Min value is required</span>");
    }else if($(elem).attr("name").includes("max_value")){
      $(elem).closest(".slider_rating").after("<span class='error min_max_error' style='color: red !important;'>Max value is required</span>");
    }else{
      $(elem).after("<span class='error' style='color: red !important;'>This field is required</span>");
    }
    $(elem).css("border", "1px solid red");
  } else {
    validate = true;
    if ($(elem).attr("name").includes("require_answer_count")) {
      $(elem).closest("div.require_answer_options").next("span").remove();
    }else if ($(elem).attr("name").includes("phone_number")){
      $(elem).closest("td").next("span").remove();
    }else if($(elem).attr("name").includes("max_value") || $(elem).attr("name").includes("min_value")){
    $(elem).closest(".slider_rating").next("span").remove();
    }else{
      $(elem).next("span").remove();
    }
    $(elem).css("border", "none");  
  }
}

/// Function for checking validations of empty fields end///

function features_allowed_for_plan(feature,plan) {
  var feature_allowed;
  switch (plan) { 
    case "paid_personal":
        feature_allowed = $.inArray(feature,["create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder", "purchase_tmy_credits"]) > -1
        break;
    case "team":
       feature_allowed = $.inArray(feature,['uxcrowd', 'task_completion', 'seq', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf", "uxdiagnostics",'show_test_id','testing_with_own_testers','organizations',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder","purchase_tmy_credits", "task_duration",'worker_screening', "post_test_all_type_question","ux_sprint","share_test"]) > -1
       break;
    case "enterprise":
        feature_allowed = $.inArray(feature,['uxcrowd', 'task_completion', 'seq', 'non_disclosure_agreement', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf","uxdiagnostics",'stream', 'nps','concept_mapping', 'custom_tester_panel', 'face_recording','show_test_id', 'white_label_testing','testing_with_own_testers','organizations','generate_report',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder",'worker_screening',"purchase_tmy_credits", "task_duration", "custom_filter", "post_test_additional_survey", "video_transcript", "post_test_all_type_question","ux_sprint", "state_filter","share_test","trusted_testers"]) > -1
        break;
    case "edu":
        feature_allowed = $.inArray(feature,['uxcrowd', 'task_completion', 'seq', 'non_disclosure_agreement', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf","uxdiagnostics",'testing_with_own_testers','organizations','generate_report',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder", "post_test_additional_survey","ux_sprint","share_test"]) > -1
        break;
    case "bundle":
        feature_allowed = $.inArray(feature,['uxcrowd', 'task_completion', 'seq', 'non_disclosure_agreement', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf","uxdiagnostics",'stream', 'nps','show_test_id', 'white_label_testing','organizations',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder","ux_sprint"]) > -1
        break;
    case "enterprise_trial":
        feature_allowed = $.inArray(feature, ['uxcrowd', 'task_completion', 'seq', 'non_disclosure_agreement', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf","uxdiagnostics",'stream', 'nps','concept_mapping', 'custom_tester_panel', 'face_recording','show_test_id', 'white_label_testing','testing_with_own_testers','organizations','generate_report',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder",'worker_screening', "task_duration", "custom_filter", "post_test_additional_survey", "video_transcript", "post_test_all_type_question","ux_sprint", "state_filter","share_test"]) > -1
        break;
    case "unlimited":
        feature_allowed = $.inArray(feature,['uxcrowd', 'task_completion', 'seq', 'non_disclosure_agreement', 'reel_sharing', 'reel_download', "mobile_testing", "video_download", "sus", "download_pdf","uxdiagnostics",'stream', 'nps','concept_mapping', 'custom_tester_panel', 'face_recording','show_test_id', 'white_label_testing','testing_with_own_testers','organizations','generate_report',"create_folder", "add_test_to_folder", "add_test_from_folder", "remove_test_from_folder",'worker_screening', "task_duration", "custom_filter", "post_test_additional_survey", "video_transcript", "post_test_all_type_question","ux_sprint", "state_filter","share_test"]) > -1
        break;
  }
  return feature_allowed;
}



function next_feature_allowed_plan(feature) {
  var next_allowed_plan;
  var plan_names = ["paid_personal", "team", "enterprise", "unlimited"]
  $.each(plan_names, function(ind,plan){
    if (features_allowed_for_plan(feature,plan)) {
      next_allowed_plan = (plan == "paid_personal" ? "personal" : plan);
      return false;
    }
  })
  return next_allowed_plan;
}


function toTitleCase(str) {
  return str.replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
  });
}
/// Function to call basic step dialog start///

function callBasicStep(use_test, customer,back) {
  if (newTestDialog) {
    newTestDialog.close("reasonCanceled");
    newTestDialog.remove();
  }
  createNewUseTestDialog(use_test, customer, "", back);
  return newTestDialog.showModal();
}


// These require no user interaction:
async function writeFile(auth_token) {
  const folder = await fs.getDataFolder();
  const entries = await folder.getEntries();
  const myFile = entries.find(entry => entry.name.includes('TryMyUI.txt'));
  if (!$.isEmptyObject(auth_token)) {
    if (myFile) {
      await myFile.read().then(result => $stored_auth_token = result);
    }else{
      const myTmyFile = await folder.createFile("TryMyUI.txt", {overwrite: true});
      myTmyFile.write(auth_token);
      await myTmyFile.read().then(result => $stored_auth_token = result);
    }

  }else{
    if (myFile) {
      await myFile.read().then(result => $stored_auth_token = result);

    }
  }
}

// These require no user interaction:
async function deleteFile() {
  const folder = await fs.getDataFolder();
  const entries = await folder.getEntries();
  const myFile = entries.find(entry => entry.name.includes('TryMyUI.txt'));
    if (myFile) {
     await myFile.delete().then(result => $stored_auth_token = "");
    }
}

/// Function to call test script step dialog start///

function callTestScriptStep(params, use_test, customer, back) {
  if (stepTestScriptDialog){
    stepTestScriptDialog.close("reasonCanceled");
    stepTestScriptDialog.remove();
  }
  createStepTestScriptDialog(params, use_test, customer, back);
  return stepTestScriptDialog.showModal();
}

/// Function to call test script step dialog end///

/// Function to call audience step dialog start///

function callAudienceStep(params, use_test, customer, back) {
  if (stepAudienceDialog){
    stepAudienceDialog.close("reasonCanceled");
    stepAudienceDialog.remove();
  }
  createStepAudienceDialog(params, use_test, customer,back);
  return stepAudienceDialog.showModal();
}

/// Function to call audience step dialog end///


/// Function to call post test step dialog start///

function callPostTestStep(params, use_test, customer) {
  if (stepPostTestDialog){
    stepPostTestDialog.close("reasonCanceled");
    stepPostTestDialog.remove();
  }
  createStepPostTestDialog(params, use_test, customer);
  return stepPostTestDialog.showModal();
}

/// Function to call post test step dialog end///

/// Function to call cutomer signup dialog start///

function callregistrationStep(params) {
  if (registrationDialog) {
    registrationDialog.close("reasonCanceled");
    registrationDialog.remove();
  }
  createRegistrationDialog(params);
  return registrationDialog.showModal();
}

/// Function to call cutomer signup dialog end///

/// Function to call first entry dialog start///

function myPluginCommand(selection) {
  writeFile().then(function() {
    if ($stored_auth_token) {
      const url = `${website_url}/login_adobexd?auth_token=${$stored_auth_token}`;
      const callPost = xhrRequest(url, 'POST', "", "", true);
    }else{
      if (entryDialog) {
        entryDialog.close("reasonCanceled");
        entryDialog.remove();
      }
      createDialogEntry();
      entryDialog.showModal();
    } 
  });
}



/// Function to call first entry dialog end///

module.exports = {
  commands: {
    myPluginCommand
  }
};