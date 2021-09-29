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
app.post('/addTask', (request, response) =>{
    db.collection('tasks').insertOne({
        taskName: request.body.taskName.trim(),
        completed: false
    })
    .then (result =>{
        console.log('Task was added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
}) 

// Update (PUT Request)
app.put('/markComplete', (request, response) => {
    db.collection('tasks').updateOne({
            taskName: request.body.nameOfTask,
    },{
        $set: {
            completed:true
          }
   })
    .then(result => {
        console.log('Completed Task')
        response.json('Task Completed')
    })
    .catch(error => console.error(error))
})

app.put('/toggleComplete', async (request, response) => {

    console.log('toggle complete is hitting', request.body)
    // const task = await db.collection('tasks').findOne(request.body.nameOfTask)
    try{
        const result = await db.collection('tasks').findOneAndUpdate({
                 taskName: request.body.nameOfTask,
         },{
             $set: {
                // !task.completed
                 completed: request.body.completed
               }
        }, {returnOriginal: true})
         //.then(result => {
             console.log('Incomplete Task')
             response.json('Task Incompleted')
             console.log(result)

    } catch(err){
        console.error(err)
    }
   // })
   // .catch(error => console.error(error))
})

// Delete (DELETE Request)
app.delete('/removeTask', (request, response) => {
    db.collection('tasks').deleteOne({
        taskName: request.body.nameOfTask
    })
    .then(result => {
        console.log('Task Deleted')
        response.json('Deleted Task')
    })
    .catch(error => console.error(error))

})

// Listen 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})