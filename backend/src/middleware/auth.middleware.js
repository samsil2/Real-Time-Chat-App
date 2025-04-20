import jwt from "jsonwebtoken";
import User from "../models/user.models";

export const protectRoute = async (req, res, next) => {

  try{
    const token = req.cookies.jwt;

  }

  catch(error){

  }

}
 