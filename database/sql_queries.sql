-- CREATE DATABASE pet_adoption;
-- USE pet_adoption;

-- USERS TABLE
-- CREATE TABLE users (
--   user_id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   email VARCHAR(100) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   role ENUM('adopter', 'shelter'') NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );



-- PETS TABLE
-- CREATE TABLE pets (
--   pet_id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   species VARCHAR(50),
--   breed VARCHAR(50),
--   age INT,
--   gender ENUM('male', 'female'),
--   status ENUM('available', 'adopted') DEFAULT 'available',
--   photo_url VARCHAR(255),
--   userr_id INT,
--   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );

-- -- ADOPTION REQUESTS TABLE
-- CREATE TABLE adoption_requests (
--   request_id INT AUTO_INCREMENT PRIMARY KEY,
--   adopter_id INT NOT NULL,
--   pet_id INT NOT NULL,
-- 	 fullName VARCHAR(255) NOT NULL,
--   phone VARCHAR(20),
--   message TEXT,
--   status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
--   request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (adopter_id) REFERENCES users(user_id) ON DELETE CASCADE,
--   FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
-- );



-- CREATE USER 'petuser'@'localhost' IDENTIFIED BY 'Pet1234!';
-- GRANT ALL PRIVILEGES ON pet_adoption.* TO 'petuser'@'localhost';
-- FLUSH PRIVILEGES;

