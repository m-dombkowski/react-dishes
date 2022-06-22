import { Field, Form } from "react-final-form";
import styles from "./AddDishForm.module.css";
import { Fragment, useState } from "react";
import { OnChange } from "react-final-form-listeners";

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

  const resettingOtherTypes = (obj, selectedType) => {
    for (const key in obj) {
      if (key !== selectedType) {
        for (const innerKey in obj[key]) {
          console.log(obj[key]);
          if (obj[key][innerKey]) {
            obj[key][innerKey] = undefined;
          }
        }
      }
    }
  };

  //   const secondLoop = (values) => {
  //     values.no_of_slices = typeSpecific.pizza.numOfSlices;
  //     values.spiciness_scale = undefined;
  //     values.diameter = undefined;
  //     values.slices_of_bread = undefined;
  //   };

  const required = (value) => (value ? undefined : "Required");

  const onSubmit = (values) => {
    setTimeout(window.alert(JSON.stringify(values, 0, 2)), 300);
  };

  const minValue = (min) => (value) =>
    isNaN(value) || value >= min ? undefined : `Must be greater than ${min}`;

  const maxValue = (max) => (value) =>
    isNaN(value) || value <= max ? undefined : `Must be smaller than ${max}`;

  const mustBeNumber = (value) =>
    isNaN(value) ? "Must be a number" : undefined;

  const multipleValidations =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  // works but code quality is tragic
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

  return (
    <Form
      onSubmit={onSubmit}
      render={({ submitHandler, form, values }) => (
        <form className={styles.form} onSubmit={submitHandler}>
          <div>
            <Field name="name" validate={required}>
              {({ input, meta }) => (
                <div>
                  <label>Dish name</label>
                  <input {...input} type="text" placeholder="Dish Name" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>
          <div>
            <Field name="preparation_time" validate={required}>
              {({ input, meta }) => (
                <div>
                  <label>Preparation Time</label>
                  <input {...input} type="time" step="1" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>
          <div>
            <label>Type</label>
            <Field name="type" component="select" validate={required}>
              <option />
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="sandwich">Sandwich</option>
            </Field>

            <OnChange name="type">
              {(selectValue) => {
                setType(selectValue);
                resetSpecificValuesOnChange(values, selectValue);
              }}
            </OnChange>
          </div>
          {type === "pizza" && (
            <Fragment>
              <Field name="no_of_slices" validate={required}>
                {({ input, meta }) => (
                  <div>
                    <label>Number of Slices</label>
                    <input
                      {...input}
                      type="number"
                      placeholder="Number of Slices"
                    />

                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
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
              <Field name="diameter" validate={required}>
                {({ input, meta }) => (
                  <div>
                    <label>Diameter</label>
                    <input
                      {...input}
                      type="number"
                      step="0.1"
                      placeholder="Diameter"
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
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
              <Field
                name="spiciness_scale"
                validate={multipleValidations(
                  required,
                  mustBeNumber,
                  minValue(1),
                  maxValue(10)
                )}
              >
                {({ input, meta }) => (
                  <div>
                    <label>Spiciness</label>
                    <input {...input} type="number" placeholder="1-10" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
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
              <Field
                name="slices_of_bread"
                validate={multipleValidations(required, mustBeNumber)}
              >
                {({ input, meta }) => (
                  <div>
                    <label>Number of slices of bread required</label>
                    <input
                      {...input}
                      type="number"
                      placeholder="Bread Slices"
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
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

          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    ></Form>
  );
};

export default AddDishForm;
