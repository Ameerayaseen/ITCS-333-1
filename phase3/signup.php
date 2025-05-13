<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$host = "localhost";
$dbname = "campus_hub";
$username = "root";
$password = "";

try {
$pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
http_response_code(500);
echo json_encode(["error" => "Database connection failed."]);
exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
http_response_code(400);
echo json_encode(["error" => "Email and password are required."]);
exit();
}

$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
$pass = $data->password;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
http_response_code(400);
echo json_encode(["error" => "Invalid email format."]);
exit();
}

if (strlen($pass) < 6) {
http_response_code(400);
echo json_encode(["error" => "Password must be at least 6 characters."]);
exit();
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
http_response_code(409);
echo json_encode(["error" => "Email already registered."]);
exit();
}

$hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

try {
$stmt = $pdo->prepare("INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())");
$stmt->execute([$email, $hashedPassword]);
$userId = $pdo->lastInsertId();

http_response_code(201);
echo json_encode([
"message" => "Signup successful.",
"user_id" => $userId,
"email" => $email
]);
} catch (Exception $e) {
http_response_code(500);
echo json_encode(["error" => "Signup failed. Please try again."]);
}
?>

