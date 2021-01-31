class Dialogs{
    showIntro(){
        let html= `
            <style>
                .content-container{
                    display: flex;
                    justify-content: space-around;
                    margin:10px 10px;
                }
                .content-container:last-child{
                    justify-content: flex-start;
                    margin-left: 20px;
                }

                .button-container:hover{
                    background: #fff;
                    cursor: pointer;
                }
                .button-container{
                    background: #f9f9f9;
                    text-align:center;
                    padding-top: 20px;
                    border-radius: 10px;
                }
                .button-container .heading{
                    padding:0;
                    margin:0;
                }
                .button-container .component-image{
                    padding:0px;
                    margin:0px;
                }
                .main-container{
                    width: 700;
                    height:400;
                    overflow: scroll;
                }

                .inline{
                    display:inline;
                }
                .header-container{
                    display: flex;
                }
                .right{
                    align-items: center;
                }
                .profile{
                    color: #aaa;
                    font-size: 14px;
                }
                .website{
                    color: #615CA2;
                    text-decoration: none;
                }
                .website:hover{
                    text-decoration: underline;
                }

                .success{
                    background-color: #28A745;
                }
                .failure{
                    background-color: #DE3E44;
                }

                #snackbar {
                    display: none;
                    margin-left: -125px;
                    color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    padding: 16px;
                    position: fixed;
                    z-index: 1;
                    left: 20%;
                    bottom: 30px;
                }  
                
            </style>
            
            <div class="header-container">
                <div class="left" id="left">
                    <h1><a href="fluidtech.in/ready" class="website"><b>Ready Components</b></a></h1>
                    <p>Plugin provides ready-made components which are generalized and can be used in any of the UI design. </p>
                    <p><a href="rohit-rmethwani.github.io/resume-website/" class="profile">By Rohit Methwani</a></p>
                    <br>
                    <p>Select Artboard:</p><select id="options" width="250" placeholder="Select artboard">        
                        </select>
                </div>
                <div class="right">
                    <a class="close-btn" id="close-btn"><img src="./images/close-purple.svg" width="75%" height="75%"></img></a>
                </div>
                <hr/>
            </div>

            <div class="main-container">    
                <div class="content-container">
                    <div class="button-container" id="accordion">
                        <h2 class="heading">Accordion<h2>
                        <img src="./images/Accordion.png" alt="" id="component-image" width="300px" height="215px">
                    </div>
                    <div class="button-container" id="button">
                        <h2 class="heading">Button<h2>
                        <img src="./images/Button.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>  

                <div class="content-container">
                    <div class="button-container" id="footer">
                        <h2 class="heading">Bottom Navbar<h2>
                        <img src="./images/Footer.png" alt="" id="component-image" width="300px" height="215px">
                    </div>
                    <div class="button-container" id="login-form">
                        <h2 class="heading">Basic Form<h2>
                        <img src="./images/Form.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>  

                <div class="content-container">
                    <div class="button-container" id="navigation-header">
                        <h2 class="heading">Navigation Header<h2>
                        <img src="./images/Header.png" alt="" id="component-image" width="300px" height="215px">
                    </div>
                    <div class="button-container" id="icon-box">
                        <h2 class="heading">Icon Box<h2>
                        <img src="./images/Icon box.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>  

                <div class="content-container">
                    <div class="button-container" id="list-image-card">
                        <h2 class="heading">List Image Card<h2>
                        <img src="./images/Image card.png" alt="" id="component-image" width="300px" height="215px">
                    </div>
                    <div class="button-container" id="list-card">
                        <h2 class="heading">List Card<h2>
                        <img src="./images/List card.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>  

                <div class="content-container">
                    <div class="button-container" id="sidebar">
                        <h2 class="heading">Sidebar<h2>
                        <img src="./images/Sidebar.png" alt="" id="component-image" width="300px" height="215px">
                    </div>
                    <div class="button-container" id="textfield">
                        <h2 class="heading">TextField<h2>
                        <img src="./images/Textfield.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>  

                <div class="content-container">
                    <div class="button-container" id="toggle-button">
                        <h2 class="heading">Toggle Button<h2>
                        <img src="./images/Toggle button.png" alt="" id="component-image" width="300px" height="215px">
                    </div>  
                </div>
            </div>
            <div id="snackbar"></div>
            `;

        return html;

    }
    header(){
        let html=`
        <style>
            .inline{
                display:inline;
            }
            .header-container{
                display: flex;
            }
            .right{
                align-items: center;
            }
            .profile{
                color: #aaa;
                font-size: 14px;
            }
            .website{
                color: #615CA2;
                text-decoration: none;
            }
            .website:hover{
                text-decoration: underline;
            }
        </style>
        <div class="header-container">
            <div class="left" id="left">
                <h1><a href="fluidtech.in/ready" class="website"><b>Ready Components</b></a></h1>
                <p>Plugin provides ready-made components which are generalized and can be used in any of the UI design. </p>
                <p><a href="rohit-rmethwani.github.io/resume-website/" class="profile">By Rohit Methwani</a></p>
                <br>
                <p id="options-text">Select Artboard:</p>
                <select id="options" width="250" style={border: solid 5px #F5F5F5;}></select>
            </div>
            <div class="right">
                <a class="close-btn" id="close-btn"><img src="./images/close-purple.svg" width="75%" height="75%"></img></a>
            </div>
            <hr/>
        </div>

        <div id="snackbar" class="`+ type +`">`+ message  +`</div>
        `;
        return html;
    }
    toastr(type, message){
        let html = `
        <style>
        .success{
            background-color: #28A745;
        }
        .failure{
            background-color: #28A745;
        }
        #snackbar {
            display: none; /* Hidden by default. Visible on click */
            margin-left: -125px; /* Divide value of min-width by 2 */
            background-color: #28A745; /* Black background color */
            color: #fff; /* White text color */
            text-align: center; /* Centered text */
            border-radius: 2px; /* Rounded borders */
            padding: 16px; /* Padding */
            position: fixed; /* Sit on top of the screen */
            z-index: 1; /* Add a z-index if needed */
            left: 50%; /* Center the snackbar */
            bottom: 30px; /* 30px from the bottom */
        }  
        </style>
        <div id="snackbar" class="`+ type +`">`+ message  +`</div>`;
        return html;
    }
    
}

var object = new Dialogs();
module.exports = object;