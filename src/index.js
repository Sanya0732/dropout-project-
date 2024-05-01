const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose
mongoose.connect("mongodb://127.0.0.1:27017/login-tut");
const bcrypt = require('bcrypt');
const Login = require("./config"); // Import Login model
const Student = require("./Student"); // Import Student model
const app = express();

// Convert data to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Define routes
app.get("/", (req, res) => {
    res.render("login"); // Render login.ejs when accessing the root URL
});

app.get("/register", (req, res) => {
    res.render("register"); // Render signup.ejs when accessing the /signup URL
});

// Register page 
app.post("/register", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        // Check if user already exists
        const existingUser = await Login.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Save the user with hashed password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userdata = await Login.create({ email: data.email, password: hashedPassword });
        console.log("User registered successfully:", userdata);

        // Redirect to login page after successful registration
        // and display pop-up message
        res.render("register", { successMessage: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).send("Error registering user");
    }
});

// Login page 
app.post("/login", async (req, res) => {
    try {
        const { email, password, person } = req.body;
        const user = await Login.findOne({ email });
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        // Compare the password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Redirect to home page based on user type
            switch(person) {
                case "student":
                    return res.redirect("/student/home");
                case "teacher":
                    return res.redirect("/teacher/home");
                case "admin":
                    return res.redirect("/admin/home");
                default:
                    return res.status(401).send("Invalid user type");
            }
        } else {
            return res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("An error occurred during login");
    }
});

// Add student
app.post("/addstudent", async (req, res) => {
    // Extract student data from the request body
    const { schoolName, affiliated, name, age, gender, caste, admittedIn, droppedOutIn, reason } = req.body;

    try {
        // Create new student record in MongoDB
        const newStudent = await Student.create({ schoolName,affiliated, name, age, gender, caste, admittedIn, droppedOutIn, reason });
        console.log("Student added successfully:", newStudent);

        // Redirect to a new page where the student table will be updated
        res.redirect("/studentRecords"); // Redirect to the student records page

    } catch (error) {
        console.error("Error adding student:", error.message);
        res.status(500).send("Error adding student");
    }
});

// Student home page
app.get("/student/home", (req, res) => {
    res.render("student_home"); // Render student_home.ejs
});

// Teacher home page
app.get("/teacher/home", (req, res) => {
    res.render("teacher_home"); // Render teacher_home.ejs
});

// Admin home page
app.get("/admin/home", (req, res) => {
    res.render("admin_home"); // Render admin_home.ejs
});

// Add student page

app.get("/addstudent", (req, res) => {
    res.render("add_student"); // Render add_student.ejs
});

app.get("/dashboard", async (req, res) => {
    try {
        const students = await Student.find();
        res.render("dashboard", { students });
    } catch (error) {
        console.error("Error fetching student records:", error);
        res.status(500).send("Error fetching student records");
    }
});

// Home page 
app.get("/home", (req, res) => {
    res.render("home"); // Render home.ejs when accessing the /home URL
});

// Student records page
app.get("/studentRecords", async (req, res) => {
    try {
        // Fetch all student records from the database
        const students = await Student.find();
        
        // Render the studentRecords view and pass the students data
        res.render("studentRecords", { students });
    } catch (error) {
        console.error("Error fetching student records:", error);
        res.status(500).send("Error fetching student records");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
