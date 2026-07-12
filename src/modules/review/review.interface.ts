import { ReviewWhereInput } from "../../../generated/prisma/models";

export interface ICreateReview {



    propertyId: string;
    rating: number;
    comment: string;
}



export interface IReviewQuery extends ReviewWhereInput {
    page?: string;
    limit?: string;
}