import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, options?: SignOptions) => {
  const token = jwt.sign(payload, secret, options);
  return token;
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