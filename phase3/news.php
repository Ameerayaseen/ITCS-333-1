<?php

// DB prarmeters
$host = 'localhost';
$dbname = 'news_db';
$username = 'root';
$password = '';

try {
    // Establishing a PDO connection to the MySQL database
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // error handling
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Handling connection errors
    die("Connection failed: " . $e->getMessage());
}
// Including the database configuration
require_once '../config/database.php';

// Setting the response content type to JSON
header("Content-Type: application/json");

// Retrieving the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];

// Switch case to handle different HTTP methods
switch ($method) {
    case 'GET':
        // Handling GET request to retrieve all news articles
        $stmt = $conn->query("SELECT * FROM news ORDER BY created_at DESC");
        $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($news);
        break;

    case 'POST':
        // Handling POST request to create a new news article
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO news (title, body) VALUES (:title, :body)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':body', $data->body);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'News article created successfully']);
        } else {
            echo json_encode(['message' => 'Failed to create news article']);
        }
        break;

    case 'PUT':
        // Handling PUT request to update an existing news article
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE news SET title = :title, body = :body WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':body', $data->body);
        $stmt->bindParam(':id', $data->id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'News article updated successfully']);
        } else {
            echo json_encode(['message' => 'Failed to update news article']);
        }
        break;

    case 'DELETE':
        // Handling DELETE request to delete a news article
        $data = json_decode(file_get_contents("php://input"));
        $sql = "DELETE FROM news WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $data->id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'News article deleted successfully']);
        } else {
            echo json_encode(['message' => 'Failed to delete news article']);
        } 
        break;

    default:
        // Handling unsupported HTTP methods
        http_response_code(405); // Method Not Allowed
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
} 
?>

