#include "DatabaseManager.h"
#include "sqlite3.h"

#include <iostream>
#include <fstream>
#include <string>

using namespace std;

bool initializeDatabase()
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return false;
    }

    const char* sql =
        "CREATE TABLE IF NOT EXISTS students ("
        "rollNo INTEGER PRIMARY KEY,"
        "name TEXT NOT NULL,"
        "age INTEGER,"
        "course TEXT,"
        "marks REAL"
        ");";

    char* messageError;

    exit = sqlite3_exec(DB, sql, NULL, 0, &messageError);

    if(exit != SQLITE_OK)
    {
        cout << "Error creating students table!" << endl;
        sqlite3_free(messageError);
        sqlite3_close(DB);
        return false;
    }

    sqlite3_close(DB);

    cout << "Database initialized successfully!" << endl;

    return true;
}

bool addStudentToDatabase(const Student& s)
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return false;
    }

    const char* sql =
        "INSERT INTO students (rollNo, name, age, course, marks) "
        "VALUES (?, ?, ?, ?, ?);";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error preparing SQL statement!" << endl;
        sqlite3_close(DB);
        return false;
    }

    sqlite3_bind_int(stmt, 1, s.rollNo);
    sqlite3_bind_text(stmt, 2, s.name.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 3, s.age);
    sqlite3_bind_text(stmt, 4, s.course.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_double(stmt, 5, s.marks);

    exit = sqlite3_step(stmt);

    if(exit != SQLITE_DONE)
    {
        cout << "Error adding student to database!" << endl;
        sqlite3_finalize(stmt);
        sqlite3_close(DB);
        return false;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);

    cout << "Student added to database successfully!" << endl;

    return true;
}

void migrateStudentsFromFile()
{
    ifstream file("students.txt");

    if(!file)
    {
        cout << "students.txt not found!" << endl;
        return;
    }

    Student s;

    while(file >> s.rollNo)
    {
        file.ignore();

        getline(file, s.name);

        file >> s.age;
        file.ignore();

        getline(file, s.course);

        file >> s.marks;

        if(addStudentToDatabase(s))
        {
            cout << "Migrated student: " << s.name << endl;
        }
    }

    file.close();

    cout << "Migration completed successfully!" << endl;
}

void displayStudentsFromDatabase()
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return;
    }

    const char* sql =
        "SELECT rollNo, name, age, course, marks FROM students;";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error fetching students!" << endl;
        sqlite3_close(DB);
        return;
    }

    bool found = false;

    cout << "\n===== STUDENTS LIST =====\n";

    while(sqlite3_step(stmt) == SQLITE_ROW)
    {
        found = true;

        cout << "\nRoll Number : " 
             << sqlite3_column_int(stmt, 0) << endl;

        cout << "Name : " 
             << sqlite3_column_text(stmt, 1) << endl;

        cout << "Age : " 
             << sqlite3_column_int(stmt, 2) << endl;

        cout << "Course : " 
             << sqlite3_column_text(stmt, 3) << endl;

        cout << "Marks : " 
             << sqlite3_column_double(stmt, 4) << endl;

        cout << "---------------------------" << endl;
    }

    if(!found)
    {
        cout << "No Students found!" << endl;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);
}