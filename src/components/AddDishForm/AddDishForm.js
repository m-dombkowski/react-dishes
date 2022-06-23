import { Field, Form } from "react-final-form";
import styles from "./AddDishForm.module.css";
import { Fragment, useState } from "react";
import { OnChange } from "react-final-form-listeners";
import InputField from "../InputField/InputField";
import { validationObj } from "../../validation/validationFunctions";

const AddDishForm = (props) => {
  const [type, setType] = useState(null);
  const [typeSpecific, setTypeSpecific] = useState({
    pizza: {
      numOfSlices: undefined,
      diameter: undefined,
    },
    soup: {
      spiciness_scale: undefined,
    },
    sandwich: {
      numOfBreadSlices: undefined,
    },
  });

  // this one seems better and more "universal" but doesn't really work with React Final Form values object.
  // Would need to make separate states for each input and later somehow merge them into one big object

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

  const onSubmit = (values, event) => {
    event.preventDefault();
    alert(values);
  };

  // works but code quality is tragic. No idea how to make it better with React Final Form values object
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

  const Error = ({ name }) => (
    <Field name={name} subscription={{ error: true, touched: true }}>
      {({ meta: { error, touched } }) =>
        error && touched ? <span>{error}</span> : null
      }
    </Field>
  );

  return (
    <Form
      onSubmit={onSubmit}
      // Validation for select form (if nothing is chosen there is an error)
      validate={(values) => {
        const error = {};
        if (!values.type) {
          error.type = "Required";
        }
      }}
      render={({ submitHandler, form, values, submitting }) => (
        <form className={styles.form} onSubmit={submitHandler}>
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

          <div>
            <label>Type</label>
            <Field
              name="type"
              component="select"
              validate={validationObj.required}
            >
              <option />
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="sandwich">Sandwich</option>
            </Field>
            <Error name="type" />
            <OnChange name="type">
              {(selectValue) => {
                setType(selectValue);
                resettingOtherTypes(values, selectValue);
                resetSpecificValuesOnChange(values, selectValue);
              }}
            </OnChange>
          </div>
          {type === "pizza" && (
            <Fragment>
              <InputField
                name="no_of_slices"
                validation={validationObj.required}
                label="Number of Slices"
                type="number"
                placeholder="Number of Slices"
              />
              <OnChange name="no_of_slices">
                {(inputValue) => {
                  setTypeSpecific((prevState) => ({
                    ...prevState,
                    pizza: {
                      ...prevState.pizza,
                      numOfSlices: inputValue,
                    },
                  }));
                }}
              </OnChange>
              <InputField
                name="diameter"
                validation={validationObj.required}
                label="Diameter"
                type="number"
                step="0.1"
                placeholder="Diameter"
              />
              <OnChange name="diameter">
                {(inputValue) => {
                  setTypeSpecific((prevState) => ({
                    ...prevState,
                    pizza: { ...prevState.pizza, diameter: inputValue },
                  }));
                }}
              </OnChange>
            </Fragment>
          )}
          {type === "soup" && (
            <Fragment>
              <InputField
                name="spiciness_scale"
                validation={validationObj.multipleValidations(
                  validationObj.required,
                  validationObj.mustBeNumber,
                  validationObj.minValue(1),
                  validationObj.maxValue(10)
                )}
                label="Spiciness"
                type="number"
                placeholder="1-10"
              />

              <OnChange name="spiciness_scale">
                {(inputValue) => {
                  setTypeSpecific((prevState) => ({
                    ...prevState,
                    soup: {
                      ...prevState.soup,
                      spiciness_scale: inputValue,
                    },
                  }));
                }}
              </OnChange>
            </Fragment>
          )}
          {type === "sandwich" && (
            <Fragment>
              <InputField
                name="slices_of_bread"
                validation={validationObj.multipleValidations(
                  validationObj.required,
                  validationObj.mustBeNumber
                )}
                label="Number of slices of bread required"
                type="number"
                placeholder="Bread Slices"
              />
              <OnChange name="slices_of_bread">
                {(inputValue) => {
                  setTypeSpecific((prevState) => ({
                    ...prevState,
                    sandwich: {
                      ...prevState.bread,
                      numOfBreadSlices: inputValue,
                    },
                  }));
                }}
              </OnChange>
            </Fragment>
          )}
          <div>
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button type="button" disabled={submitting} onClick={form.reset}>
              Clear
            </button>
          </div>

          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    ></Form>
  );
};

export default AddDishForm;
