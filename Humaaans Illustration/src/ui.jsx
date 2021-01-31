const React = require("react");
const clipboard = require("clipboard");
const stylesme = require("./ui.css");
const Credit = require("./Credit.jsx");
const AllHumaaanList = [
  "sitting-1",
  "sitting-2",
  "sitting-3",
  "sitting-4",
  "sitting-5",
  "sitting-6",
  "sitting-7",
  "sitting-8",
  "standing-1",
  "standing-2",
  "standing-3",
  "standing-4",
  "standing-5",
  "standing-6",
  "standing-7",
  "standing-8",
  "standing-9",
  "standing-10",
  "standing-11",
  "standing-12",
  "standing-13",
  "standing-14",
  "standing-15",
  "standing-16",
  "standing-17",
  "standing-18",
  "standing-19",
  "standing-20",
  "standing-21",
  "standing-22",
  "standing-23",
  "standing-24",
  "accessoriesShoeFlatPointy",
  "accessoriesShoeFlatSimple",
  "accessoriesShoeFlatSneaker",
  "bodyHoodie",
  "bodyJacket",
  "bodyJacket2",
  "bodyLabCoat",
  "bodyLongSleeve",
  "bodyPointingForward",
  "bodyPointingUp",
  "bodyPregnant",
  "bodyTrenchCoat",
  "bodyTurtleNeck",
  "bottomSittingBaggyPants",
  "bottomSittingSkinnyJeans1",
  "bottomSittingSweatPants",
  "bottomStandingBaggyPants",
  "bottomStandingJogging",
  "bottomStandingShorts",
  "bottomStandingSkinnyJeans",
  "bottomStandingSkinnyJeansWalk",
  "bottomStandingSkirt",
  "bottomStandingSprint",
  "bottomStandingSweatpants",
  "headFrontAfro",
  "headFrontAiry",
  "headFrontCaesar",
  "headFrontChongo",
  "headFrontCurly",
  "headFrontHijab2",
  "headFrontHijab1",
  "headFrontLong",
  "headFrontNoHair",
  "headFrontPony",
  "headFrontRad",
  "headFrontShort1",
  "headFrontShort2",
  "headFrontShortBeard",
  "headFrontTop",
  "headFrontTurban2",
  "headFrontTurban1",
  "headFrontWavy",
  "objectsSeatBall",
  "objectsSeatCube",
  "objectsSeatCube2",
  "sceneHomePlant",
  "sceneHomeTable",
  "sceneHomeBigLeafPlant",
  "sceneHomeLamp",
  "sceneHomeHangingLamp",
  "sceneHomeClock",
  "scenePlantTopLeaves",
  "scenePlantMaceta",
  "scenePlantPlantLeft",
  "scenePlantPlantRight"
];

const SuccessScreen = ({dialog, backToIllustrations}) => {
  return (
    <div className="success-screen">
      <h1>Illustration copied to your clipboard! 🎉</h1>
     <div className="success-actions">
      <button  uxp-variant="cta" onClick={() => {
          dialog.close();
        }}>Done</button>
        <button  uxp-variant="primary" onClick={() => backToIllustrations()}>Back to illustrations</button>
     </div>
    </div>
  );
};
const Humaaans = require("./Humaaans.jsx");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      humaaanList: AllHumaaanList,
      showSuccess: false
    };

    this.filterHumaaans = event => {
      const searchTerm = event.target.value;
      const { humaaanList } = this.state;

      let filteredHumaaans = humaaanList.filter(humaaan => {
        return (
          humaaan.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >=
          0
        );
      });
      if (!searchTerm) {
        filteredHumaaans = AllHumaaanList;
      }
      this.setState({ searchTerm, humaaanList: filteredHumaaans });
    };

    this.importHumaaan = humaaan => {
      clipboard.copyText(humaaan);
      this.setState({ showSuccess: true });
    };

    this.backToIllustrations = () => {
      this.setState({ showSuccess: false });
    }
  }
  render() {
    const { searchTerm, humaaanList, showSuccess } = this.state;
    const {dialog} = this.props;
    const styles = {
      wrapper: {
        width: 800,
        height: 400,
        overflowY: "scroll"
      }
    };
    return (
      <div style={styles.wrapper}>
        <Credit dialog={dialog}/>
        {showSuccess ? (
          <SuccessScreen dialog={dialog} backToIllustrations={this.backToIllustrations}/>
        ) : (
          <div>
            <div className="InputAddOn">
              <input
                className="InputAddOn-field"
                type="text"
                value={searchTerm}
                onChange={this.filterHumaaans}
                placeholder="Search illustrations of people"
              />
            </div>
            <Humaaans
              importHumaaan={this.importHumaaan}
              humaaanList={humaaanList}
            />
          </div>
        )}
      </div>
    );
  }
}

module.exports = App;
