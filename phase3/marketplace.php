<?php
$host = 'localhost';
$db = 'student_marketplace';
$user = 'root';
$pass = '';
$charset = 'utf8mb/4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
$pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

function getItems() {
global $pdo;
$stmt = $pdo->query("SELECT * FROM items LIMIT 10");
return $stmt->fetchAll();
}

function createItem($data) {
global $pdo;
$sql = "INSERT INTO items (name, price, category, description) VALUES (:name, :price, :category, :description)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
':name' => $data['name'],
':price' => $data['price'],
':category' => $data['category'],
':description' => $data['description']
]);
return $pdo->lastInsertId();
}

function updateItem($id, $data) {
global $pdo;
$sql = "UPDATE items SET name = :name, price = :price, category = :category, description = :description WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
':name' => $data['name'],
':price' => $data['price'],
':category' => $data['category'],
':description' => $data['description'],
':id' => $id
]);
return $stmt->rowCount();
}

function deleteItem($id) {
global $pdo;
$sql = "DELETE FROM items WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':id' => $id]);
return $stmt->rowCount();
}

header('Content-Type: application/json');

$requestMethod = $_SERVER['REQUEST_METHOD'];
$endpoint = explode('/', trim($_SERVER['PATH_INFO'], '/'));

if (count($endpoint) > 1) {
$id = $endpoint[1];
}

switch ($requestMethod) {
case 'GET':
if (empty($endpoint)) {
echo json_encode(getItems());
} else {
echo json_encode(getItem($id));
}
break;

case 'POST':
$input = json_decode(file_get_contents('php://input'), true);
if (isset($input['name'], $input['price'], $input['category'], $input['description'])) {
$id = createItem($input);
echo json_encode(["message" => "Item created", "id" => $id]);
} else {
echo json_encode(["message" => "Invalid input"]);
}
break;

case 'PUT':
$input = json_decode(file_get_contents('php://input'), true);
if (isset($input['name'], $input['price'], $input['category'], $input['description'])) {
$rowsAffected = updateItem($id, $input);
echo json_encode(["message" => $rowsAffected > 0 ? "Item updated" : "No changes made"]);
} else {
echo json_encode(["message" => "Invalid input"]);
}
break;

case 'DELETE':
$rowsAffected = deleteItem($id);
echo json_encode(["message" => $rowsAffected > 0 ? "Item deleted" : "Item not found"]);
break;

default:
echo json_encode(["message" => "Method not allowed"]);
break;
}

?>

