<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>PHP + MySQL</title>
    <meta charset="UTF-8">
</head>
<body>
<?php
require_once 'db.php';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error)
    die("Connection failed: " . $conn->connect_error);
echo "<p>DATABASE connected successfully!</p>";
$conn->close();
?>
</body>
</html>
