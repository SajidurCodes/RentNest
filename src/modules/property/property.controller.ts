import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { propertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const landlordId = req.user?.id;
        const payload = req.body;
        const result = await propertyService.createProperty(payload,landlordId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Property created successfully",
            data: result
        });

    }
);

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await propertyService.getAllProperties(query);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Properties retrieved successfully",
            data: result.data,
            meta: result.meta
        });

    }
);

const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const propertyId = req.params.propertyId;

        if (!propertyId) {
            throw new Error("Property Id is required");
        }

        const result = await propertyService.getPropertyById(propertyId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property retrieved successfully!!!!",
            data: result
        });

    }
);

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const landlordId = req.user?.id;
        const propertyId = req.params.propertyId;


        if (!propertyId) {
            throw new Error("Property Id is required");
        }

        const payload = req.body;

        const result = await propertyService.updateProperty(
            propertyId as string,
            payload,
            landlordId as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property updated successfully",
            data: result
        });

    }
);

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const landlordId =req.user?.id;
        const propertyId= req.params.propertyId;

        if (!propertyId) {
            throw new Error("Property Id is required");
        }

        await propertyService.deleteProperty(
            propertyId as string,
            landlordId as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property deleted successfully",
            data: null
        });

    }
);

const getMyProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const landlordId = req.user?.id;
        const result = await propertyService.getMyProperties(landlordId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "My properties retrieved successfully!!!!!!!!!!!!",
            data: result
        });

    }
);

export const propertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getMyProperties

};