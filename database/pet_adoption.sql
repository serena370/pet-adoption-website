-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pet_adoption
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption_requests`
--

DROP TABLE IF EXISTS `adoption_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `adopter_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `adopter_id` (`adopter_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `adoption_requests_ibfk_1` FOREIGN KEY (`adopter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `adoption_requests_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_requests`
--

LOCK TABLES `adoption_requests` WRITE;
/*!40000 ALTER TABLE `adoption_requests` DISABLE KEYS */;
INSERT INTO `adoption_requests` VALUES (10,9,5,'serena','123456','random message ','approved','2025-11-13 17:27:36'),(11,9,3,'serena','12345','sdfgdb','approved','2025-11-14 12:16:25'),(13,3,3,'Test User','70123456','I want this pet','approved','2025-11-21 17:20:13'),(21,10,22,'test','12345678','I would love to adopt this pet!','approved','2025-11-21 18:57:34'),(22,9,21,'serena','70142274','i would really love to about this pet!','approved','2025-11-21 20:27:04');
/*!40000 ALTER TABLE `adoption_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `pet_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `species` varchar(50) DEFAULT NULL,
  `breed` varchar(50) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `status` enum('available','reserved','adopted') DEFAULT 'available',
  `photo_url` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`pet_id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (3,'Bella','cat','american shorthair',4,'female','available','http://localhost:5000/uploads/1763067639784.jpeg',6),(5,'Buddy','Dog','Beagle',3,'male','adopted','http://localhost:5000/uploads/1763118173295.jpeg',6),(21,'blue','dog','husky',2,'male','available','http://localhost:5000/uploads/1763062706285.jpeg',6),(22,'milo','dog','golden retriever',3,'male','available','http://localhost:5000/uploads/1763118439075.jpeg',6),(23,'nala','cat','british shorthair',1,'female','available','http://localhost:5000/uploads/1763118529669.jpeg',6),(24,'pepper','dog','german sheperd mix',4,'male','available','http://localhost:5000/uploads/1763118597344.jpeg',6);
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('adopter','shelter') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'test','test@example.com','$2b$10$Jy5BygmFv4auwFhN/oxNpeAAFXeyvI6OqOsbqem/FE6aS80R8k7ES','adopter','2025-11-06 15:01:29'),(5,' adopter','adopter@example.com','$2b$10$PIUhda4zMUAQ3Q/SNDpf3egf.bpYmLK1aywn4xx0LzHQertHOP9JG','adopter','2025-11-06 15:54:10'),(6,' shelter','serenaaouad23@gmail.com','$2b$10$9gYXq1X5.Nwf2BCdPQ/CiemO99Jsi0vkLiURtkEBm7nbTM5vCR3y6','shelter','2025-11-06 16:32:58'),(8,'new user','new@example.com','$2b$10$l0RnJUlUpEXGc/boqrymyuy/oQ5uKoAJuilbvLEk.sQaYlCG4UOFq','adopter','2025-11-13 15:18:22'),(9,'serena','sisiaouad93@gmail.com','$2b$10$YOA8CV1unP.SG//9oneoK.dCNRngC4gQ3Pk4EejuW6zqA5fEqEbfW','adopter','2025-11-13 17:15:13'),(10,'Swagger test','swagger@example.com','$2b$10$RjNVmOUK.HQ4yqvotoh2mOPC7pxv2.Mv9dNMDm31x5.rJVetsvoFa','adopter','2025-11-21 18:52:01'),(11,'test','testuser@example.com','$2b$10$njtcB5p7iUGRIa70EaCcsuxaa4kfGByryyQzpJpX/6/QfnPMBJmxS','adopter','2025-11-21 19:51:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22 21:31:45
