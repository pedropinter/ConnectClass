# ConnectClass
MySQL:

CREATE DATABASE connectClass; use connectClass; CREATE TABLE rooms ( id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(100) NOT NULL ); CREATE TABLE school_events ( id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, difficulty ENUM('other', 'basic', 'relative', 'important') NOT NULL DEFAULT 'basic', room_id INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE ); INSERT INTO rooms (code, label) VALUES ('room-1', '1-AM SENAC'), ('room-2', '1-BM SENAC'), ('room-3', '2-AM SENAC'), ('room-4', '2-BM SENAC'), ('room-5', '3-AM SENAC'), ('room-6', '3-BM SENAC');

Terminal:

npm install nas pastas backend/ e frontend/.

ng build na pasta frontend/.

npm run dev na pasta backend/.
