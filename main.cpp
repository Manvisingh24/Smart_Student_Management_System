#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Student{
    public:
        int rollNo;
        string name;
        int age;
        string course;
        float marks;
};

vector<Student> students;

void addStudent()
{
    Student s;

    cout << "Enter Roll Number: ";
    cin >> s.rollNo;

    cin.ignore();

    cout<<"Enter Name:";
    getline(cin, s.name);

    cout<<"Enter Age:";
    cin>>s.age;

    cin.ignore();

    cout<<"Enter Course:";
    getline(cin, s.course);

    cout<<"Enter Marks:";
    cin>>s.marks;

    students.push_back(s);

    cout<<"\nStudent Added Successfully!\n";
}
void displayStudents(){
    if(students.empty()){
        cout<<"No Stdudents found!"<<endl;
        return;
    }
    cout<<"\n=====STUDENTS LIST=====\n";

    for(int i=0; i<students.size(); i++){
        cout<<"\nRoll Number :"<< students[i].rollNo << endl;
        cout<<"Name :"<< students[i].name << endl;
        cout<<"Age :"<< students[i].age << endl;
        cout<<"Course :"<< students[i].course << endl;
        cout<<"Marks :"<< students[i].marks << endl;
        cout<<"---------------------------"<<endl;
    }
}
void searchStudents(){
    int roll;

    cout<<"Enter Roll Number to search:";
    cin>>roll;

    bool found = false;

    for(int i=0; i<students.size(); i++){

        if(students[i].rollNo == roll)
        {
            found = true;

        cout << "\nStudent Found!" << endl;
         cout << "Roll Number : " << students[i].rollNo << endl;
        cout << "Name : " << students[i].name << endl;
        cout << "Age : " << students[i].age << endl;
        cout << "Course : " << students[i].course << endl;
        cout << "Marks : " << students[i].marks << endl;

        break;
        }
    }
    if(!found)
    {
        cout << "Student Not Found!" << endl;
    }
}
void deleteStudent(){
    int roll;

    cout << "Enter Roll Number to Delete: ";
    cin >> roll;

    bool found = false;

    for(int i = 0; i < students.size(); i++)
    {
        if(students[i].rollNo == roll)
        {
            students.erase(students.begin() + i);

            found = true;

            cout << "Student Deleted Successfully!" << endl;

            break;
        }
    }
    if(!found)
    {
        cout << "Student Not Found!" << endl;
    }
}

int main(){
    int choice;

    while(true)
    {
        cout << "==================================" << endl;
        cout << " SMART STUDENT MANAGEMENT SYSTEM" << endl;
        cout << "==================================" << endl;
        cout << "1. Add Student" << endl;
        cout << "2. Display Students" << endl;
        cout << "3. Search Student" << endl;
        cout << "4. Delete Student" << endl;
        cout << "5. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch(choice)
        {
            case 1:
            addStudent();
            break;

            case 2:
            displayStudents();
            break;

            case 3:
            searchStudents();
            break;

            case 4:
            deleteStudent();
            break;

            case 5:
            cout << "Thank you for using the Smart Student Management System!" << endl;
            return 0;

            default:
            cout << "Invalid Choice!" << endl;
        }
    }
    return 0;
}