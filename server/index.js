const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/EmployeesDB');


const userSchema = new mongoose.Schema({
    employeeNo: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    salutation: { type: String, required: true },
    profileColor: { type: String, required: true },
    grossSalary: { type: Number, required: true },
    gender: { type: String, required: true },
});


const userModel = mongoose.model("Employees", userSchema, "Employees"); 

app.get("/getEmployees", (req, res) => {
    userModel.find({})
        .then(function(Employees) {
            console.log('Employees found:', Employees);
            res.json(Employees);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).send(err);
        });
});

// New API endpoint to get employee details by employee number
app.get("/getEmployee/:employeeNo", (req, res) => {
    const {employeeNo} = req.params;
        userModel.findOne({ employeeNo: employeeNo })
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json(employee);
        })

        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// Add a new employee
app.post("/addEmployee", (req, res) => {
    const { employeeNo, firstName, lastName, salutation, profileColor, grossSalary, gender} = req.body;

    const newEmployee = new userModel({ employeeNo, firstName, lastName, salutation, profileColor, grossSalary, gender});

    newEmployee.save()
        .then(employee => res.status(201).json(employee))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// Update employee details by employee number
app.put("/updateEmployee/:employeeNo", (req, res) => {
    const { employeeNo } = req.params;
    const { firstName, lastName, salutation, profileColor, grossSalary, gender, fullName } = req.body;

    userModel.findOneAndUpdate(
        { employeeNo: employeeNo },
        { firstName, lastName, salutation, profileColor, grossSalary, gender, fullName },
        { new: true }
    )
    .then(updatedEmployee => {
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});


// Delete employee by employee number
app.delete("/deleteEmployee/:employeeNo", (req, res) => {
    const { employeeNo } = req.params;

    userModel.findOneAndDelete({ employeeNo: employeeNo })
        .then(deletedEmployee => {
            if (!deletedEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json({ message: 'Employee deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});


app.listen(3001, () => {
    console.log("Server is Running on port 3001");
});
