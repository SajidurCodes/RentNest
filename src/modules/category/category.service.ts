import { prisma } from "../../lib/prisma";
import { ICreateCategory, IUpdateCategory } from "./category.interface";





const createCategory=async(payload:ICreateCategory)=>{



    const category=await prisma.category.findUnique({

        where:{
            name:payload.name
        }

    });



    if(category){

        throw new Error("Category already exists");

    }

    const result=await prisma.category.create({

        data:payload

    });

    return result;




}





const getAllCategories=async()=>{



    const result=await prisma.category.findMany({

        orderBy:{
            createdAt:"desc"
        }

    });

    return result;

}




const getCategoryById=async(id:string)=>{

    const result=await prisma.category.findUniqueOrThrow({

        where:{
            id
        }

    });

    return result;

}




const updateCategory=async(id:string,payload:IUpdateCategory)=>{

    const result=await prisma.category.update({

        where:{
            id
        },

        data:payload

    });

    return result;

}




const deleteCategory=async(id:string)=>{

    await prisma.category.delete({

        where:{
            id
        }

    });

}




export const categoryService={

    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

}