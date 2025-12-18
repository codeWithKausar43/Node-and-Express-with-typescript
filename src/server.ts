import express, {Request, Response} from "express"; 
import {Pool} from "pg"; 
import dotenv from "dotenv"; 
import path from "path"; 

dotenv.config({ path: path.join(process.cwd(), ".env")});

const app = express()
const port = 5000

// body perser
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.send('How Can I Help Your! could you please say. ')
})

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



app.listen(port, () => {
  console.log(`I am running now ${port}`)
})
