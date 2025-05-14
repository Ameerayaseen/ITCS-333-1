<?php
require 'db.php';
require 'CourseReviewController.php';

$controller = new CourseReviewController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$resource = $uri[0] ?? '';
$id = $uri[1] ?? null;

if ($resource !== 'reviews') {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found."]);
    exit;
}

switch ($method) {
    case 'GET':
        if (isset($_GET['search'])) {
            $controller->searchReviews($_GET['search']);
        } else {
            $controller->listReviews();
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $controller->createReview($data);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if ($id) {
            $controller->updateReview($id, $data);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Missing ID for update."]);
        }
        break;

    case 'DELETE':
        if ($id) {
            $controller->deleteReview($id);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Missing ID for deletion."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
}
?>