// Put validation functions here because I like to make my components as clear as possible

export const validationObj = {
  required: (value) => (value ? undefined : "Required"),

  minValue: (min) => (value) =>
    isNaN(value) || value >= min ? undefined : `Value needs to be positive`,

  maxValue: (max) => (value) =>
    isNaN(value) || value <= max ? undefined : `Can't be larger than ${max}`,

  maxLength: (max) => (value) =>
    isNaN(value) || value.toString().split("").length <= max
      ? undefined
      : `${max} characters max`,

  maxSafeIntegerValue: (value) =>
    isNaN(value) || value <= Number.MAX_SAFE_INTEGER
      ? undefined
      : `Woops, that's too much ;).`,

  mustBeNumber: (value) => (isNaN(value) ? "Must be a number" : undefined),

  parseToNum: (value) => (isNaN(parseInt(value)) ? "" : parseInt(value)),

  parseToFloat: (value) => (isNaN(parseFloat(value)) ? "" : parseFloat(value)),

  multipleValidations:
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      ),
};

export const generateUniqueId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

// With some docs and possible status codes this could be expanded

export const errorByRequestStatus = (error, setError) => {
  if (error.response.status === 400) {
    let obj = error.response.data;
    for (const key in obj) {
      if (key === "type") {
        setError(`${capitalizeFirstLetterInString(obj[key])}`);
      } else {
        setError(
          `${capitalizeFirstLetterInString(key).replace("_", " ")}: ${obj[key]}`
        );
      }
    }
  } else if (error.response.status >= 500) {
    setError(
      "Internal server error, sorry we are having issues. Please try again later"
    );
  }
};

export const setError = (obj, error, setError) => {
  for (const key in obj) {
    setError(obj[key] ?? error.message);
  }
};

const capitalizeFirstLetterInString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
