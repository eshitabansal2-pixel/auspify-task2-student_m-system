from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__),".env"))
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(host=os.getenv("DB_HOST"), user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"), database=os.getenv("DB_NAME"))
app = Flask(__name__)

# Temporary storage until MySQL is connected
students = []
next_id = 1


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(".", filename)


# GET: View all students
@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(students)


# POST: Add a student
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = """
    INSERT INTO students
    (name, email, phone, course, semester, address)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        data['name'],
        data['email'],
        data.get('phone'),
        data.get('course'),
        data.get('semester'),
        data.get('address')
    )

    cursor.execute(sql, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Student added successfully!"}), 201


# PUT: Update student
@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student(id):
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = """
    UPDATE students
    SET name=%s, email=%s, phone=%s,
        course=%s, semester=%s, address=%s
    WHERE id=%s
    """

    values = (
        data['name'],
        data['email'],
        data.get('phone'),
        data.get('course'),
        data.get('semester'),
        data.get('address'),
        id
    )

    cursor.execute(sql, values)
    conn.commit()

    updated = cursor.rowcount

    cursor.close()
    conn.close()

    if updated == 0:
        return jsonify({"message": "Student not found or no changes made"}), 404

    return jsonify({"message": "Student updated successfully!"}), 200

# DELETE: Remove student
# DELETE STUDENT
@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM students WHERE id = %s",
        (id,)
    )

    conn.commit()

    deleted = cursor.rowcount

    cursor.close()
    conn.close()

    if deleted == 0:
        return jsonify({"message": "Student not found!"}), 404

    return jsonify({
        "message": "Student deleted successfully!"
    }), 200
    
if __name__ == "__main__":
    app.run(debug=True)