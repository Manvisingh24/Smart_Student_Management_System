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

bool searchStudentInDatabase(int roll)
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return false;
    }

    const char* sql =
        "SELECT rollNo, name, age, course, marks "
        "FROM students WHERE rollNo = ?;";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error searching student!" << endl;
        sqlite3_close(DB);
        return false;
    }

    sqlite3_bind_int(stmt, 1, roll);

    if(sqlite3_step(stmt) == SQLITE_ROW)
    {
        cout << "\nStudent Found!" << endl;

        cout << "Roll Number : "
             << sqlite3_column_int(stmt, 0) << endl;

        cout << "Name : "
             << sqlite3_column_text(stmt, 1) << endl;

        cout << "Age : "
             << sqlite3_column_int(stmt, 2) << endl;

        cout << "Course : "
             << sqlite3_column_text(stmt, 3) << endl;

        cout << "Marks : "
             << sqlite3_column_double(stmt, 4) << endl;

        sqlite3_finalize(stmt);
        sqlite3_close(DB);

        return true;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);

    return false;
}

bool updateStudentInDatabase(int roll, const string& newName, int newAge,
                             const string& newCourse, float newMarks)
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return false;
    }

    const char* sql =
        "UPDATE students "
        "SET name = ?, age = ?, course = ?, marks = ? "
        "WHERE rollNo = ?;";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error preparing update query!" << endl;
        sqlite3_close(DB);
        return false;
    }

    sqlite3_bind_text(stmt, 1, newName.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 2, newAge);
    sqlite3_bind_text(stmt, 3, newCourse.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_double(stmt, 4, newMarks);
    sqlite3_bind_int(stmt, 5, roll);

    exit = sqlite3_step(stmt);

    if(exit != SQLITE_DONE)
    {
        cout << "Error updating student!" << endl;

        sqlite3_finalize(stmt);
        sqlite3_close(DB);

        return false;
    }

    if(sqlite3_changes(DB) == 0)
    {
        sqlite3_finalize(stmt);
        sqlite3_close(DB);

        return false;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);

    return true;
}

bool deleteStudentFromDatabase(int roll)
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return false;
    }

    const char* sql =
        "DELETE FROM students WHERE rollNo = ?;";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error preparing delete query!" << endl;
        sqlite3_close(DB);
        return false;
    }

    sqlite3_bind_int(stmt, 1, roll);

    exit = sqlite3_step(stmt);

    if(exit != SQLITE_DONE)
    {
        cout << "Error deleting student!" << endl;

        sqlite3_finalize(stmt);
        sqlite3_close(DB);

        return false;
    }

    if(sqlite3_changes(DB) == 0)
    {
        sqlite3_finalize(stmt);
        sqlite3_close(DB);

        return false;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);

    return true;
}

void studentStatisticsFromDatabase()
{
    sqlite3* DB;

    int exit = sqlite3_open("students.db", &DB);

    if(exit != SQLITE_OK)
    {
        cout << "Error opening database!" << endl;
        return;
    }

    const char* sql =
        "SELECT COUNT(*), "
        "AVG(marks), "
        "MAX(marks), "
        "MIN(marks) "
        "FROM students;";

    sqlite3_stmt* stmt;

    exit = sqlite3_prepare_v2(DB, sql, -1, &stmt, NULL);

    if(exit != SQLITE_OK)
    {
        cout << "Error preparing statistics query!" << endl;
        sqlite3_close(DB);
        return;
    }

    if(sqlite3_step(stmt) == SQLITE_ROW)
    {
        int totalStudents =
            sqlite3_column_int(stmt, 0);

        if(totalStudents == 0)
        {
            cout << "No Students Available!" << endl;

            sqlite3_finalize(stmt);
            sqlite3_close(DB);

            return;
        }

        double averageMarks =
            sqlite3_column_double(stmt, 1);

        double highestMarks =
            sqlite3_column_double(stmt, 2);

        double lowestMarks =
            sqlite3_column_double(stmt, 3);

        cout << "\n==================================" << endl;
        cout << "      STUDENT STATISTICS" << endl;
        cout << "==================================" << endl;

        cout << "Total Students : "
             << totalStudents << endl;

        cout << "Average Marks  : "
             << averageMarks << endl;

        cout << "Highest Marks  : "
             << highestMarks << endl;

        cout << "Lowest Marks   : "
             << lowestMarks << endl;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(DB);
}