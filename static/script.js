let editId = null;

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("search");

let students = [];

// DISPLAY ALL STUDENTS
async function displayStudents() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Unable to fetch students");
        }

        students = await response.json();

        studentTable.innerHTML = "";

        if (students.length === 0) {
            studentTable.innerHTML = `
                <tr>
                    <td colspan="8">No student records found.</td>
                </tr>
            `;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            [
                student.id,
                student.name,
                student.email,
                student.phone,
                student.course,
                student.semester,
                student.address
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener("click", () => {
                editStudent(student.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.addEventListener("click", () => {
                deleteStudent(student.id);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);
            studentTable.appendChild(row);
        });

        if (totalStudents) {
            totalStudents.textContent = students.length;
        }

    } catch (error) {
        console.error("Display error:", error);
        alert("Unable to load student records!");
    }
}


// ADD AND UPDATE STUDENT
studentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        course: document.getElementById("course").value,
        semester: document.getElementById("semester").value,
        address: document.getElementById("address").value
    };

    const isEditing = editId !== null;

    const url = isEditing
        ? `/api/students/${editId}`
        : "/api/students";

    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (response.ok) {
            alert(isEditing
                ? "Student updated successfully!"
                : "Student added successfully!");

            editId = null;
            studentForm.reset();

            document.querySelector(
                "#studentForm button[type='submit']"
            ).textContent = "Add Student";

            await displayStudents();

        } else {
            alert(result.message || "Operation failed!");
        }

    } catch (error) {
        console.error(error);
        alert("Server connection failed!");
    }
});


// EDIT STUDENT
async function editStudent(id) {
    try {
        const response = await fetch("/api/students");
        const data = await response.json();

        const student = data.find(item => item.id === id);

        if (!student) {
            alert("Student not found!");
            return;
        }

        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone || "";
        document.getElementById("course").value = student.course || "";
        document.getElementById("semester").value = student.semester || "";
        document.getElementById("address").value = student.address || "";

        editId = id;

        document.querySelector(
            "#studentForm button[type='submit']"
        ).textContent = "Update Student";

        studentForm.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        alert("Unable to load student details!");
    }
}


// DELETE STUDENT
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            alert("Student deleted successfully!");
            await displayStudents();
        } else {
            alert(result.message || "Unable to delete student!");
        }

    } catch (error) {
        console.error(error);
        alert("Server connection failed!");
    }
}


// SEARCH STUDENTS
if (searchInput) {
    searchInput.addEventListener("input", function() {
        const searchValue = this.value.toLowerCase();

        const filteredStudents = students.filter(student =>
            Object.values(student).some(value =>
                String(value ?? "").toLowerCase().includes(searchValue)
            )
        );

        studentTable.innerHTML = "";

        filteredStudents.forEach(student => {
            const row = document.createElement("tr");

            [
                student.id,
                student.name,
                student.email,
                student.phone,
                student.course,
                student.semester,
                student.address
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editStudent(student.id));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteStudent(student.id));

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            studentTable.appendChild(row);
        });
    });
}


// LOAD RECORDS WHEN WEBSITE OPENS
document.addEventListener("DOMContentLoaded", displayStudents);