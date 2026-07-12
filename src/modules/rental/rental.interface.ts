import { RentalRequestWhereInput } from "../../../generated/prisma/models";

export interface ICreateRentalRequest {
    propertyId: string;
    moveInDate: Date;
    duration: number;
    message?: string;
}

export interface IUpdateRentalRequest {
    status?: "APPROVED" | "REJECTED";
}

export interface IRentalQuery extends RentalRequestWhereInput {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;

}