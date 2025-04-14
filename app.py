from flask import Flask, request, jsonify
import sqlite3
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

DATABASE = 'notes.db'

# Helper function to connect to the database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Helper function to sanitize table names
def sanitize_table_name(name):
    """Sanitize the table name to ensure it is a valid SQLite identifier."""
    return re.sub(r'\W+', '_', name)  # Replace non-alphanumeric characters with underscores

# API Endpoints

# Get all notes
@app.route('/api/notes', methods=['GET'])
def get_notes():
    table = request.args.get('table', 'default_table')  # Get table name from query
    table = sanitize_table_name(table)  # Sanitize the table name
    conn = get_db_connection()
    try:
        conn.execute(f'CREATE TABLE IF NOT EXISTS {table} (id TEXT PRIMARY KEY, type TEXT NOT NULL, content TEXT)')
        notes = conn.execute(f'SELECT * FROM {table}').fetchall()
        return jsonify([dict(note) for note in notes])
    finally:
        conn.close()

# Create a new note
@app.route('/api/notes', methods=['POST'])
def create_note():
    table = request.args.get('table', 'default_table')  # Get table name from query
    table = sanitize_table_name(table)  # Sanitize the table name
    data = request.get_json()
    print("Received data for new note:", data)  # Debugging log

    # Allow empty content for new notes
    if 'content' not in data or data['content'] is None:
        data['content'] = ""  # Default to an empty string if content is missing

    conn = get_db_connection()
    try:
        conn.execute(f'CREATE TABLE IF NOT EXISTS {table} (id TEXT PRIMARY KEY, type TEXT NOT NULL, content TEXT)')
        conn.execute(f'INSERT INTO {table} (id, type, content) VALUES (?, ?, ?)', (data['id'], data['type'], data['content']))
        conn.commit()
        print("Note successfully inserted into the database.")  # Debugging log
        return jsonify({'message': 'Note created successfully.'}), 201
    except sqlite3.Error as e:
        print("Database Error:", e)  # Debugging log
        return jsonify({'error': 'Failed to create note due to a database error.'}), 500
    finally:
        conn.close()

# Update a note
@app.route('/api/notes/<id>', methods=['PUT'])
def update_note(id):
    table = request.args.get('table', 'default_table')  # Get table name from query
    table = sanitize_table_name(table)  # Sanitize the table name
    data = request.get_json()
    conn = get_db_connection()
    try:
        conn.execute(f'UPDATE {table} SET content = ? WHERE id = ?', (data['content'], id))
        conn.commit()
        return jsonify({'message': 'Note updated successfully.'})
    finally:
        conn.close()

# Rename a table
@app.route('/api/rename_table', methods=['POST'])
def rename_table():
    data = request.get_json()
    old_table = sanitize_table_name(data.get('old_table', 'default_table'))
    new_table = sanitize_table_name(data.get('new_table', 'default_table'))

    if old_table == new_table:
        return jsonify({'message': 'Table name is unchanged.'}), 200

    conn = get_db_connection()
    try:
        conn.execute(f'ALTER TABLE {old_table} RENAME TO {new_table}')
        conn.commit()
        print(f"Table renamed from {old_table} to {new_table}.")  # Debugging log
        return jsonify({'message': f'Table renamed from {old_table} to {new_table}.'}), 200
    except sqlite3.Error as e:
        print("Database Error:", e)  # Debugging log
        return jsonify({'error': 'Failed to rename table due to a database error.'}), 500
    finally:
        conn.close()

# Initialize the database and start the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
