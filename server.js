// Set requirements
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = 1337
require('dotenv').config()


// Link to database
    let db,
        dbConnectionStr = process.env.DB_STRING,
        dbName = 'ToDo-List'

    MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
        .then (client =>{
            console.log(`Connected to ${dbName} Database`)
            db = client.db(dbName)
        })


// Middlewares
app.set('viewengine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes (CRUD Handlers)
// Read (GET Request)
app.get('/', async (request, response)=>{
    const data = await db.collection('tasks').find().toArray()
    response.render('index.ejs', {info: data})
})

// Create (POST Request)
app.post('/addTask', async (request, response) =>{
    try {
        result = await db.collection('tasks').insertOne({
            taskName: request.body.taskName.trim(),
            completed: false
        })
        console.log('Task was added')
        response.redirect('/')
} catch(err) {
    console.error(error)    
    }  
}) 

// // Update (PUT Request)
app.put('/toggleComplete', async (request, response) => { 
    try{
        const result = await db.collection('tasks').findOneAndUpdate({
                 taskName: request.body.nameOfTask,
         },{
             $set: {               
                 completed: request.body.completed
               }
        }, {returnOriginal: true})
             console.log('Task Toggled')
             response.json('Task Toggled')      
    } catch(err){
        console.error(err)
    } 
})

// Delete (DELETE Request)
app.delete('/removeTask', async (request, response) => {
    try {
       result = await db.collection('tasks').deleteOne({
            taskName: request.body.nameOfTask
        })       
            console.log('Task Deleted')
            response.json('Deleted Task')
        } catch(err) {
        console.error(err)
    }    
})

// Listen 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})