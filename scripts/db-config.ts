// Database Configuration for XAMPP
export const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Default XAMPP password is empty
  database: "ipm_maiombe",
}

// Connection string for reference
// mysql://root:@localhost:3306/ipm_maiombe

// Instructions for XAMPP Setup:
// 1. Open phpMyAdmin at http://localhost/phpmyadmin
// 2. Create new database: ipm_maiombe
// 3. Import scripts/01-create-ipm-database.sql
// 4. Import scripts/02-populate-ipm-data.sql
// 5. Verify all tables and data were created successfully
