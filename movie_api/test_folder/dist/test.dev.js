"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

var app = express();
app.use(bodyParser.json());
var students = [{
  id: 1,
  name: 'Jessica Drake',
  classes: {
    biology: 95,
    algebra: 92
  }
}, {
  id: 2,
  name: 'Ben Cohen',
  classes: {
    biology: 95,
    algebra: 92
  }
}, {
  id: 3,
  name: 'Lisa Downing',
  classes: {
    biology: 95,
    algebra: 92
  }
}]; // Gets the list of data about ALL students

app.get('/students', function (req, res) {
  res.json(students);
}); // Gets the data about a single student, by name

app.get('/students/:name', function (req, res) {
  res.json(students.find(function (student) {
    return student.name === req.params.name;
  }));
}); // Adds data for a new student to our list of students.

app.post('/students', function (req, res) {
  var newStudent = req.body;

  if (!newStudent.name) {
    var message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newStudent.id = uuid.v4();
    students.push(newStudent);
    res.status(201).send(newStudent);
  }
}); // Deletes a student from our list by ID

app["delete"]('/students/:id', function (req, res) {
  var student = students.find(function (student) {
    return student.id === req.params.id;
  });

  if (student) {
    students = students.filter(function (obj) {
      return obj.id !== req.params.id;
    });
    res.status(201).send('Student ' + req.params.id + ' was deleted.');
  }
}); // Update the "grade" of a student by student name/class name

app.put('/students/:name/:class/:grade', function (req, res) {
  var student = students.find(function (student) {
    return student.name === req.params.name;
  });

  if (student) {
    student.classes[req.params["class"]] = parseInt(req.params.grade);
    res.status(201).send('Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params["class"]);
  } else {
    res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
  }
}); // Gets the GPA of a student

app.get('/students/:name/gpa', function (req, res) {
  var student = students.find(function (student) {
    return student.name === req.params.name;
  });

  if (student) {
    var classesGrades = Object.values(student.classes); // Object.values() filters out object's keys and keeps the values that are returned as a new array

    var sumOfGrades = 0;
    classesGrades.forEach(function (grade) {
      sumOfGrades = sumOfGrades + grade;
    });
    var gpa = sumOfGrades / classesGrades.length;
    console.log(sumOfGrades);
    console.log(classesGrades.length);
    console.log(gpa);
    res.status(201).send('' + gpa); //res.status(201).send(gpa);
  } else {
    res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
  }
});
app.listen(8080, function () {
  console.log('Your app is listening on port 8080');
});