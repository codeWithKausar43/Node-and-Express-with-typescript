import { Router } from "express";
import { todoController } from "./todo.controller";
 

const router = Router()

router.post("/", todoController.createdTodo); 

router.get("/", todoController.getTodos);

router.get("/:id", todoController.getSingleTodo); 

router.put("/:id", todoController.putTodo); 

router.delete("/:id", todoController.deleteTodo); 

export const todoRouters = router; 