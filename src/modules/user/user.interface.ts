import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUpdateUser {

  name?: string;
  phone?: string;


}

export interface IUserQuery extends UserWhereInput {


  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}