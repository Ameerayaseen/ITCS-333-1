<!DOCTYPE html>
<html lang="en-US">
  <head>
  	<title>PHP + MySQL</title>
  	<meta charset="UTF-8">
  </head>
  <body>
<?php
  $host = "127.0.0.1";
  $user = getenv("userzahraa");
  $pass = getenv("3732288");
  $db = getenv("zahraa");

  $conn = new mysqli($host, $user, $pass, $db);
  if ($conn->connect_error)
      die("Connection failed: " . $conn->connect_error);
  echo "<p>DATABASE connected succesfully!</p>";
  $conn->close();
?>
  </body>
</html>
