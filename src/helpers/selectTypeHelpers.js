import { Field } from "react-final-form";

export const selectClasses = (values, styles) => {
  return [
    styles.type,
    !values.type ? styles.errorSelect : "",
    values.type === "pizza" ||
    values.type === "soup" ||
    values.type === "sandwich"
      ? styles.okSelect
      : "",
  ].join(" ");
};

export const goodSelectMessage = (values, styles) => {
  if (
    values.type === "pizza" ||
    values.type === "soup" ||
    values.type === "sandwich"
  ) {
    return <span className={styles.selectOk}>👍</span>;
  }
};

export const Error = ({ name, styles }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { error, touched } }) =>
      error && touched ? (
        <span className={styles.selectErrorMessage}>❕ {error}</span>
      ) : null
    }
  </Field>
);
