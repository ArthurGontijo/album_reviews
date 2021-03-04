const pool = require('../db');

const routes = require('express').Router();


routes.get('/', async (req, res) => {
    const users = await pool.query('SELECT * FROM users;');
    res.json(users.rows).status(200);
})


routes.post('/', async (req, res) => {
    try {
        const {user_name, email, password } = req.body;
        const newUser = await pool.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user_name, email, password])
        res.json(newUser.rows[0]).status(201);
    } catch (err){
        res.json({message: err.message}).status(400);
    }
})


routes.delete('/:id', async (req, res) => {
    try {
        const idToDelete = req.params.id;
        await pool.query("DELETE FROM users WHERE user_id = ($1);", [idToDelete]);
        res.json({message: "user deleted."}).status(200);
    } catch (err){
        res.json({message: err.message}).status(500);
    }
})



module.exports = routes;