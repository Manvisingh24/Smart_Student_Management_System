#ifndef DATABASEMANAGER_H
#define DATABASEMANAGER_H

#include "Student.h"
#include <string>

bool initializeDatabase();
bool addStudentToDatabase(const Student& s);
void displayStudentsFromDatabase();
bool searchStudentInDatabase(int roll);
bool updateStudentInDatabase(int roll, const std::string& newName, int newAge, 
    const std::string& newCourse, float newMarks);
bool deleteStudentFromDatabase(int roll);

void studentStatisticsFromDatabase();
void showTopperFromDatabase();

void sortStudentsByRollNoFromDatabase();
void sortStudentsByNameFromDatabase();
void sortStudentsByMarksFromDatabase();

void exportReportFromDatabase();

#endif