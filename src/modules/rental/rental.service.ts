
import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest } from "./rental.interface";

const createRentalRequest = async (payload: ICreateRentalRequest,tenantId: string) => {

    const property = await prisma.property.findUnique({where: {id: payload.propertyId}});

    if (!property) {
        throw new Error("Property not found!!!😔😔😔");
    }

   

    if (!property.isAvailable) {
        throw new Error("Property is not available!!!!😔😔");
    }

    

    if (property.landlordId === tenantId) {
        throw new Error("You cannot rent your own property!!!");
    }


    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
            status: RentalStatus.PENDING
        }
    });

    if (existingRequest) {
        throw new Error("You already have a pending request for this property!!!🙂");
    }

    const result = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            moveInDate: new Date(payload.moveInDate),
            duration: payload.duration,
            status: RentalStatus.PENDING
        },
        include: {
            tenant: {omit: {
                    password: true
                }
            },
            property: {include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true
                        }
                    }
                }
            }

        }

    });

    return result;

};




const getMyRentalRequests = async (tenantId: string) => {

    const result = await prisma.rentalRequest.findMany({
        where: {
            tenantId
        },
        include: {
            property: {
                include: {
                    category: true,
                landlord: {omit: {
                            password: true
                        }
                    }

                }

            }

        },orderBy: {
            createdAt: "desc"
        }

    });

    return result;

};

const getRentalRequestById = async (rentalId: string) => {

    const result = await prisma.rentalRequest.findUniqueOrThrow({
        where: {id: rentalId},
        include: {
            tenant: {
                omit: {
                    password: true
                }
            },property: {
                include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true
                        }
                    }
                }
            }
        }
    });

    return result;




};

const getLandlordRentalRequests = async (landlordId: string) => {


    const result = await prisma.rentalRequest.findMany({
        where: {property: {landlordId}
        },
        include: {
            tenant: {
                omit: {password: true
                }
            },
            property: {include: {
                    category: true,
                    landlord: {omit: {
                            password: true
                        }
                    }
                }
            }
        },orderBy: {
            createdAt: "desc"}

    });
    return result;

};

const approveRentalRequest = async (rentalId: string,landlordId: string) =>{

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalId
        },include: {property: true}});

    if (!rentalRequest) {
        throw new Error("Rental request not found");
    }

  
    if (rentalRequest.property.landlordId !== landlordId) {
        throw new Error("You are not authorized, Hehehe!!!");
    }
    if (rentalRequest.status !== RentalStatus.PENDING) {
        throw new Error("Rental request is already processed!!!!");
    }



    const result = await prisma.rentalRequest.update({
            where:{
                id:rentalId
            },
            data:{
                status:RentalStatus.APPROVED
            },
            include:{
                tenant:{omit:{password:true}
                },
                property:{
                    include:{
                        category:true
                    }
                }

            }
        });
    

    return result;

};

const rejectRentalRequest = async (rentalId:string,landlordId:string)=>{

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where:{
            id:rentalId
        },
        include:{
            property:true
        }
    });

    if(!rentalRequest){
        throw new Error("Rental request not found!!!");
    }

    if(rentalRequest.property.landlordId!==landlordId){
        throw new Error("You are not authorized!!!😊");
    }

    if(rentalRequest.status!==RentalStatus.PENDING){
        throw new Error("Rental request already processed");
    }

    const result=await prisma.rentalRequest.update({
        where:{id:rentalId},
        data:{status:RentalStatus.REJECTED},
        include:{
            tenant:{
                omit:{
                    password:true
                }
            },
            property:{
                include:{
                    category:true
                }
            }
        }
    });

    return result;

};






export const rentalService={
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
    getLandlordRentalRequests,
    approveRentalRequest,
    rejectRentalRequest

};