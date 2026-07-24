#include "StudentManager.h"
#include "Student.h"
#include "DatabaseManager.h"

#include <iostream>
#include <string>

using namespace std;

void addStudent()
{
    Student s;

    cout << "Enter Roll Number: ";
    cin >> s.rollNo;


    cin.ignore();

    cout<< "Enter Name: ";
    getline(cin, s.name);

    cout<< "Enter Age:" ;
    cin>>s.age;

    if(s.age <= 0 || s.age > 120)
    {
        cout << "Invalid Age!" << endl;
        return;
    }

    cin.ignore();

    cout<< "Enter Course: ";
    getline(cin, s.course);

    cout<< "Enter Marks: ";
    cin>>s.marks;

    if(s.marks < 0 || s.marks > 100)
    {
        cout << "Invalid Marks! Marks should be between 0 and 100." << endl;
        return;
    }

    if(addStudentToDatabase(s))
    {
        cout << "\nStudent Added Successfully!\n";
    }
    else
    {
        cout << "Roll Number already exists or student could not be added!" << endl;
    }
}

void displayStudent()
{
    displayStudentsFromDatabase();
}

void searchStudent()
{
    int roll;

    cout << "Enter Roll Number to search: ";
    cin >> roll;

    bool found = searchStudentInDatabase(roll);

    if(!found)
    {
        cout << "Student Not Found!" << endl;
    }
}

void updateStudent()
{
    int roll;

    cout << "Enter Roll Number to Update: ";
    cin >> roll;

    if(!searchStudentInDatabase(roll))
    {
        cout << "Student Not Found!" << endl;
        return;
    }

    string newName;
    int newAge;
    string newCourse;
    float newMarks;

    cout << "\nEnter New Name: ";
    cin.ignore();
    getline(cin, newName);

    cout << "Enter New Age: ";
    cin >> newAge;

    if(newAge <= 0 || newAge > 120)
    {
        cout << "Invalid Age!" << endl;
        return;
    }

    cout << "Enter New Course: ";
    cin.ignore();
    getline(cin, newCourse);

    cout << "Enter New Marks: ";
    cin >> newMarks;

    if(newMarks < 0 || newMarks > 100)
    {
        cout << "Invalid Marks! Marks should be between 0 and 100." << endl;
        return;
    }

    if(updateStudentInDatabase(roll, newName, newAge, newCourse, newMarks))
    {
        cout << "Student Updated Successfully!" << endl;
    }
    else
    {
        cout << "Failed to update student!" << endl;
    }
}

void deleteStudent()
{
    int roll;

    cout << "Enter Roll Number to Delete: ";
    cin >> roll;

    if(deleteStudentFromDatabase(roll))
    {
        cout << "Student Deleted Successfully!" << endl;
    }
    else
    {
        cout << "Student Not Found!" << endl;
    }
}

void studentStatistics()
{
    studentStatisticsFromDatabase();
}

void showTopper()
{
    showTopperFromDatabase();
}

void sortStudents()
{
    int choice;

    cout << "\n==================================" << endl;
    cout << "         SORT STUDENTS" << endl;
    cout << "==================================" << endl;
    cout << "1. Sort by Roll Number" << endl;
    cout << "2. Sort by Name" << endl;
    cout << "3. Sort by Marks" << endl;
    cout << "4. Back to Main Menu" << endl;

    cout << "Enter your choice: ";
    cin >> choice;

    switch(choice)
    {
        case 1:
            sortStudentsByRollNoFromDatabase();
            break;

        case 2:
            sortStudentsByNameFromDatabase();
            break;

        case 3:
            sortStudentsByMarksFromDatabase();
            break;

        case 4:
            return;

        default:
            cout << "Invalid Choice!" << endl;
    }
}

void exportReport()
{
    exportReportFromDatabase();
}