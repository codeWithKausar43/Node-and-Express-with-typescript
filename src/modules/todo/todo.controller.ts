import { Request, Response } from "express";
import { todosServices } from "./todo.services";

const createdTodo = async(req: Request, res: Response) => {
  const {user_id, title} = req.body; 
  try{
const result = await todosServices.createdTodo(user_id, title);
res.status(201).json({
  success: true,
  message: "todos succfully created", 
  data: result.rows[0]
})
  }catch(error : any){
    res.status(501).json({
      success: false, 
      message:"todos not created",
      err: error.message
    })
  }
}

const getTodos = async(req: Request, res:Response) =>{
try{
const result = await todosServices.getAllTodos();
res.status(200).json({
  success: true, 
  message: "todos successfully find", 
data: result.rows
})
  }catch(error:any){
    res.status(500).json({
      success: false, 
      message: "todos not found",  
    })
  }
}

const putTodo = async(req:Request, res: Response) => {
  const {user_id, title, description} = req.body; 
  try{
    const result = await todosServices.putSingleTodo(user_id, title, description, req.params.id!)
    if(result.rows.length === 0){
      res.status(501).json({
        success: false, 
        message: "todos not found", 
      })
    }else{
      res.status(200).json({
        success: true, 
        message: "todo successfully updatede", 
        data: result.rows[0]
      })
    }
  }catch(err: any){
    res.status(500).json({
      success:false, 
      message: err.message

    })
  }
}

const deleteTodo = async(req:Request, res:Response) => {
  try{
    const result =  await todosServices.deleteSingleTodo(req.params.id as string)
    // console.log(result);
     if(result.rowCount === 0){
      res.status(501).json({
        success: false, 
        message: "todos not found"
      })
     }else{
      res.status(200).json({
        success: true, 
        message: "todo delete successfully delete", 
        data: null
      })
     }
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: err.messagge
    })
  }
}

const getSingleTodo = async(req: Request, res: Response) => {
  try{
    const result = await todosServices.getSingleTodo(req.params.id!)
    res.status(201).json({
      success: true, 
      message: "successfully todo find",
      data: result.rows[0]
    })
  }catch(error: any){
    res.status(500).json({
      success: false, 
      message: "todo not found", 
      error: error.message, 
      err: error
    })
  }
}

export const todoController = {
    createdTodo, 
    getTodos, 
    putTodo, 
    deleteTodo, 
    getSingleTodo
}