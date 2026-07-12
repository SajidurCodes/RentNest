import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";





const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const result = await paymentService.createPayment(
            req.body,
            {
                id: req.user?.id as string,
                email: req.user?.email as string
            }
        );



        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Stripe checkout session created successfully!!🥳🥳🥳",
            data: result
        });




    }
);

const confirmPayment = catchAsync(
    async (req: Request, res: Response) => {

        const signature = req.headers["stripe-signature"] as string;

        await paymentService.webhook(
            req.body,
            signature
        );

        res.status(200).json({
            received: true
        });

    }
);

const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const tenantId = req.user?.id;
        const result = await paymentService.getMyPayments(tenantId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payments retrieved successfully",
            data: result.data,
        });





    }
);




const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const paymentId = req.params.paymentId;
        const tenantId = req.user?.id;
        const result = await paymentService.getPaymentById(
            paymentId as string,
            tenantId as string
        );




        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment retrieved successfully",
            data: result
        });

    }
);




export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getPaymentById

};