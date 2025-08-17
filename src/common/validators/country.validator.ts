import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { COUNTRIES } from '../constants/countries';

export function IsValidCountryCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCountryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return COUNTRIES.some(
            (country) => country.code === value.toUpperCase(),
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 3166-1 alpha-2 country code (e.g., US, VN, GB)`;
        },
      },
    });
  };
}
