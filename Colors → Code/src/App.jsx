const React = require('react');
const styles = require('./App.css');
const fs = require('uxp').storage.localFileSystem;
const SelectAmount = require('./components/SelectionAmount');
const SubscriptionMessage = require('./components/SubscriptionMessage');
const uuid = require('uuid-random');

const Dialog = require('./components/Dialog');

const API = 'https://icanicon.io/api';
const MESSAGE_TYPE_ERROR = 'error';
const MESSAGE_TYPE_SUCCESS = 'success';
const SEGMENT_NAME = 'Ungrouped';

/* Toasts */
const toastTimeOut = 4000;
const boardNameRequiredErrorToast = "🤓 Please enter a board name";
const boardNameTakenErrorToast = "🤓 This board name already exists";
const freeExportErrorToast = "😫 Issue with free export";
const boardUpdatedSuccessToast = "🎉 Board updated!";
const boardCreatedSuccessToast = "🎉 Board created!";
const upgradeRequiredErrorToast = "🚀 Please upgrade to Supernova";
const pushErrorToast = "😫 Could not push files";
const readingBoardErrorToast = "😫 Error reading boards";

// No exports left
const freeExportNoIconsLeftTitle = "Not enough exports left";
const freeExportNoIconsLeftToast = "You've used up all free exports. Please subscribe on icanicon.io if you would like to keep on using this plugin.";
// Export error
const exportErrorTitle = "Could not export";
const exportErrorToast = "An issue has occurred while exporting your colors.";
// Nothing selected
const nothingSelectedErrorTitle = "Select at least one color";
const nothingSelectedErrorToast = "Please select at least one color in order to use the export. Remember, each color shall be placed on a seperate artboard.";
// Nothing selected
const selectExportOptionErrorTitle = "Select an export option";
const selectExportOptionErrorToast = "Please choose one of the given export options to proceed.";
// Credential mismatch
const credentialsMismatchErrorTitle = "Credentials don`t match";
const credentialsMismatchErrorToast = "There seems to be an issue with this combination of email and password. Please try again or reset your password.";
// Teams error
const readingTeamsErrorTitle = "Error reading teams";
const readingTeamsErrorToast = "You've been successfully logged in but there seems to be an issue with one of your teams. Try to re-open the plugin.";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedObjects: [],
            exportData: [],
            exportOptions: [],
            checkedFileType: null,
            token: null,
            username: '',
            password: '',
            team: '',
            teams: [],
            board: '',
            boards: [],
            loginLoading: false,
            logoutLoading: false,
            exportLoading: false,
            teamsLoading: false,
            teamExportOptionsLoading: false,
            freeExportOptionsLoading: false,
            isError: false,
            message: '',
            objectCount: 0,
            amountLeft: 0,
            fingerprint: '',
        };

        this.panel = React.createRef();
        this.dialog = React.createRef();
        this.exportIcons = this.exportIcons.bind(this);
        this.documentStateChanged = this.documentStateChanged.bind(this);
        this.getFills = this.getFills.bind(this);
        this.submit = this.submit.bind(this);
        this.getIcanIconExportOptions = this.getIcanIconExportOptions.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.refresh = this.refresh.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.selectTeam = this.selectTeam.bind(this);
        this.getBoards = this.getBoards.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.getAmountLeft = this.getAmountLeft.bind(this);
    }

    async componentDidMount(){
        this.getIcanIconExportOptions();
        let prefs = await this.readPrefs();
        if (!prefs) prefs = await this.savePrefs();
        const user = await this.readUser();
        if(user && user.access){
            this.refresh(user.refresh);
        }
        this.setState({ fingerprint: prefs.fingerprint }, () => {
            this.getAmountLeft();
        });
    }

    async savePrefs() {
        try {
            const prefs = {
                fingerprint: uuid(),
            };
            const settingsFolder = await fs.getDataFolder();
            const settingsFile = await settingsFolder.createFile("settings.json", {overwrite: true});
            await settingsFile.write(JSON.stringify(prefs));
            return prefs;
        } catch(err) {
            console.log('SAVE ERROR', err)
        }
    }
    async readPrefs() {
        const settingsFolder = await fs.getDataFolder();
        try {
            const settingsFile = await settingsFolder.getEntry("settings.json");
            const prefs = JSON.parse(await settingsFile.read());
            return prefs;
        } catch(err) {
            return false;
        }
    }

    async saveUser(access, refresh) {
        try {
            const prefs = {
                access,
                refresh
            };
            const userFolder = await fs.getDataFolder();
            const userFile = await userFolder.createFile("user.json", {overwrite: true});
            await userFile.write(JSON.stringify(prefs));
            return prefs;
        } catch(err) {
            console.log('SAVE ERROR', err)
        }
    }
    async readUser() {
        const userFolder = await fs.getDataFolder();
        try {
            const userFile = await userFolder.getEntry("user.json");
            return JSON.parse(await userFile.read());
        } catch(err) {
            return false;
        }
    }

    documentStateChanged(selectionProp) {
        const { selection, Artboard } = require("scenegraph");
        let selectedObjects = [];
        selection.items.forEach(item => {
            if ( item.fill ){
                selectedObjects.push(item);
            }
        });
        this.setState({ selectedObjects })
    }

    async exportIcons() {
        const { selectedObjects, checkedFileType } = this.state;
        if(selectedObjects.length === 0) {
            this.showMessage(false, nothingSelectedErrorTitle, nothingSelectedErrorToast);
            return;
        }
        if(!checkedFileType) {
            this.showMessage(false, selectExportOptionErrorTitle, selectExportOptionErrorToast);
            return;
        }
        this.setState({ exportLoading: true, objectCount: 0, exportData: [] }, () => {
            this.getFills();
        });
    }

    getFills(){
        try{
            const objects = this.state.selectedObjects;
            let colors = [];
            objects.forEach(obj => {
                colors.push({name: obj.name, hex: obj.fill.toHex().replace('#','')})
            })
            this.setState({ exportData: colors, objectCount: colors.length }, () => {
                this.submit();
            });
        }catch(e){
            console.log('ERROR', e)
        }

    }

    async submit(){
        const { exportData, checkedFileType, token, team, fingerprint } = this.state;
        const url = `${API}/color_converter/figma_export/`;
        const dataToSend = {
            'file_type': checkedFileType,
            'fingerprint': fingerprint,
            'colors': exportData,
            'export_type': 'colors',
            'team': team && team.id,
            'application_code': 70,
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        };
        if(token) options['headers']['Authorization'] = 'Bearer ' + token;
        try {
            await fetch(url, options).then(resp => {
                if (resp.status === 200) {
                    return resp.arrayBuffer();
                }else if(resp.status === 406){
                    this.showMessage(false, freeExportNoIconsLeftTitle, freeExportNoIconsLeftToast);
                }
                return null;
            }).then(async buffer => {
                if ( !buffer ) return;
                const anotherFile = await fs.getFileForSaving("adobe_color_export.zip");
                await anotherFile.write(buffer);
                // updateAmount();
            }).catch(error => {
                console.log('ERROR', error);
            })
        } catch (error) {
            console.log('Error', error);
            this.showMessage(true, exportErrorTitle, exportErrorToast);
        }
        // loadingBar.style.width = '0%';
        this.setState({ exportLoading: false }, () => {
            this.getAmountLeft()
        });
    }

    getIcanIconExportOptions(){
        const url = `${API}/color_converter/`;
        this.setState({ freeExportOptionsLoading: true }, async () => {
            try{
                const response = await fetch(url, {});
                if(response.status === 200){
                    let data = await response.json();
                    this.setState({ freeExportOptionsLoading: false, exportOptions: data })
                }
            }catch(error){
                console.log(error);
            }
        });
    };

    async getAmountLeft(){
        const { fingerprint } = this.state;
        const url = `${API}/figma/checkRemainingIconCount`;
        let formData = new FormData();
        formData.append('fp', fingerprint);
        formData.append('export_type', 'colors');
        const options = {
            method: 'POST',
            body: formData
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.setState({ amountLeft: data.amount })
        }catch(error) {
            this.setState({ amountLeft: 0 })
        }
    };

    refresh(refreshToken){
        const url = `${API}/token/refresh/`;
        const formData = new FormData();
        formData.append('refresh', refreshToken);
        this.setState({loginLoading: true}, async () => {
            const options = {
                method: 'POST',
                body: formData
            };
            try {
                const response = await fetch(url, options);
                if(response.status === 200){
                    response.json().then(jsn => {
                        const token = jsn.access;
                        this.saveUser(token, refreshToken)
                        this.setState({ token, loginLoading: false }, () => {
                            this.getTeams();
                        });
                    })
                }else{
                    this.setState({ token, loginLoading: false }, () => {
                        this.logout();
                    });
                }
            } catch (error) {
                this.setState({ loginLoading: false }, () => {
                    this.showMessage(true, credentialsMismatchErrorTitle, credentialsMismatchErrorToast);
                });
            }
        });
    };

    login(){
        const { username, password } = this.state;
        if (username === '' || password === '') return;
        const url = `${API}/login/`;
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        this.setState({loginLoading: true}, async () => {
            const options = {
                method: 'POST',
                body: formData
            };
            try {
                const response = await fetch(url, options);
                const data = await response.text();
                const jsonData = JSON.parse(data);
                const token = jsonData.access;
                await this.saveUser(jsonData.access, jsonData.refresh)
                if (token) {
                    this.setState({ token, loginLoading: false }, () => {
                        this.getTeams();
                    });
                } else {
                    this.setState({ loginLoading: false }, () => {
                        this.showMessage(true, credentialsMismatchErrorTitle, credentialsMismatchErrorToast);
                    });
                }
            } catch (error) {
                this.setState({ loginLoading: false }, () => {
                    this.showMessage(true, credentialsMismatchErrorTitle, credentialsMismatchErrorToast);
                });
            }
        });
    };

    logout(){
        this.saveUser(null, null)
        this.setState({ token: null, teams: [], team: '', exportOptions: []  }, () => {
            this.getIcanIconExportOptions()
        });
    };

    getTeams(){
        const url = `${API}/teams/`;
        const { token } = this.state;
        const options = {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        this.setState({ teamsLoading: true }, async () => {
            try {
                const response = await fetch(url, options);
                if(response.status !== 200){
                    this.setState({ teamsLoading: false }, () => {
                        this.logout()
                    });
                    return;
                }
                const teams = await response.json();
                this.setState({ teams, teamsLoading: false }, () => {
                    this.selectTeam(teams[0])
                });
            }catch(error) {
                this.setState({ teamsLoading: false }, () => {
                    this.showMessage(true, readingTeamsErrorTitle, readingTeamsErrorToast);
                });
            }
        });
    };

    selectTeam(team){
        this.setState({ team });
    }

    async getBoards(){
        const { team, token } = this.state;
        const url = `${API}/boards?teamId=${team.id}/`;
        const options = {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        try {
            const response = await fetch(url, options);
            const boards = await response.json();
            this.setState({ boards: boards.filter(board => board.type === 4) }, () => {
                if(this.state.boards.length > 0)
                    this.setBoard(this.state.boards[0])
            });
        }catch(error) {
            console.log('error getting boards', error);
        }
    };

    setBoard(board){
        this.setState({ board })
    }

    showMessage(isError, title, message){
        this.setState({ isError, title, message }, () => {
            this.dialog.current.showDialog();
        })
    }

    render() {
        const {
            selectedObjects,
            exportOptions,
            checkedFileType,
            teams,
            token,
            loginLoading,
            logoutLoading,
            exportLoading,
            freeExportOptionsLoading,
            teamExportOptionsLoading,
            teamsLoading,
            isError,
            title,
            message,
            amountLeft
        } = this.state;

        return (
            <panel className="panel">
                {/* Selection */}
                <label>Export your colors!</label>
                <SelectAmount amount={selectedObjects.length} />
                <SubscriptionMessage loggedIn={!!token} amount={amountLeft} />
                {/* Export options */}
                <label className="mb6">Export format</label>
                {exportOptions.map(option => {
                    const value = option.file_type;
                    return <label onClick={() => this.setState({checkedFileType: value})} key={`export-option-${option.file_type}`} className="row">
                        <input checked={checkedFileType === option.file_type} onChange={() => this.setState({checkedFileType: option.file_type})} type="radio" name="export-option"/>
                        <span>
                            <div>
                                <img src={`https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/${option.icon}`} alt="..." />
                            </div>
                            {option.file_type}<i>&nbsp;</i>(.{option.file_ending})
                        </span>
                    </label>})}

                {exportOptions.length === 0 && (freeExportOptionsLoading || teamExportOptionsLoading) && <div><span>Loading...</span></div>}

                <div className="row-center">
                    <button disabled={exportLoading} onClick={this.exportIcons} uxp-variant="cta">{exportLoading ? 'Loading...' : 'Export'}</button>
                </div>

                {/* Login */}
                <hr/>
                {!token &&
                <div className="form-wrapper">
                    <label className="mb6">Login to your icanicon.io account</label>
                    {/* Email */}
                    <label className="input-row">
                        <span>Email</span>
                        <input onChange={e => this.setState({username: e.target.value})} type="text" placeholder="Enter your email"/>
                    </label>
                    {/* Password */}
                    <label className="input-row">
                        <span>Password</span>
                        <input onChange={e => this.setState({password: e.target.value})} type="password" placeholder="Enter your password"/>
                    </label>
                    <div className="row-center">
                        <a href="https://icanicon.io/forgot-password">Forgot password?</a>
                    </div>
                    {/* Login button */}
                    <div className="row-center">
                        <button disabled={loginLoading} onClick={this.login} uxp-variant="primary">{loginLoading ? 'Loading...' : 'Login'}</button>
                    </div>
                    <div className="row-center">
                        <a href="https://icanicon.io/signup?plan=supernova">Sign up</a>
                    </div>
                </div>}

                {token &&
                <div className="input-row">
                    <label>Select your team</label>
                    {!teamsLoading && teams.length > 0 && <select defaultValue={teams[0]} onChange={e => {
                        const selectedTeam = e.target.value;
                        this.selectTeam(teams[selectedTeam])
                    }}>
                        {teams.map((t, index) => <option value={index} key={`select-team-${index}`}>{t.name}</option>)}
                    </select>}
                    {teamsLoading && <div><span>Loading...</span></div>}
                </div>}

                {token &&
                <div className="form-wrapper">
                    {/* Logout button */}
                    <div className="row-center">
                        <button disabled={logoutLoading} onClick={this.logout} uxp-variant="primary">{logoutLoading ? 'Loading...' : 'Logout'}</button>
                    </div>
                </div>}

                <Dialog
                    ref={this.dialog}
                    message={message}
                    isError={isError}
                    title={title} />

                {/* Other plugins
                <hr/>
                <label className="mb12">More Xd plugins from icanicon.io</label>
                <a className="plugin-button">
                    <img src="https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/ii-icon.svg" alt="Icons to Code"/>Icons → Code
                </a>
                {/*<a className="plugin-button">
                    <img src="https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/ii-icon.svg" alt="icanicon.io"/>Grid → Code
                </a>*/}
                {/*<a className="plugin-button">
                    <img src="https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/ii-icon.svg" alt="icanicon.io"/>Buttons → Code
                </a>*/}
            </panel>
        );
    }
}

module.exports = App;
