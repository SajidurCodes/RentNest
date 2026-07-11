import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";



declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}




export const auth = (...requiredRoles:Role[]) => {


  return catchAsync(

    async (req: Request, res: Response, next: NextFunction) => {

      const token =
        req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization;



      if (!token) {
        throw new Error("Please login first.");
      }



      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret
      );



      if (!verifiedToken.success) {
        throw new Error(verifiedToken.error);
      }



      const { id, email, name, role } =
        verifiedToken.data as JwtPayload;



      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });



      if (!user) {
        throw new Error("User not found.");
      }



      if (user.isBanned) {
        throw new Error("Your account has been banned.");
      }



      if (requiredRoles.length && !requiredRoles.includes(user.role)){



        throw new Error("You are not authorized.");

        
      }




      req.user = {
        id,
        email,
        name,
        role,
      };

      next();
    }
  );
};