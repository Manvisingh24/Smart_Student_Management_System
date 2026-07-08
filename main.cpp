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

int main(){
    addStudent();
    displayStudents();
    return 0;
}