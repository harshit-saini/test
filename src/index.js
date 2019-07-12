// ANCHOR setting the PORT variable 
// NOTE set The PORT variable through the terminal 
const port = process.env.PORT || 3000;

// ANCHOR importing express
const express = require('express');
const app = express();

//ANCHOR  imporiting joi
const Joi = require('joi');

// middleware
app.use(express.json());

// ANCHOR creating courses array
const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];

// ANCHOR setting up the listner 
app.listen(port, () => console.log(`listening on port ${port} ...`));


//ANCHOR course validation function

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    }

    return Joi.validate(course, schema);
}

// ANCHOR get request to the root /
app.get('/', (req, res) => {
    res.send('harshit saini');
})

// ANCHOR providing some data based on parameters passed 
app.get('/api/courses/:id', (req, res) => {
    // res.send(courses);

    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('course not found ...');
    } else {
        res.send(course);
    }

})

//ANCHOR 
app.get('/api/courses/', (req, res) => {
    res.send(courses);
})

//  ANCHOR  post request 
app.post('/api/courses/', (req, res) => {

    // validating the course
    const result = validateCourse(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }


    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }

    courses.push(course);
    res.send(course);
})


// ANCHOR put request for updating 
app.put('/api/courses/:id', (req, res) => {
    //look up the course and if it is not there send status of 404.
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('course not found ...');
    }

    //if course exits validate what user had entered if course is not valid send the error 
    const result = validateCourse(req.body);

    // console.log(result);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }


    // if every thing is alright then update the course
    course.name = req.body.name;
    res.send(course);
})


// ANCHOR delete request
app.delete('/api/courses/:id', (req, res) => {
    //look for the course and if it do not exist return error
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('course not found ...');
    }
    //delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //return the deleted course
    res.send(course);
})