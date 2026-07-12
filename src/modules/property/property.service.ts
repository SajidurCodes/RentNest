import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IPropertyQuery, IUpdateProperty } from "./property.interface";




const createProperty = async (payload: ICreateProperty,landlordId: string) => {

  

  const category = await prisma.category.findUnique({where: {id: payload.categoryId}});

  if (!category) {
    throw new Error("Category not found");
  }

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });


  return result;


};

const updateProperty = async (propertyId: string,payload: IUpdateProperty,landlordId: string) => {

  const property = await prisma.property.findUnique({where: {id: propertyId}});

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property");
  }

  if (payload.categoryId) {

    const category = await prisma.category.findUnique({where: {id: payload.categoryId}});

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },

    data: payload,

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

const deleteProperty = async (propertyId: string,landlordId: string) => {



  const property = await prisma.property.findUnique({where: {id: propertyId}});

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to delete this property");
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return null;
};

const getMyProperties = async (landlordId: string) => {

  const result = await prisma.property.findMany({

    where: {
      landlordId,
    },

    include: {
      category: true,

      landlord: {
        omit: {
          password: true,
        },
      }
    }
  });




  return result;
};

const getAllProperties = async (query: IPropertyQuery) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const andConditions: Prisma.PropertyWhereInput[] =[];

    //Search
    if (query.searchTerm) {

        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    city: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        });

    }

    // City
    if (query.city) {

        andConditions.push({
            city: query.city
        });

    }


    // Category
    if (query.categoryId) {
        andConditions.push({categoryId: query.categoryId});
    }

    // Bedrooms
    if (query.bedrooms) {
        andConditions.push({bedrooms: Number(query.bedrooms)});
    }

    // Bathrooms
    if (query.bathrooms) {
        andConditions.push({bathrooms: Number(query.bathrooms)});
    }

    // Availability
    if (query.isAvailable !== undefined) {

        andConditions.push({
            isAvailable: query.isAvailable.toString() === "true" ? true : false
        });

    }

    // Price Filter
    if (query.minPrice || query.maxPrice) {
        andConditions.push({rentAmount: {
                gte: query.minPrice ? Number(query.minPrice) : undefined,
                lte: query.maxPrice ? Number(query.maxPrice) : undefined
            }
        });

    }

    const whereConditions: Prisma.PropertyWhereInput = {AND: andConditions};

    const properties = await prisma.property.findMany({
        where: whereConditions,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            },
            reviews: true
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }

    });



    const total = await prisma.property.count({where: whereConditions});

    return {
        meta: {page,limit,total,totalPages: Math.ceil(total / limit)},data: properties
    };

};

const getPropertyById = async (propertyId: string) => {

    const result = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        },
        include: {

            category: true,landlord: {
                omit: {
                    password: true
                }
            },
            reviews: {
                include: {
                    tenant: {
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

export const propertyService = {
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    getAllProperties,
    getPropertyById

};