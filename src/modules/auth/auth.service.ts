import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { SignOptions } from "jsonwebtoken";




const registerUser = async (payload: IRegisterUser) => {

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });



  if (isUserExists) {
    throw new Error("User already exists.");
  }



  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );



  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },

    omit: {
      password: true,
    },
  });



  return result;



};



const loginUser = async (payload: ILoginUser) => {


  const user = await prisma.user.findUnique({



    where: {
      email: payload.email,
    },
  });



  if (!user) {
    throw new Error("User not found.");
  }



  if (user.isBanned) {
    throw new Error("Your account has been banned.");
  }



  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );


  if (!isPasswordMatched) {
    throw new Error("Incorrect password.");
  }


  const accessToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwt_access_secret,
    {
      expiresIn: config.jwt_access_expires_in as SignOptions["expiresIn"],
    }
  );

  const refreshToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwt_refresh_secret,
    {
      expiresIn: config.jwt_refresh_expires_in as SignOptions["expiresIn"],
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (userId: string) => {

  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    omit: {
      password: true,
    },
  });

  return result;
};



export const authService = {
  registerUser,
  loginUser,
  getMe,
};