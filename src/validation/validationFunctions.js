// Put validation functions here because I like to make my components as clear as possible

export const validationObj = {
  required: (value) => (value ? undefined : "Required"),

  minValue: (min) => (value) =>
    isNaN(value) || value >= min ? undefined : `Value needs to be positive`,

  maxValue: (max) => (value) =>
    isNaN(value) || value <= max ? undefined : `Can't be larger than ${max}`,

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
