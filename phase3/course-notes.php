<?php
header("Content-Type: application/json");
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['note_id'])) {
            $note_id = intval($_GET['note_id']);
            $stmt = $conn->prepare("SELECT * FROM Course_Notes WHERE note_id = ?");
            $stmt->bind_param("i", $note_id);
        } else {
            $stmt = $conn->prepare("SELECT * FROM Course_Notes");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $notes = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($notes);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $course_name = $data['course_name'] ?? null;
        $note_title = $data['note_title'] ?? null;
        $note_content = $data['note_content'] ?? null;
        $user_id = $data['user_id'] ?? null;

        if ($course_name && $note_title && $note_content && $user_id) {
            $stmt = $conn->prepare("INSERT INTO Course_Notes (course_name, note_title, note_content, user_id) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sssi", $course_name, $note_title, $note_content, $user_id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Note added successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to add note"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $note_id = $data['note_id'] ?? null;
        $note_title = $data['note_title'] ?? null;
        $note_content = $data['note_content'] ?? null;

        if ($note_id && $note_title && $note_content) {
            $stmt = $conn->prepare("UPDATE Course_Notes SET note_title = ?, note_content = ? WHERE note_id = ?");
            $stmt->bind_param("ssi", $note_title, $note_content, $note_id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Note updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update note"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $note_id = $data['note_id'] ?? null;

        if ($note_id) {
            $stmt = $conn->prepare("DELETE FROM Course_Notes WHERE note_id = ?");
            $stmt->bind_param("i", $note_id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Note deleted successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to delete note"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing note ID"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
?>
