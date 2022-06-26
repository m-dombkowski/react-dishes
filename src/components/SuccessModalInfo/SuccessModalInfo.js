import styles from "./SuccessModalInfo.module.css";

const SuccessModalInfo = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.propertyName}>{props.name}</p>
      <p className={styles.valuesData}>{props.data}</p>
    </div>
  );
};

export default SuccessModalInfo;
