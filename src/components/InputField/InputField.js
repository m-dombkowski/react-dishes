import { Fragment } from "react";
import { Field } from "react-final-form";

const InputField = (props) => {
  return (
    <Fragment>
      <Field name={props.name} validate={props.validation}>
        {({ input, meta }) => (
          <div>
            <label>{props.label}</label>
            <input
              {...input}
              type={props.type}
              placeholder={props.placeholder}
              step={props.step}
            />
            {meta.error && meta.touched && (
              <span className="errorMess">{meta.error}</span>
            )}
          </div>
        )}
      </Field>
    </Fragment>
  );
};

export default InputField;
