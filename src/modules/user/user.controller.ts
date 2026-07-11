import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";




const getMyProfile = catchAsync(async (req, res) => {

  const id = req.user?.id;

  const result = await userService.getMyProfile(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });


});



const updateProfile = catchAsync(async (req, res) => {


  const id = req.user?.id;

  const result = await userService.updateProfile(id as string,req.body);



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });


});




const getAllUsers = catchAsync(async (req, res) => {



  const result = await userService.getAllUsers(req.query);


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });


});



const banUser = catchAsync(async (req, res) => {



  const id = req.params.userId;

  const result = await userService.updateUserStatus(id as string,true);



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User banned successfully",
    data: result,
  });



});

const unbanUser = catchAsync(async (req, res) => {
  const id = req.params.userId;

  const result = await userService.updateUserStatus(id as string,false);



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User unbanned successfully",
    data: result,
  });


});

export const userController = {


  getMyProfile,
  updateProfile,
  getAllUsers,
  banUser,
  unbanUser,
};