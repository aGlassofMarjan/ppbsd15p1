# How to run the app

## 1. Clone the Repository

## 2. Install Dependencies

Install the necessary dependencies using npm.

```bash
npm install
```

## 3. Update Configuration

Update this file with your database credentials and settings:

config/config.json:

```bash
{
"development": {
"username": "your_development_username",
"password": "your_development_password",
"database": "your_development_database_name",
"host": "127.0.0.1",
"dialect": "postgres",
"port": "your_development_port",
"logging": false
}
```

Replace the placeholder values with your actual database credentials and settings.

## 4. Create Database

Before running migrations, create the database. Use the following commands to create the database specified in your configuration file:

```bash
npx sequelize-cli db:create
```

## 5.Run Migrations

Run Sequelize migrations to set up your database schema. Make sure the database server is running and accessible.

```bash
npx sequelize-cli db:migrate
```

## 6. Seed the Database

```bash
npx sequelize-cli db:seed:all
```

## 7. Start the Application

Start the application using nodemon to enable auto-reloading during development.

```bash
npx nodemon app.jw
```
