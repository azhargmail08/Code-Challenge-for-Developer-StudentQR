from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('students.db', check_same_thread=False)
cursor = conn.cursor()

# Create a table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS students (
    name TEXT,
    class TEXT,
    level INTEGER,
    parent_contact TEXT,
    PRIMARY KEY (name, class, level, parent_contact)
)
''')

def record_exists(name, class_name, level, contact):
    cursor.execute('''
    SELECT 1 FROM students WHERE name=? AND class=? AND level=? AND parent_contact=?
    ''', (name, class_name, level, contact))
    return cursor.fetchone() is not None

def add_student_record(name, class_name, level, contact):
    cursor.execute('''
    INSERT INTO students (name, class, level, parent_contact) VALUES (?, ?, ?, ?)
    ''', (name, class_name, level, contact))
    conn.commit()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        
        df = pd.read_excel(file_path)
        added_records = []
        for index, row in df.iterrows():
            name = row['Name']
            class_name = row['Class']
            level = row['Level']
            contact = row['Parent Contact']
            
            if not record_exists(name, class_name, level, contact):
                add_student_record(name, class_name, level, contact)
                added_records.append(row.to_dict())
        
        os.remove(file_path)
        
        return jsonify(added_records), 200

@app.route('/')
def serve_frontend():
    return send_from_directory('../Frontend', 'index.html')

@app.route('/<path:path>')
def server_static_file(path):
    return send_from_directory('../Frontend', path)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)