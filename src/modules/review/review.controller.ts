import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";



const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const tenantId = req.user?.id;
        const result = await reviewService.createReview(req.body,tenantId as string);

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Review submitted successfully",
            data:result
        });

    }
);




const getPropertyReviews = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{


    
        const propertyId=req.params.propertyId;
        const result=await reviewService.getPropertyReviews(propertyId as string);

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Reviews retrieved successfully",
            data:result
        });

    }
);

export const reviewController={
    createReview,
    getPropertyReviews
};