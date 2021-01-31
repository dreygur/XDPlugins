const React = require("react");
const styles = require("./SubscriptionMessage.css");

const SubscriptionMessage = ({loggedIn, amount} = {}) => (
    <div className={!loggedIn ? styles.default : styles.loggedIn}>
        {!loggedIn ?
            <span className={styles.text}>
                {`${amount} free exports left. Unblock all features on `}{' '}
                <a href="https://icanicon.io/">icanicon.io</a>
            </span> :
            <span className={styles.text}>
                {'Welcome back! Enjoy unlimited access with your Supernova plan. 🤙'}
            </span>
        }
    </div>
);

module.exports = SubscriptionMessage;
