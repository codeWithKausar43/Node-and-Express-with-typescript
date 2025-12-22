import { pool } from "../../config/db"

const createUser = async (name: string, email: string, age:number,  number: string) => {
  const result = await pool.query(`INSERT INTO users(name, email, number, age) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, number, age])
  return result; 
}

const getSingleUser = async (id: string) => {
 const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]); 
  return result; 
}

const putSingleUser = async(name: string, email: string, number: string, id: string) => {
 const result = await pool.query(`UPDATE users SET name=$1, email=$2, number=$3 WHERE id=$4 RETURNING *`, [name, email, number, id]);
 return result; 
}

const deleteSingleUser = async(id:string) => {
 const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
 return result; 
}

export const userServices = {
    createUser,
    getSingleUser, 
    putSingleUser,
    deleteSingleUser
}