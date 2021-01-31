const React = require("react");

const SvgInline = props => {
  let [svg, setSvg] = React.useState(null);
  let [svgMod, setSvgMod] = React.useState(null);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isErrored, setIsErrored] = React.useState(false);

  React.useEffect(() => {
    fetch(props.url, { cache: "force-cache" })
      .then(res => {
        return res.text();
      })
      .then(svgText => {
        let svgMod = svgText.replace(/width="[0-9]{1,}px"/, "width=100%");
        svgMod = svgText.replace(/height="[0-9]{1,}px"/, "height=100%");
        setSvg(svgText);
        setSvgMod(svgMod);
      })
      .catch(setIsErrored)
      .then(() => setIsLoaded(true));
  }, [props.url]);

  return (
    <div
      className={`svgInline svgInline--${isLoaded ? "loaded" : "loading"} ${
        isErrored ? "svgInline--errored" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: svgMod }}
      onClick={() => props.importHumaaan(svg)}
    />
  );
};

class Humaaans extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { importHumaaan, humaaanList } = this.props;

    let allHumaaans = [];
    allHumaaans = humaaanList.map((humaaan, index) => {
      return (
        <SvgInline
          key={humaaan}
          url={`https://raw.githubusercontent.com/iamtekeste/hdt/master/docs/objects/${humaaan}.svg?sanitize=true`}
          importHumaaan={importHumaaan}
        />
      );
    });
    return (
      <div className="all-humaaans">
        {allHumaaans.length > 0 ? (
          allHumaaans
        ) : (
          <span className="no-result">No search result.</span>
        )}
      </div>
    );
  }
}
module.exports = Humaaans;
