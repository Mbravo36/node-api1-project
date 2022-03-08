// BUILD YOUR SERVER HERE

//imports
const express = require('express');
const user = require('./users/model');

// instance of express app
const server = express();


server.use(express.json());

// endpoints
server.get('/api/users', (req, res) => {
    // pull data(users) from database
    user.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(500).json({
            message: 'The users information could not be retrieved',
            error: err.message
        })
    })
})


server.post('/api/users', (req, res) => {
    let body = req.body;
    if(!body.name){
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else if(!body.bio){
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else{
        user.insert(body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error while saving the user to the database', error: err.message})
        })
    }
})


server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    user.findById(id)
    .then(user => {
        if(user == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist'});
        } else{
            res.json(user)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'The user information could not be retrieved',
            error: err.message
        })
    })
})


server.delete('/api/users/:id', (req, res) => {
    let { id } = req.params;
    user.remove(id)
    .then(user => {
        if(user == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist' });
            return;
        }

        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ message: 'The user could not be removed', error: err.message})
    })
})


server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    try{
        const actualUser = await user.findById(id)
        if(!actualUser){
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            if (!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: 'Please provide name and bio for the user'
                })
            } else {
                const updatedUser = await user.update(id, req.body)
                res.status(200).json(updatedUser)
            }
        }
    } catch(err){
        res.status(500).json({
            message: 'The user information could not be modified',
            error: err.message
        })

    }

})

module.exports = server; // EXPORT YOUR SERVER instead of {}
