const React = require('react');
const styles = require('./App.css');
const application = require('application');
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
const freeExportNoIconsLeftTitle = "Not enough icons left";
const freeExportNoIconsLeftToast = "You've used up all free exports. Please subscribe on icanicon.io if you would like to keep on using this plugin.";
// Export error
const exportErrorTitle = "Could not export icons";
const exportErrorToast = "An issue has occurred while exporting your icons. Please check your icon content or internet connection.";
// Nothing selected
const nothingSelectedErrorTitle = "Select at least one icon";
const nothingSelectedErrorToast = "Please select at least one icon in order to use the export. Remember, each icon shall be placed on a seperate artboard.";
// Nothing selected
const selectExportOptionErrorTitle = "Select an export option";
const selectExportOptionErrorToast = "Please choose on of the given export options to proceed.";
// Credential mismatch
const credentialsMismatchErrorTitle = "Credentials don`t match";
const credentialsMismatchErrorToast = "There seems to be an issue with this combination of email and password. Please try again or reset your password.";
// Teams error
const readingTeamsErrorTitle = "Error reading teams";
const readingTeamsErrorToast = "You've been successfully logged in but there seems to be an issue with one of your teams. Try to re-open the plugin.";
// Teams export options error
const readingTeamExportOptionsErrorTitle = "Error reading team export options";
const readingTeamExportOptionsErrorToast = "There seems to be an issue loading your team export options. Try to re-open the plugin.";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIcons: [],
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
            iconCount: 0,
            amountLeft: 0,
            fingerprint: '',
        };

        this.panel = React.createRef();
        this.dialog = React.createRef();
        this.exportIcons = this.exportIcons.bind(this);
        this.documentStateChanged = this.documentStateChanged.bind(this);
        this.getSvgCode = this.getSvgCode.bind(this);
        this.submit = this.submit.bind(this);
        this.getIcanIconExportOptions = this.getIcanIconExportOptions.bind(this);
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.selectTeam = this.selectTeam.bind(this);
        this.getBoards = this.getBoards.bind(this);
        this.getTeamExportOptions = this.getTeamExportOptions.bind(this);
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
        let selectedIcons = [];
        selection.items.forEach(item => {
            if ( item.children.length > 0 && item instanceof Artboard ){
                selectedIcons.push(item);
            }
        });
        this.setState({ selectedIcons })
    }

    async exportIcons() {
        const { selectedIcons, checkedFileType } = this.state;
        if(selectedIcons.length === 0) {
            this.showMessage(false, nothingSelectedErrorTitle, nothingSelectedErrorToast);
            return;
        }
        if(!checkedFileType) {
            this.showMessage(false, selectExportOptionErrorTitle, selectExportOptionErrorToast);
            return;
        }
        const tmpFolder = await fs.getTemporaryFolder();
        this.setState({ exportLoading: true, iconCount: 0, exportData: [] }, () => {
            this.getSvgCode(0, tmpFolder);
        });
    }

    async getSvgCode(index, tmpFolder){
        const icon = this.state.selectedIcons[index];
        const file = await tmpFolder.createFile(`export${index}.svg`, {
            overwrite: true
        });
        const renditions = [
            {
                node: icon,
                outputFile: file,
                type: application.RenditionType.SVG,
                minify: true,
                embedImages: false
            }
        ];
        await application.createRenditions(renditions);
        const markup = await file.read();
        const div = document.createElement('div');
        div.innerHTML = markup;
        const elements = div.getElementsByTagName('clipPath');
        while (elements[0])
            elements[0].parentNode.removeChild(elements[0]);
        const svg = div.innerHTML;
        let codeCopy = this.state.exportData.slice();
        let segment = {};
        const segmentIndex = codeCopy.findIndex(seg => seg.name === SEGMENT_NAME);
        if( segmentIndex === -1 ) segment = {name: SEGMENT_NAME, icons: []};
        else segment = codeCopy[segmentIndex];
        segment.icons.push({name: icon.name, svg});
        if( segmentIndex === -1 ) codeCopy.push(segment);
        else codeCopy[segmentIndex] = segment;
        const nextIndex = index + 1;
        if( nextIndex === this.state.selectedIcons.length ){
            this.setState({ exportData: codeCopy, iconCount: this.state.iconCount + 1 }, () => {
                this.submit();
            });
            return;
        }
        this.setState({ exportData: codeCopy, iconCount: this.state.iconCount + 1 }, () => {
            this.getSvgCode(nextIndex, tmpFolder);
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    async submit(){
        const { exportData, checkedFileType, token, iconCount, team, fingerprint } = this.state;
        const requestData = this.splitRequest(exportData);
        const chunkCount = requestData.reduce((total, segment) => total + segment.icons.length, 0);
        const url = `${API}/figma/downloadFigmaBoard`;
        let responses = [];
        let iteration = 1;
        let zip_file = '';
        try {
            for(let index in requestData){
                const segment = requestData[index];
                for(let idx in segment.icons){
                    const iconsToSend = segment.icons[idx];
                    const lastRequest = `${index}` === `${requestData.length - 1}` && `${idx}` === `${segment.icons.length - 1}`;
                    const dataToSend = {
                        'first_request': `${index}` === `${0}` && `${idx}` === `${0}`,
                        'last_request': lastRequest,
                        'zip_file': zip_file,
                        'segment_name': segment.name,
                        'icons': iconsToSend,
                        'logged_in': !!token,
                        'formats': [checkedFileType],
                        'fingerprint': fingerprint,
                        'amount': iconCount,
                        'team': team && team.id,
                        'application_code': 70,
                    };
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    };
                    if (token){
                        options.headers['Authorization'] = 'Bearer ' + token;
                    }
                    if(!lastRequest){
                        const response = await fetch(url, options);
                        const percent = (parseFloat(iteration.toFixed(2)) / parseFloat(chunkCount.toFixed(2))) * 100;
                        // loadingBar.style.width = `${percent}%`;
                        iteration++;
                        responses.push(response.status);
                        if(`${index}` === `${0}` && `${idx}` === `${0}`){
                            const path = await response.json();
                            zip_file = path['zip_file']
                        }
                        if(response.status !== 200){
                            let error = await response.json();
                            this.showMessage(MESSAGE_TYPE_ERROR, error);
                            return;
                        }
                    } else {
                        await fetch(url, options).then(resp => {
                            if (resp.status === 200) {
                                return resp.arrayBuffer();
                            }else if(resp.status === 406){
                                this.showMessage(false, freeExportNoIconsLeftTitle, freeExportNoIconsLeftToast);
                            }
                            return null;
                        }).then(async buffer => {
                            if ( !buffer ) return;
                            const anotherFile = await fs.getFileForSaving("adobe_svg_export.zip");
                            await anotherFile.write(buffer);
                            // updateAmount();
                        }).catch(error => {
                           console.log('ERROR', error);
                        })
                    }
                }
            }
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
        const url = `${API}/export_bar/option/`;
        this.setState({ freeExportOptionsLoading: true }, async () => {
            try{
                const response = await fetch(url, {});
                if(response.status === 200){
                    let data = await response.json();
                    this.setState({ freeExportOptionsLoading: false, exportOptions: data.filter(option => option.public_access) })
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
                    this.logout();
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

    getTeamExportOptions(){
        const { team, token } = this.state;
        this.setState({ teamExportOptionsLoading: true }, async () => {
            try {
                const allowedTypes = ['static-custom','static-native','static-web','basic'];
                const url = `${API}/export_bar/team/${team.id}/`;
                const options = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                };
                const response = await fetch(url, options);
                if(response.status === 200) {
                    let data = await response.json();
                    let teamExportOptions = [];
                    data.forEach(option => {
                        if(allowedTypes.includes(option.output_option.output_category)){
                            if(option.output_option.file_type === 'custom' && team.custom_template && team.custom_template.validated)
                                teamExportOptions.push(option.output_option)
                            else if(option.output_option.file_type !== 'custom')
                                teamExportOptions.push(option.output_option);
                        }
                    });
                    this.setState({ teamExportOptionsLoading: false, exportOptions: teamExportOptions });
                }else{
                    this.setState({ teamExportOptionsLoading: false }, () => {
                        this.showMessage(true, readingTeamExportOptionsErrorTitle, readingTeamExportOptionsErrorToast);
                    });
                }
            }catch(error) {
                this.setState({ teamExportOptionsLoading: false }, () => {
                    this.showMessage(true, readingTeamExportOptionsErrorTitle, readingTeamExportOptionsErrorToast);
                });
            }
        });
    }

    selectTeam(team){
        this.setState({ team }, () => {
            // this.getBoards();
            this.getTeamExportOptions();
        });
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

    splitRequest(data){
        let requestData = [];
        const chunk = 10;
        for(let index in data){
            const segment = data[index];
            requestData.push({name: segment.name, icons: []});
            let requestSegment = requestData[index];
            requestSegment.icons = segment.icons.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index/chunk);
                if(!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
                resultArray[chunkIndex].push(item);
                return resultArray
            }, [])
        }
        return requestData;
    }

    render() {
        const {
            selectedIcons,
            exportOptions,
            checkedFileType,
            team,
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
            <panel className={styles.panel}>
                {/* Selection */}
                <label>Export your icons!</label>
                <SelectAmount amount={selectedIcons.length} />
                {/* Selection */}
                <SubscriptionMessage loggedIn={!!token} amount={amountLeft} />
                {/* Export options */}
                <label className="mb6">Export format</label>

                {exportOptions.map(option => {
                    const value = option.file_type === 'custom' ? option.file_type + '_' + team.id : option.file_type;
                    return <label onClick={() => this.setState({checkedFileType: value})} key={`export-option-${option.file_type}`} className="row">
                        <input checked={checkedFileType === option.file_type || checkedFileType === option.file_type + '_' + team} onChange={() => this.setState({checkedFileType: option.file_type})} type="radio" name="export-option"/>
                        <span>
                            <div>
                                <img src={`https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/${option.icon}`}/>
                            </div>
                            {option.name}<i>&nbsp;</i>{option.file_ending}
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
                    {/* Sign up button */}
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
                {/* <label className="mb12">More Xd plugins from icanicon.io</label> */}
                {/*<a className="plugin-button">
                    <img src="https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/ii-icon.svg" alt="icanicon.io"/>Colors → Code
                </a>*/}
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
