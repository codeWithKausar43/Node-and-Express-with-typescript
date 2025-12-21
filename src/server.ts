import express, {NextFunction, Request, Response} from "express"; 
import {Pool} from "pg"; 
import dotenv from "dotenv"; 
import path from "path"; 

dotenv.config({ path: path.join(process.cwd(), ".env")});

const app = express()
const port = 5000

// body perser
app.use(express.json())

//Database
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async() => {
  await pool.query(`
     CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY, 
     name VARCHAR(150) NOT NULL, 
     email VARCHAR(200) UNIQUE NOT NULL, 
     age INT, 
     number VARCHAR(20), 
     address TEXT, 
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW() 
     )
    `); 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY, 
      user_id INT REFERENCES users(id) ON DELETE CASCADE, 
      title VARCHAR(200) NOT NULL,
      description TEXT, 
      completed BOOLEAN DEFAULT FALSE, 
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW() 
      )
      `)
}


initDB()
 
// middle  
const logger = (req:Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next()
}

app.get("/", logger, (req: Request, res: Response) =>{
  res.send("Hello kausar");
})

// users CRUD
app.post("/users", async (req: Request, res: Response)=>{
const {name, email, age, number} = req.body; 

try{
const result = await pool.query(`INSERT INTO users(name, email, number, age) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, number, age])
return res.status(200).json({
  success: true, 
  message: "user created", 
  data: result.rows
})
}catch(error: any){
  return res.status(500).json({
    success: false, 
    message: "user not created", 
    err: error
  })
}
})

app.get("/users", async(req: Request, res: Response) => {
  try{
    const result = await pool.query(`SELECT * FROM users`)
    res.status(201).json({
      success: true, 
      message: "successfully used data find", 
      data: result.rows
    })
  }catch(err: any){
    res.status(500).json({
      success: false, 
      message: err.message, 
    })
  }
})

app.get("/users/:id", async(req: Request, res:Response) => {
try{
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])

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
})

app.put("/users/:id", async(req:Request, res: Response) =>{
  // console.log(req.params.id);
  const {name, email, number} = req.body; 
  try{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, number=$3 WHERE id=$4 RETURNING *`, [name, email, number, req.params.id]); 
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
})

app.delete("/users/:id", async(req:Request, res:Response) => {
  // console.log(req.params.id)
try{
const result = await pool.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
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
 })

// todos 
app.post("/todos", async(req: Request, res: Response) => {
  const {user_id, title} = req.body; 
  try{
const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]); 
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
})

app.get("/todos", async(req: Request, res:Response) =>{
  try{
  const result = await pool.query(`SELECT * FROM todos`)
res.status(200).json({
  success: true, 
  message: "todos successfully find", 
data: result.rows[0]
})
  }catch(error:any){
    res.status(500).json({
      success: false, 
      message: "todos not found",  
    })
  }
})

app.get("/todos/:id", async(req: Request, res: Response) => {
  try{
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id])
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
})


app.put("/todos/:id", async(req:Request, res: Response) => {
  const {user_id, title, description} = req.body; 
  try{
    const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2, description=$3 WHERE id=$4 RETURNING *`, [user_id, title, description, req.params.id])
    console.log(result);
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
})

app.delete("/todos/:id", async(req:Request, res:Response) => {
  try{
    const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [req.params.id]); 
    // console.log(result);
     if(result.rowCount === 1){
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
})

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
