Student Management System

* Project Introduction

The Student Management System is a full-stack web application developed to manage student records efficiently. It allows users to add, view, update, delete, and search student information through a user-friendly interface.

The application uses Python Flask for backend development and MySQL for database management.

* Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask
- Database: MySQL
- Database Connector: MySQL Connector
- Code Editor: Visual Studio Code
- Browser: Google Chrome

* Main Features

1. Add new student records.
2. Display all student records.
3. Update existing student information.
4. Delete student records.
5. Search students.
6. Form validation.
7. Responsive user interface.
8. MySQL database connectivity.

* Database Structure

Database Name: student_m

Table Name: students

Field| Data Type
id| INT (Primary Key, Auto Increment)
name| VARCHAR(100)
email| VARCHAR(100)
phone| VARCHAR(15)
course| VARCHAR(50)
semester| INT
address| VARCHAR(255)

* Installation Requirements

- Python 3
- Flask
- MySQL Server
- MySQL Connector
- Visual Studio Code

* How to Run the Project

1. Open the project folder in Visual Studio Code.

2. Open the terminal.

3. Install the required packages:
   
   pip install flask mysql-connector-python

4. Start the MySQL Server.

5. Run the Flask application:
   
   python app.py

6. Open the browser.

7. Enter:
   
   http://127.0.0.1:5000

7. Conclusion

The Student Management System provides an efficient way to manage student information digitally. It reduces manual record management and demonstrates the practical implementation of frontend development, backend APIs, database connectivity, and CRUD operations.