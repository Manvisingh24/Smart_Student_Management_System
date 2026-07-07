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
int main(){
    addStudent();
    return 0;
}