-- Create the database (if it doesn't already exist)
CREATE DATABASE IF NOT EXISTS campus_hub;

-- Use the database
USE campus_hub;

-- Drop the table if it already exists (optional for reset)
DROP TABLE IF EXISTS course_notes;

-- Create the course_notes table
CREATE TABLE course_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
