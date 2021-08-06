<!DOCTYPE html>
<html lang="de">
 <head>
  <meta charset="UTF-8">
  <title>Joine Server</title>

 <style>
 p.fehler {
  background-color: #FFFFDF;
  padding: 15px;
 }
 </style>

 </head>
<body>

<?php
if (isset($_GET["request_call_bad"])) {

 // Individuelle Fehlerausgabe
 switch ($_GET["request_call_bad"]) {

  case "1":
   $meldung = 'Weiterleitung erfolgt!';
   header('Location: http://discord.com');
   break;

 }

}
?>

</body>
</html> 