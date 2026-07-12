import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";










const createRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const tenantId = req.user?.id;
        const payload = req.body;
        const result = await rentalService.createRentalRequest(payload,tenantId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Rental request submitted successfully",
            data: result
        });

    }
);

const getMyRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const tenantId = req.user?.id;
        const result = await rentalService.getMyRentalRequests(tenantId as string);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully",
            data: result
        });

    }
);

const getRentalRequestById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const rentalId = req.params.rentalId;
        if (!rentalId) {
            throw new Error("Rental Id is required");
        }
        const result = await rentalService.getRentalRequestById(rentalId as string);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request retrieved successfully",
            data: result
        });

    }
);

const getLandlordRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const landlordId = req.user?.id;
        const result = await rentalService.getLandlordRentalRequests(
            landlordId as string
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully",
            data: result
        });

    }
);

const approveRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const landlordId = req.user?.id;
        const rentalId = req.params.rentalId;
        if (!rentalId) {
            throw new Error("Rental Id is required");
        }

        const result = await rentalService.approveRentalRequest(
            rentalId as string,
            landlordId as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request approved successfully",
            data: result
        });

    }
);

const rejectRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const landlordId = req.user?.id;
        const rentalId = req.params.rentalId;

        if (!rentalId) {
            throw new Error("Rental Id is required");
        }

        const result = await rentalService.rejectRentalRequest(
            rentalId as string,
            landlordId as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request rejected successfully",
            data: result
        });

    }
);

export const rentalController = {



    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
    getLandlordRentalRequests,
    approveRentalRequest,
    rejectRentalRequest

};