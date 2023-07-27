import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema,ArraySchema } from 'joi';

const validator = (schema: ObjectSchema<any> | ArraySchema<any>) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      let validated;
      if (Array.isArray(schema.describe().items)) {
         validated = await schema.validateAsync(req.body);
      } else {
         validated = await schema.validateAsync({ ...req.body, ...req.params });
      }
      req.body = validated;
      next();
    } catch (error: any) {
      if (error.isJoi){
        let message={
            success: false,
            statusCode: 422,
            error
        }
        message.error=error.details.map((msg:any)=>{
          return msg
        })
        return res.status(message.statusCode).json( message);
      }
        
      next(error);
    }
  };
};
export default validator;