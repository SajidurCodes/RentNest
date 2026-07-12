import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface ICreateProperty {


  title:string;
  description:string;
  address:string;
  city:string;
  rentAmount:number;
  bedrooms:number;
  bathrooms: number;
  propertyType: string;
  categoryId: string;
}

export interface IUpdateProperty {


  title?: string;
  description?: string;
  address?: string;
  city?: string;
  rentAmount?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

export interface IPropertyQuery extends PropertyWhereInput {


  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}