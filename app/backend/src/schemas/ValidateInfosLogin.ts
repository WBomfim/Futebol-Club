import * as Joi from 'joi';
import ReturnError from '../interfaces/ReturnError';
import Login from '../interfaces/Login';

export default class ValidateInfosLogin {
  private static messageEmpty = '400|All fields must be filled';

  private static schemaEmail = Joi.string().email().required().messages({
    'string.empty': this.messageEmpty,
    'any.required': this.messageEmpty,
    'string.email': '400|Email not valid format',
  });

  private static schemaPassword = Joi.string().min(6).required().messages({
    'string.min': '400|Password must be at least 6 characters',
    'string.empty': this.messageEmpty,
    'any.required': this.messageEmpty,
  });

  public static validate(infos: Login): ReturnError | false {
    const schema = Joi.object({
      email: this.schemaEmail,
      password: this.schemaPassword,
    });

    const { error } = schema.validate(infos);

    if (error) {
      const [code, message] = error.details[0].message.split('|');
      return { error: { code: Number(code), error: { message } } };
    }

    return false;
  }
}
