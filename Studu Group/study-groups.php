<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");

$host = 'localhost';
$db   = 'campus_hub';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}


$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'GET') {

  $search = $_GET['search'] ?? '';
  $date = $_GET['date'] ?? '';
  $page = isset($_GET['page']) ? max((int)$_GET['page'], 1) : 1;
  $limit = 10;
  $offset = ($page - 1) * $limit;

  $query = "SELECT * FROM study_groups WHERE 1";
  $params = [];

  if (!empty($search)) {
    $query .= " AND name LIKE ?";
    $params[] = "%$search%";
  }

  if (!empty($date)) {
    $query .= " AND date = ?";
    $params[] = $date;
  }

  $query .= " ORDER BY date ASC LIMIT $limit OFFSET $offset";

  $stmt = $pdo->prepare($query);
  $stmt->execute($params);
  $groups = $stmt->fetchAll();

  echo json_encode($groups);

} elseif ($requestMethod === 'POST') {
 
  $data = json_decode(file_get_contents("php://input"), true);

  if (!isset($data['name'], $data['meeting_time'], $data['description'], $data['date'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields."]);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO study_groups (name, meeting_time, description, date) VALUES (?, ?, ?, ?)");
  $stmt->execute([
    htmlspecialchars($data['name']),
    htmlspecialchars($data['meeting_time']),
    htmlspecialchars($data['description']),
    $data['date']
  ]);

  echo json_encode(["success" => true, "message" => "Study group added successfully."]);
} else {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
}
?>
