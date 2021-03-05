const pool = require('../db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const routes = require('express').Router();


routes.get('/', async (req, res) => {
    const users = await pool.query('SELECT * FROM users;');
    res.json(users.rows).status(200);
})


routes.post('/', async (req, res) => {
    try {
        const {user_name, email, password } = req.body;

        //Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user_name, email, hashedPassword])
        res.json(newUser.rows[0].user_id).status(201);
    } catch (err){
        res.json({message: err.message}).status(400);
    }
})

routes.post('/login', async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = ($1);', [req.body.email]);
        if(user.rows[0] === undefined){
            res.json({message: "email or password is wrong"}).status(400)
        } else {
            const password = user.rows[0].password;
            const validPassword = await bcrypt.compare(req.body.password, password)
            if(!validPassword){
                res.json({message: "email or password is wrong"}).status(400)
            } else {
                const token = jwt.sign({id: user.rows[0].user_id}, 'tokensecret');
                res.header('auth-token', token).send(token);
            }
        }
    } catch (err){
        res.json({message: err.message}).status(401);
    }
})


routes.delete('/:id', async (req, res) => {
    try {
        const idToDelete = req.params.id;
        await pool.query("DELETE FROM album_reviews WHERE user_id = ($1)", [idToDelete])
        await pool.query("DELETE FROM users WHERE user_id = ($1);", [idToDelete]);
        res.json({message: "user deleted."}).status(200);
    } catch (err){
        res.json({message: err.message}).status(500);
    }
})



module.exports = routes;