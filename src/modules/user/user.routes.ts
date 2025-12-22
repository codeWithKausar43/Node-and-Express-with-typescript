import { Router } from "express"
import { userControllers } from "./user.controller";
const router = Router()

router.post("/", userControllers.createUser); 

router.get("/:id", userControllers.getSingleUser); 

router.put("/:id", userControllers.putSingleUser); 

router.delete("/:id", userControllers.deleteSingleUser); 

export const usersRoutes = router; 