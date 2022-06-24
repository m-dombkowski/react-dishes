import { Fragment } from "react";
import { Field } from "react-final-form";
import styles from "./InputField.module.css";

const InputField = (props) => {
  return (
    <Fragment>
      <Field name={props.name} validate={props.validation} parse={props.parse}>
        {({ input, meta }) => (
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>{props.label}</label>
            <input
              {...input}
              className={[
                styles.input,
                meta.active ? styles.inputFocus : "",
                meta.error && meta.touched ? styles.inputError : "",
                meta.touched && !meta.error ? styles.inputOk : "",
              ].join(" ")}
              type={props.type}
              placeholder={props.placeholder}
              step={props.step}
            />
            {meta.error && meta.touched && (
              <span className={styles.errorMessage}>❕ {meta.error}</span>
            )}
            {!meta.error && meta.touched && (
              <span className={styles.okMessage}>👍</span>
            )}
          </div>
        )}
      </Field>
    </Fragment>
  );
};

export default InputField;
