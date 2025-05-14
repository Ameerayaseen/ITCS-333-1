<?php
header("Content-Type: application/json");
require_once 'db.php'; 

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['course_id'])) {
            $course_id = intval($_GET['course_id']);
            $stmt = $conn->prepare("SELECT * FROM course_notes WHERE course_id = ?");
            $stmt->bind_param("i", $course_id);
        } else {
            $stmt = $conn->prepare("SELECT * FROM course_notes");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $notes = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($notes);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $course_id = $data['course_id'] ?? null;
        $title = $data['title'] ?? null;
        $content = $data['content'] ?? null;

        if ($course_id && $title && $content) {
            $stmt = $conn->prepare("INSERT INTO course_notes (course_id, title, content) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $course_id, $title, $content);
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
        $note_id = $data['id'] ?? null;
        $title = $data['title'] ?? null;
        $content = $data['content'] ?? null;

        if ($note_id && $title && $content) {
            $stmt = $conn->prepare("UPDATE course_notes SET title = ?, content = ? WHERE id = ?");
            $stmt->bind_param("ssi", $title, $content, $note_id);
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
        $note_id = $data['id'] ?? null;

        if ($note_id) {
            $stmt = $conn->prepare("DELETE FROM course_notes WHERE id = ?");
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
