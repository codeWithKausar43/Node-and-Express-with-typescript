import { Request, Response } from "express";
 
import { userServices } from "./user.services";

const createUser = async (req: Request, res: Response)=>{
const {name, email, age, number} = req.body; 
try{
const result = await userServices.createUser(name, email, age, number)
return res.status(200).json({
  success: true, 
  message: "user created", 
  data: result.rows[0]
})
}catch(error: any){
  return res.status(500).json({
    success: false, 
    message: "user not created", 
    err: error
  })
}
}

const getSingleUser = async(req: Request, res:Response) => {
try{
  const result = await userServices.getSingleUser(req.params.id as string); 
  if(result.rows.length === 0){
    res.status(404).json({
      success: false,
      message: "users not found"
    })}else{
      res.status(200).json({
        success: true, 
        message: "user fetched success", 
        data : result.rows[0]
      })
    }
}catch(err: any){
  res.status(500).json({
    success: false, 
    message: err.message
  })
}
}

const putSingleUser = async(req:Request, res: Response) =>{
  // console.log(req.params.id);
  const {name, email, number} = req.body; 
  try{
    const result =  await userServices.putSingleUser(name, email, number, req.params.id!)
    if(result.rows.length === 0){
      res.status(404).json({
        success: false, 
        message: "user not found"
      })
    } else{
      res.status(200).json({
        sucess: true, 
        message: "user successfully updated", 
        data: result.rows[0]
      })
    }
  }
  catch(err: any){
    res.status(500).json({
      success: false, 
      message: err.message
    })
  }
}

const deleteSingleUser = async(req:Request, res:Response) => {
  // console.log(req.params.id)
try{
const result = await userServices.deleteSingleUser(req.params.id!)
if(result.rowCount === 0){
  res.status(400).json({
    success: false, 
    message: "user not found"
  })
} else(
  res.status(200).json({
    success: true, 
    message: "user successfully delete", 
    data: null
  })
)
}catch(err:any){
  res.status(500).json({
    success: false, 
    message: err.message
  })
}
 }

export const userControllers = {
    createUser, 
    getSingleUser, 
    putSingleUser, 
    deleteSingleUser
}