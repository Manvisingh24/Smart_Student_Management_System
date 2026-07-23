#include <iostream>
#include <vector>

#include "Student.h"
#include "FileManager.h"
#include "StudentManager.h"
#include "DatabaseManager.h"

using namespace std;

vector<Student> students;


int main(){

    initializeDatabase();

    int choice;

    // loadFromFile();

    while(true)
    {
        cout << "==================================" << endl;
        cout << " SMART STUDENT MANAGEMENT SYSTEM" << endl;
        cout << "==================================" << endl;
        cout << "1. Add Student" << endl;
        cout << "2. Display Student" << endl;
        cout << "3. Search Student" << endl;
        cout << "4. Update Student" << endl;
        cout << "5. Delete Student" << endl;
        cout << "6. Student Statistics" << endl;
        cout << "7. Show Topper" << endl;
        cout << "8. Sort Students" << endl;
        cout << "9. Export Report" << endl;
        cout << "10. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch(choice)
        {
            case 1:
            addStudent();
            break;

            case 2:
            displayStudent();
            break;

            case 3:
            searchStudent();
            break;

            case 4:
            updateStudent();
            break;

            case 5:
            deleteStudent();
            break;

            case 6:
            studentStatistics();
            break;

            case 7:
            showTopper();
            break;

            case 8:
            sortStudents();
            break;

            case 9:
            exportReport();
            break;

            case 10:
            cout << "Thank you for using the Smart Student Management System!" << endl;
            return 0;

            default:
            cout << "Invalid Choice!" << endl;
        }
    }
    return 0;
}