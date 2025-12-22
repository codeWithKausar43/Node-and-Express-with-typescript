 import initDB from "./config/db";
import config from "./config/index"
import express, { Request, Response} from "express"; 
import logger from "./middleware/logger";
import { usersRoutes } from "./modules/user/user.routes";
import { todoRouters } from "./modules/todo/todo.routers";
 
const app = express()
const port = config.port; 

// body perser
app.use(express.json())

//initializing DB
initDB()
 
app.get("/", logger, (req: Request, res: Response) =>{
  res.send("Hello kausar");
})

// users CRUD
app.use("/users", usersRoutes)

//todos CRUD 
app.use("/todos", todoRouters)
 
// page not found
app.use((req, res) => {
  res.status(404).json({
    success: false, 
    message: "Route Not Found", 
    Route: req.path,
  })
})

app.listen(port, () => {
  console.log(`I am running now ${port}`)
})
