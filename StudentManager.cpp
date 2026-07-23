#include "StudentManager.h"
#include "Student.h"
#include "FileManager.h"
#include "DatabaseManager.h"

#include <iostream>
#include <vector>
#include <string>

#include <fstream>

using namespace std;

extern vector<Student> students;

void addStudent()
{
    Student s;

    cout << "Enter Roll Number: ";
    cin >> s.rollNo;

    for(int i = 0; i < students.size(); i++)
    {
        if(students[i].rollNo == s.rollNo)
        {
            cout << "Roll Number already exists!" << endl;
            return;
        }
    }

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
        students.push_back(s);
        cout << "\nStudent Added Successfully!\n";
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

void studentStatistics(){

    if(students.empty()){
    cout << "No Students Available!" << endl;
    return;
    }
    
    int totalMarks = 0;
    int highestMarks = students[0].marks;
    int lowestMarks = students[0].marks;

    for(int i = 0; i < students.size(); i++)
    {
       totalMarks += students[i].marks;
       
       if(students[i].marks > highestMarks)
        {
            highestMarks = students[i].marks;
        }

        if(students[i].marks < lowestMarks)
        {
            lowestMarks = students[i].marks;
        }
    }
    double averageMarks = (double)totalMarks / students.size();

    cout << "\n==================================" << endl;
    cout << "      STUDENT STATISTICS" << endl;
    cout << "==================================" << endl;

    cout << "Total Students : " << students.size() << endl;
    cout << "Average Marks  : " << averageMarks << endl;
    cout << "Highest Marks  : " << highestMarks << endl;
    cout << "Lowest Marks   : " << lowestMarks << endl;
}

void showTopper(){
    if(students.empty())
    {
        cout << "No Students Available!" << endl;
        return;
    }

    Student topper = students[0];

    for(int i = 0; i < students.size(); i++)
    {
        if(students[i].marks > topper.marks)
        {
            topper = students[i];
        }
    }
    cout << "\n==================================" << endl;
    cout << "            TOPPER" << endl;
    cout << "==================================" << endl;

    cout << "Roll Number : " << topper.rollNo << endl;
    cout << "Name        : " << topper.name << endl;
    cout << "Age         : " << topper.age << endl;
    cout << "Course      : " << topper.course << endl;
    cout << "Marks       : " << topper.marks << endl;
}

void sortStudents(){

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
            sortByRollNo();
            break;

        case 2:
            sortByName();
            break;

        case 3:
            sortByMarks();
            break;

        case 4:
            return;

        default:
            cout << "Invalid Choice!" << endl;
    }
}

void sortByRollNo()
{
    cout << "sortByRollNo() called!" << endl;
    if(students.empty())
    {
        cout << "No Students Available!" << endl;
        return;
    }
    for(int i = 0; i < students.size() - 1; i++)
    {
        for(int j = 0; j < students.size() - i - 1; j++)
        {
            if(students[j].rollNo > students[j + 1].rollNo)
            {
                swap(students[j], students[j + 1]);
            }
        }
    }
    saveToFile();

    cout << "Students sorted by Roll No. successfully!" << endl;
}

void sortByName()
{
    if(students.empty())
    {
        cout << "No Students Available!" << endl;
        return;
    }
    for(int i = 0; i < students.size() - 1; i++)
    {
        for(int j = 0; j < students.size() - i - 1; j++)
        {
            if(students[j].name > students[j + 1].name)
            {
                swap(students[j], students[j + 1]);
            }
        }
    }
    saveToFile();

    cout << "Students sorted by Name successfully!" << endl;
}

void sortByMarks()
{
    if(students.empty())
    {
        cout << "No Students Available!" << endl;
        return;
    }
    for(int i = 0; i < students.size() - 1; i++)
    {
        for(int j = 0; j < students.size() - i - 1; j++)
        {
            if(students[j].marks > students[j+1].marks)
            {
                swap(students[j], students[j+1]);
            }
        }
    }
    saveToFile();

    cout << "Students sorted by Marks successfully!" << endl;
}

void exportReport(){
    if(students.empty())
    {
        cout << "No Students Available!" << endl;
        return;
    }
    ofstream file("student_report.txt");

    if(!file)
    {
        cout << "Error creating report file!" << endl;
        return;
    }

    file << "==================================" << endl;
    file << "      STUDENT REPORT" << endl;
    file << "==================================" << endl;
    file << "Total Students : " << students.size() << endl;
    file << endl;

    for(int i = 0; i < students.size(); i++)
    {
        file << "----------------------------------" << endl;
        file << "Roll Number : " << students[i].rollNo << endl;
        file << "Name        : " << students[i].name << endl;
        file << "Age         : " << students[i].age << endl;
        file << "Course      : " << students[i].course << endl;
        file << "Marks       : " << students[i].marks << endl;
        file << endl;
    }
    file.close();

    cout << "Student report exported successfully to student_report.txt!" << endl;
}