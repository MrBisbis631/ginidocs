import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Ensures one property confirms/matches another.
 * @param relatedProperty - The key of the property to match (autocomplete-safe).
 * @param validationOptions - Optional validation options.
 */
export function Confirm<T extends object>(
  relatedProperty: keyof T,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (obj: T, propertyName: string) => {
    registerDecorator({
      name: 'confirm',
      target: obj.constructor,
      propertyName,
      constraints: [relatedProperty],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const relatedProperty = args.constraints[0] as keyof T;
          const relatedValue = (args.object as T)[relatedProperty];
          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return false;
          }
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match ${args.constraints[0]}`;
        },
      },
    });
  };
}
