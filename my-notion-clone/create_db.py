import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('notes.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create the notes table
cursor.execute('''
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT
)
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("Database and table created successfully.")
