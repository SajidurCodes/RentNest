import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";




const registerUser = catchAsync(async (req: Request, res: Response) => {

  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });


});

const loginUser = catchAsync(async (req: Request, res: Response) => {



  const result = await authService.loginUser(req.body);


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result,
  });


});

const getMe = catchAsync(async (req: Request, res: Response) => {


  const userId = req.user?.id;

  const result = await authService.getMe(userId as string);



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });


  
});

export const authController = {
  registerUser,
  loginUser,
  getMe,
};