const React = require("react");
const styles = require("./Dialog.css");

class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.myDialog = React.createRef();
        this.showDialog = this.showDialog.bind(this);
    }

    showDialog(){
      this.myDialog.current.showModal();
    }

    render(){
        return (

            <dialog ref={this.myDialog}>
                <form className={styles.form} method="error-alert">
                    <h1 className={styles.h1} style={this.props.isError ? {color: '#C74545'} : {color: 'initial'}}>
                        <span>{this.props.title}</span>
                        <img className={styles.icon} src="https://sugarcode-assets.s3.eu-central-1.amazonaws.com/icanicon/ii-icon.svg" />
                    </h1>
                    <hr />
                    <p>{this.props.message}</p>
                    <footer>
                        <button onClick={() => this.myDialog && this.myDialog.current.close()} uxp-variant="primary">Got it</button>
                    </footer>
                </form>
            </dialog>
        );
    }
}

module.exports = Dialog;
