import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";




const createReview = async (payload: ICreateReview,tenantId: string) => {



    const property = await prisma.property.findUnique({where:{
            id:payload.propertyId}});

    if(!property){
        throw new Error("Property not found!!!!");
    }


    const result = await prisma.review.create({data:{
            tenantId,
            propertyId:payload.propertyId,
            rating:payload.rating,
            comment:payload.comment
        },
        include:{
            tenant:{
                omit:{
                    password:true
                }
            },
            property:true
        }
    });

    return result;

};

const getPropertyReviews = async (propertyId:string)=>{

    const result=await prisma.review.findMany({
        where:{
            propertyId
        },
        include:{
            tenant:{
                omit:{
                    password:true
                }
            }

        },
        orderBy:{
            createdAt:"desc"
        }
    });
    return result;

};





export const reviewService={
    createReview,
    getPropertyReviews
};