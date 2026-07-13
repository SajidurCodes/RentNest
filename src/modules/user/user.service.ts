import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IUpdateUser, IUserQuery } from "./user.interface";





const getMyProfile = async (userId: string) => {



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



const updateProfile = async (userId: string,payload: IUpdateUser) =>{


  const result = await prisma.user.update({
    where: {
      id: userId,
    },

    data: payload,

    omit: {
      password: true,
    },
  });

  return result;


};





const getAllUsers = async (query: IUserQuery) => {



  const page = query.page ? Number(query.page) : 1;

  const limit = query.limit ? Number(query.limit) : 10;

  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";

  const sortOrder = query.sortOrder || "desc";


  const andConditions: Prisma.UserWhereInput[] = [];


  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }


  if (query.role) {
    andConditions.push({
      role: query.role,
    });
  }



  if (query.isBanned !== undefined) {
    andConditions.push({isBanned: query.isBanned});
  }



  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },

    omit: {
      password: true,
    },

    take: limit,
    skip,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: users,

    meta: {
      page,
      limit,
      total,
      totalPages:Math.ceil(total/limit),
    },
  };
};




const updateUserStatus = async (userId: string,isBanned: boolean) => {



  const result = await prisma.user.update({


    where: {
      id: userId,
    },

    data: {
      isBanned,
    },

    omit: {
      password: true,
    },
  });

  return result;


};



export const userService = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  updateUserStatus,
};