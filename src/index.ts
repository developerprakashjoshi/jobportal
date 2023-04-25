import "reflect-metadata"
import express,{Application,Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
dotenv.config();

import { AppDataSource } from "./config/database";
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import permissionRoutes from './routes/permission';
import roleRoutes from './routes/role';
import { errorHandler, notFound } from "./libs/ErrorHandler";
import sessionMiddleware from "./app/Middlewares/SessionMiddleware";
import passport from "./app/Middlewares/PassportMiddleware";
import {passportJwt} from "./app/Middlewares/PassportJwtMiddleware";


const app: Application=express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }) )
app.use(bodyParser.json())

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())


app.get('/api/demo',(req:Request,res:Response)=>{
    console.log(req.isAuthenticated())
    const jwtPayload = { id: 1};
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY||'');
    res.json({token:token})
});

app.get('/api/test',passportJwt,(req:Request,res:Response)=>{
    res.json("test")
})

app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/permission',permissionRoutes);
app.use('/api/role',roleRoutes);

app.get("/",(req:Request,res:Response)=>res.send("Hello from Server"))
app.use(notFound)
app.use(errorHandler)

AppDataSource.initialize().
then(()=>{
    console.log("DB connected");
    app.listen(process.env.APP_PORT,()=>{
        console.log(`Server started with port ${process.env.APP_HOST}:${process.env.APP_PORT}`)
    })  
})
.catch((err)=>console.log("ERROR",err));