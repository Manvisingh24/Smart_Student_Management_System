#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

//Function prototypes
void addStudent();
void displayStudent();
void searchStudent();
void updateStudent();
void deleteStudent();
void saveToFile();
void loadFromFile();

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

    saveToFile();
}
void displayStudent(){
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
void searchStudent(){
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

            saveToFile();

            break;
        }
    }
    if(!found)
    {
        cout << "Student Not Found!" << endl;
    }
}
void updateStudent(){
    int roll;

    cout << "Enter Roll Number to Update: ";
    cin >> roll;

    bool found = false;

    for(int i = 0; i < students.size(); i++)
    {
        if(students[i].rollNo == roll)
        {
            found = true;

            cout << "Enter New Name: ";
            cin.ignore();
            getline(cin, students[i].name);

            cout << "Enter New Age: ";
            cin >> students[i].age;

            cout << "Enter New Course: ";
            cin.ignore();
            getline(cin, students[i].course);

            cout << "Enter New Marks: ";
            cin >> students[i].marks;

            cout << "Student Updated Successfully!" << endl;

            saveToFile();

            break;
        }
    }
    if(!found)
    {
        cout << "Student Not Found!" << endl;
    }
}
void saveToFile(){

    ofstream file("students.txt");

    for(int i = 0; i < students.size(); i++)
    {
        file << students[i].rollNo << endl;
        file << students[i].name << endl;
        file << students[i].age << endl;
        file << students[i].course << endl;
        file << students[i].marks << endl;
    }
    file.close();

}
void loadFromFile(){

    ifstream file("students.txt");

    if(!file)
    {
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

        students.push_back(s);
    }

    file.close();
}


int main(){
    int choice;

    loadFromFile();

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
        cout << "6. Exit" << endl;
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
            cout << "Thank you for using the Smart Student Management System!" << endl;
            return 0;

            default:
            cout << "Invalid Choice!" << endl;
        }
    }
    return 0;
}