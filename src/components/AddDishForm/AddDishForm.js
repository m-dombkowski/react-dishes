import { Field, Form } from "react-final-form";
import styles from "./AddDishForm.module.css";
import { Fragment, useState } from "react";
import { OnChange } from "react-final-form-listeners";
import InputField from "../InputField/InputField";
import {
  generateUniqueId,
  validationObj,
} from "../../validation/validationFunctions";
import axios from "axios";
import {
  goodSelectMessage,
  selectClasses,
  Error,
} from "../../helpers/selectTypeHelpers";

const AddDishForm = () => {
  const [type, setType] = useState(null);
  const [requestError, setRequestError] = useState(false);
  const [requestErrorMsg, setRequestErrorMsg] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState("");

  /*
  setting error message for POST request. Depeneding on what is available
  */

  const setError = (obj, error) => {
    for (const key in obj) {
      setRequestErrorMsg(obj[key] ?? error.message);
    }
  };

  /*
   simple post request using axios clearing all the error/success message submit before sending request so if user had an error after previous request small message window will disappear 
  */

  const onSubmit = (values) => {
    setRequestError(false);
    setRequestErrorMsg("");
    setRequestSuccessMessage("");
    axios({
      method: "post",
      url: "https://frosty-wood-6558.getsandbox.com:443/dishes",
      data: { ...values, id: generateUniqueId() },
      headers: { "content-type": "application/json" },
    })
      .then(function (response) {
        setRequestSuccess(true);
        setRequestSuccessMessage(response.data);
      })
      .catch(function (error) {
        setRequestError(true);
        setError(error.response.data, error);
      });
  };

  /* 
  It's definitely not the best way to implement this logic but I guess it's ok-ish for small form like this one.
  Purpose of this function is to clear 'subtypes' like number of slices, diameter values if user switch to a different type of food. 
  */

  const resetSpecificValuesOnChange = (values, dishType) => {
    switch (dishType) {
      case "soup":
        values.no_of_slices = undefined;
        values.diameter = undefined;
        values.slices_of_bread = undefined;
        break;
      case "pizza":
        values.slices_of_bread = undefined;
        values.spiciness_scale = undefined;
        break;
      case "sandwich":
        values.no_of_slices = undefined;
        values.spiciness_scale = undefined;
        values.diameter = undefined;
        break;
      default:
    }
  };

  /* 
  this one seems better and more "universal" but doesn't really work with React Final Form values object. Would need to make separate state for all of the data with nested objects for types and transform it later to one object without any nesting.
  */
  /*
  What this loop does is to basically loop through whole object, later through types and if type (key) is not the same as selected one all of it's children are cleared (set to undefined)
  */

  /*
  const resettingOtherTypes = (obj, selectedType) => {
    for (const key in obj) {
      if (key !== selectedType) {
        for (const innerKey in obj[key]) {
          if (obj[key][innerKey]) {
            obj[key][innerKey] = undefined;
          }
        }
      }
    }
  };
  */

  return (
    <Fragment>
      <header className={styles.header}>
        <h1 className={styles.title}>Create your own dish!</h1>
        <span className={styles.dishEmoji}>🍜</span>
      </header>
      <Form
        onSubmit={onSubmit}
        // Validation for select form (if nothing is chosen there is an error)
        validate={(values) => {
          const error = {};
          if (!values.type) {
            error.type = "Required";
          }
        }}
        render={({ handleSubmit, form, values, pristine, submitting }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <InputField
              name="name"
              validation={validationObj.required}
              label="Dish Name"
              type="text"
              placeholder="Dish Name"
            />
            <InputField
              name="preparation_time"
              validation={validationObj.required}
              label="Preparation Time"
              type="time"
              step="1"
            />
            <div className={styles.selectField}>
              <label className={styles.typeLabel}>Type</label>
              <Field
                name="type"
                component="select"
                initialValue=" "
                validate={validationObj.required}
                className={selectClasses(values, styles)}
              >
                <option value="" />
                <option value="pizza">🍕 Pizza</option>
                <option value="soup">🍵 Soup</option>
                <option value="sandwich">🥪 Sandwich</option>
              </Field>
              {goodSelectMessage(values, styles)}
              <Error name="type" styles={styles} />
              <OnChange name="type">
                {(selectValue) => {
                  setType(selectValue);
                  resetSpecificValuesOnChange(values, selectValue);
                }}
              </OnChange>
            </div>
            {type === "pizza" && (
              <Fragment>
                <InputField
                  name="no_of_slices"
                  parse={validationObj.parseToNum}
                  validation={validationObj.multipleValidations(
                    validationObj.required,
                    validationObj.minValue(1)
                  )}
                  label="Number of Slices"
                  type="number"
                  placeholder="Number of Slices"
                />
                <InputField
                  name="diameter"
                  parse={validationObj.parseToFloat}
                  validation={validationObj.multipleValidations(
                    validationObj.required,
                    validationObj.minValue(0.1)
                  )}
                  label="Diameter"
                  type="number"
                  step="0.1"
                  placeholder="Diameter"
                />
              </Fragment>
            )}
            {type === "soup" && (
              <Fragment>
                <InputField
                  name="spiciness_scale"
                  parse={validationObj.parseToNum}
                  validation={validationObj.multipleValidations(
                    validationObj.required,
                    validationObj.minValue(1),
                    validationObj.maxValue(10)
                  )}
                  label="Spiciness"
                  type="number"
                  placeholder="1-10"
                />
              </Fragment>
            )}
            {type === "sandwich" && (
              <Fragment>
                <InputField
                  name="slices_of_bread"
                  parse={validationObj.parseToNum}
                  validation={validationObj.multipleValidations(
                    validationObj.required,
                    validationObj.mustBeNumber,
                    validationObj.minValue(1)
                  )}
                  label="Slices of bread required"
                  type="number"
                  placeholder="Bread Slices"
                />
              </Fragment>
            )}
            <div className={styles.buttonsContainer}>
              <button
                type="submit"
                disabled={submitting || pristine}
                className={styles.submitButton}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={form.reset}
                disabled={submitting || pristine}
                className={styles.clearFormButton}
              >
                Clear
              </button>
            </div>
            {requestError && (
              <div className={styles.requestFailedContainer}>
                <p className={styles.requestFailedTitle}>Request Failed!</p>
                <p className={styles.requestFailedMessage}>{requestErrorMsg}</p>
              </div>
            )}
            {requestSuccess && (
              <div className={styles.requestSuccessContainer}>
                <p className={styles.requestSuccessTitle}>
                  {" "}
                  Request Successful!
                </p>
                <p className={styles.requestSuccessMessage}>
                  {JSON.stringify(requestSuccessMessage, 0, 2)}
                </p>
              </div>
            )}
          </form>
        )}
      ></Form>
    </Fragment>
  );
};

export default AddDishForm;
