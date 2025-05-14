<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db   = 'campus_hub';
$user = 'root';
$pass = ''; // Default for XAMPP. Change if needed.
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM course_notes WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM course_notes ORDER BY upload_date DESC");
            echo json_encode($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['title'], $data['course_code'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO course_notes (title, course_code, description, uploaded_by) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['course_code'],
            $data['description'] ?? '',
            $data['uploaded_by'] ?? 'Anonymous',
        ]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing ID"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE course_notes SET title = ?, course_code = ?, description = ?, uploaded_by = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['course_code'],
            $data['description'],
            $data['uploaded_by'],
            $_GET['id']
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing ID"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM course_notes WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
