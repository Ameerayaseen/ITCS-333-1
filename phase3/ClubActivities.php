
<?php
// Connection to database
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json"); 

$require_once 'db.php';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
                        
require 'db.php';
$method = $_SERVER['REQUEST_METHOD']; 
// Route the request 
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getActivity($_GET['id']);
        } else {
            listActivities();
        }
        break;

    case 'POST':
        // To create a new activity
        createActivity();
        break;

    case 'PUT':
        // To reading a raw input for PUT method
        parse_str(file_get_contents("php://input"), $_PUT);
        updateActivity($_PUT);
        break;

    case 'DELETE':
        // To reading a raw input for DELETE
        parse_str(file_get_contents("php://input"), $_DELETE);
        deleteActivity($_DELETE['id'] ?? 0);
        break;

    default:
        // If not allowed
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
}

//List All Activities with Pagination
function listActivities() {
    global $pdo;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $offset = ($page - 1) * $limit;
    $stmt = $pdo->prepare("SELECT * FROM Club_Activities ORDER BY created_at DESC LIMIT :offset, :limit");
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
}

//Get 1 Activity by [ID]
function getActivity($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM Club_Activities WHERE activity_id = ?");
    $stmt->execute([$id]);
    $result = $stmt->fetch();

    if ($result) {
        echo json_encode($result);
    } else {
        // Error if not found it
        http_response_code(404);
        echo json_encode(['error' => 'Activity not found']);
    }
}

//Inserting a new Activity
function createActivity() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['club_name']) || !isset($data['activity_name']) || !isset($data['activity_date'])) {
        http_response_code(400); 
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    $stmt = $pdo->prepare("
        INSERT INTO Club_Activities (club_name, activity_name, activity_date, location, description)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        htmlspecialchars($data['club_name']),
        htmlspecialchars($data['activity_name']),
        $data['activity_date'],
        $data['location'] ?? null,
        $data['description'] ?? null
    ]);

    echo json_encode(['message' => 'Activity created']);
}

// Edit existing activity
function updateActivity($data) {
    global $pdo;
    if (!isset($data['activity_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Activity ID is required']);
        return;
    }
    $stmt = $pdo->prepare("
        UPDATE Club_Activities 
        SET club_name = ?, activity_name = ?, activity_date = ?, location = ?, description = ?
        WHERE activity_id = ?
    ");
    $stmt->execute([
        htmlspecialchars($data['club_name'] ?? ''),
        htmlspecialchars($data['activity_name'] ?? ''),
        $data['activity_date'] ?? null,
        $data['location'] ?? null,
        $data['description'] ?? null,
        $data['activity_id']
    ]);
    echo json_encode(['message' => 'Activity updated']);
}

//Remove an activity by [ID]
function deleteActivity($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM Club_Activities WHERE activity_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Activity deleted']);
}
?>
