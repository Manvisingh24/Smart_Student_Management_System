#include "filemanager.h"
#include "student.h"

#include <fstream>
#include <vector>

using namespace std;

extern vector<Student> students;

void saveToFile()
{
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

void loadFromFile()
{
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