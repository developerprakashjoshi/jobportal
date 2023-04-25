import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { SessionData } from 'express-session';



import UserService from '../Services/UserService'
import passport from '../Middlewares/PassportMiddleware'
import Controller from "../../libs/Controller";

export default class  AuthController extends Controller {
  static async signup(req: Request, res: Response,next:NextFunction) {
  const data=req.body
  let userService=new UserService();
  const result = await userService.create(data)
  res.json(result)
}

static async loginSession(req: Request, res: Response,next:NextFunction)  {
  passport.authenticate('local', (err:any, user:any, info:any, status:any) =>{
    if (err) { return next(err) }
    if (!user) { 
        return res.status(401).json({message:info.message}) 
    }
    req.login(user, (err) => {
      if (err) {throw err}
        return res.status(201).json({user})
    });
  })(req, res, next);
}

static async login(req: Request, res: Response,next:NextFunction)  {
  const data=req.body
  let userService=new UserService();
  const result = await userService.retrieveByMobileAndPassword(data.mobile_prefix,data.mobile_phone,data.password)
  res.json(result)
}

static async sendOtp(req: Request, res: Response,next:NextFunction)  {
  const data=req.body
  let userService=new UserService();
  const result = await userService.sendOtp(data.mobile_phone)
  res.json(result)
}
static async verifyOtp(req: Request, res: Response,next:NextFunction)  {
  const data=req.body
  let userService=new UserService();
  const result = await userService.verifyOtp(data.code,data.session_key)
  res.json(result)
}

static async logout(req: Request, res: Response,next:NextFunction)  {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy((err)=>{
      res.clearCookie('connect.sid')
      return res.status(204).end()
    })
    
  });
}

static async me(req: Request, res: Response,next:NextFunction) {
  console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
      return res.status(200).json({user:req.user})
    }else{
      return res.status(401).json({user:null})
    }
}
}
