const React = require("react");
const styles = require("./SelectionAmount.css");

const SelectionAmount = ({amount} = {}) => (
    <div className={styles.wrapper}>
        <span className={styles.text}>
            {`${amount} objects selected`}
        </span>
    </div>
);

module.exports = SelectionAmount;
