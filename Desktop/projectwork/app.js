const express = require('express');
const employees = require('./employees.json');
const todoitems = require('./todolist.json');
const MongoClient = require('mongodb').MongoClient;

// database connection
const url='mongodb://localhost:27017';


const dbname = 'EmployeeDB';
let db;
let todoCollection

const client = new MongoClient(url,{useUnifiedTopology: true, useNewUrlParser: true});

const myConn = async () => {
    try {

const result =await client.connect();
db = await result.db(dbname);
todoCollection = await db.collection('to-do');

console.log('Successfully Connected to Database')

    } catch (error) {
        console.log('Failed to Connect to Database')
    }
}
myConn();
const app = express();

app.set('view engine','ejs');
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// '/' - root route/path
app.get('/',(req, res) => {
    res.render('index');

});
app.get('/employeeList',(req, res) => {
    res.render('employeelist',{
        employees});

});
app.get('/todoList',async (req, res) => {
    const results = await todoCollection.find().toArray();
    res.render('todolist',
    {
        results
    });
    res.render('todolist');
})
app.post('/todoitem', async (req, res)=>{
    const data = await todoCollection.insertMany(todoitems);
   res.direct('/');

});


app.listen(3000, ()=>{
    console.log('Server has started on port 3000....')
});
