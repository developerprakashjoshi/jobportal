import { Request, Response, NextFunction } from 'express'

import Validators from '../Validators'

export const Validator= (schema:string) =>{
    if(!Validators.hasOwnProperty(schema))
        throw new Error(`'${schema}' validator is not exist`)

    return async function(req: Request, res: Response, next:NextFunction) {
        try {
            type ObjectKey=keyof typeof Validators
            let schemaName=schema as ObjectKey
            const validated = await Validators[schemaName].validateAsync({...req.body, ...req.params })
            req.body = validated
            next()
        } catch (error:any) {
            if(error.isJoi) 
                return next(res.status(422).json({message: error.details}))
            next(res.status(500))
        }
    }
}