<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db   = 'campus_hub';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit();
}

function getEvents($pdo) {
    $stmt = $pdo->prepare("SELECT * FROM events");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createEvent($pdo, $data) {
    $stmt = $pdo->prepare("INSERT INTO events (title, date, time, description) VALUES (?, ?, ?, ?)");
    return $stmt->execute([$data['title'], $data['date'], $data['time'], $data['description']]);
}

function updateEvent($pdo, $id, $data) {
    $stmt = $pdo->prepare("UPDATE events SET title = ?, date = ?, time = ?, description = ? WHERE id = ?");
    return $stmt->execute([$data['title'], $data['date'], $data['time'], $data['description'], $id]);
}

function deleteEvent($pdo, $id) {
    $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
    return $stmt->execute([$id]);
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
switch ($requestMethod) {
    case 'GET':
        echo json_encode(getEvents($pdo));
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (createEvent($pdo, $data)) {
            echo json_encode(["message" => "Event created successfully."]);
        } else {
            echo json_encode(["error" => "Failed to create event."]);
        }
        break;
    case 'PUT':
        $id = intval(basename($_SERVER['REQUEST_URI']));
        $data = json_decode(file_get_contents("php://input"), true);
        if (updateEvent($pdo, $id, $data)) {
            echo json_encode(["message" => "Event updated successfully."]);
        } else {
            echo json_encode(["error" => "Failed to update event."]);
        }
        break;
    case 'DELETE':
        $id = intval(basename($_SERVER['REQUEST_URI']));
        if (deleteEvent($pdo, $id)) {
            echo json_encode(["message" => "Event deleted successfully."]);
        } else {
            echo json_encode(["error" => "Failed to delete event."]);
        }
        break;
    default:
        echo json_encode(["error" => "Invalid request method."]);
        break;
}
?>