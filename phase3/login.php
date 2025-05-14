<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db.php';

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

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

$stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() === 0) {
http_response_code(401);
echo json_encode(["error" => "Invalid email or password."]);
exit();
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!password_verify($pass, $user['password'])) {
http_response_code(401);
echo json_encode(["error" => "Invalid email or password."]);
exit();
}

$fakeToken = bin2hex(random_bytes(16));

http_response_code(200);
echo json_encode([
"message" => "Login successful.",
"user_id" => $user['id'],
"email" => $email,
"token" => $fakeToken
]);
?>
