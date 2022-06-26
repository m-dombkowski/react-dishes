import SuccessModalInfo from "../SuccessModalInfo/SuccessModalInfo";
import styles from "./SuccessModal.module.css";

const SuccessModal = (props) => {
  return (
    <div className={styles.successModalContainer}>
      <div className={styles.headerFlex}>
        <h1 className={styles.requestSuccessTitle}> Dish created!</h1>
        <button
          onClick={props.onClose}
          title="Close modal window"
          className={styles.closeModal}
        >
          X
        </button>
      </div>
      <div className={styles.dataContainer}>
        <SuccessModalInfo name="Name:" data={props.values.name} />
        <SuccessModalInfo
          name="Preparation Time:"
          data={props.values.preparation_time}
        />
        <SuccessModalInfo name="Type:" data={props.values.type} />
        {props.values.no_of_slices && (
          <SuccessModalInfo
            name="Number of slices:"
            data={props.values.no_of_slices}
          />
        )}
        {props.values.diameter && (
          <SuccessModalInfo name="Diameter:" data={props.values.diameter} />
        )}
        {props.values.spiciness_scale && (
          <SuccessModalInfo
            name="Spiciness scale:"
            data={props.values.spiciness_scale}
          />
        )}
        {props.values.slices_of_bread && (
          <SuccessModalInfo
            name="Number of slices:"
            data={props.values.slices_of_bread}
          />
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
