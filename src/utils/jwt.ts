import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload,secret: string,expiresIn: SignOptions["expiresIn"]) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};



const verifyToken = (token: string, secret: string) => {


  try {

    const decoded = jwt.verify(token, secret);

    return {
      success: true,
      data: decoded,
    };

  } 
  
  catch (error: any) {

    return {
      success: false,
      error: error.message,
    };

    
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};