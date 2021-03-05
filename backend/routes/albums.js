const pool = require('../db');

const routes = require('express').Router();
const verify = require('./verifyToken')

routes.get('/', async (req, res) => {
    const users = await pool.query('SELECT * FROM album_reviews;');
    res.json(users.rows).status(200);
})


routes.post('/', verify , async (req, res) => {
    const user_id = req.user.id;
    try {
        const { review_title, album_title, review_text, album_grade, album_cover } = req.body;
        const newAlbum = await pool.query("INSERT INTO album_reviews (review_title, album_title, review_text, album_grade, album_cover, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;"
                                        , [review_title, album_title, review_text, album_grade, album_cover, user_id])
        res.json(newAlbum.rows[0]).status(201);
    } catch (err){
        res.json({message: err.message}).status(400);
    }
})


routes.get('/:id', async (req, res) => {
    try {
        const idToGet = req.params.id;
        const review = await pool.query("SELECT * FROM album_reviews WHERE review_id = ($1);", [idToGet]);
        res.json(review.rows[0]).status(200);
    } catch (err){
        res.json({message: err.message}).status(500);
    }
})


routes.delete('/:id', async (req, res) => {
    try {
        const idToDelete = req.params.id;
        await pool.query("DELETE FROM album_reviews WHERE review_id = ($1);", [idToDelete]);
        res.json({message: "review deleted."}).status(200);
    } catch (err){
        res.json({message: err.message}).status(400);
    }
})


module.exports = routes;