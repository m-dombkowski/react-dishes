// Put validation functions here because I like to make my components as clear as possible

export const validationObj = {
  required: (value) => (value ? undefined : "Required"),
  minValue: (min) => (value) =>
    isNaN(value) || value >= min ? undefined : `Must be greater than ${min}`,
  maxValue: (max) => (value) =>
    isNaN(value) || value <= max ? undefined : `Must be smaller than ${max}`,
  mustBeNumber: (value) => (isNaN(value) ? "Must be a number" : undefined),

  multipleValidations:
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      ),
};
