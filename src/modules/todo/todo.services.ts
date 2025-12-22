import { pool } from "../../config/db";

const createdTodo = async (user_id: string, title: string) => {
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]); 
    return result; 
}

const getAllTodos = async () =>{
  const result =  await pool.query(`SELECT * FROM todos`); 
  return result; 
}

const getSingleTodo = async (id: string)=>{
 const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]); 
 return result; 
}

const putSingleTodo = async(user_id: string, title:string, description: string, id:string) => {
 const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2, description=$3 WHERE id=$4 RETURNING *`, [user_id, title, description, id]); 
 return result; 
}

const deleteSingleTodo = async (id: string) => {
 const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]); 
 return result; 
}

export const todosServices = {
    createdTodo, 
    getAllTodos, 
    getSingleTodo, 
    putSingleTodo, 
    deleteSingleTodo
}