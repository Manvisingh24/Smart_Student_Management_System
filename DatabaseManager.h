#ifndef DATABASEMANAGER_H
#define DATABASEMANAGER_H

#include "Student.h"
#include <string>

bool initializeDatabase();
bool addStudentToDatabase(const Student& s);
void migrateStudentsFromFile();
void displayStudentsFromDatabase();
bool searchStudentInDatabase(int roll);
bool updateStudentInDatabase(int roll, const string& newName, int newAge, 
    const string& newCourse, float newMarks);
bool deleteStudentFromDatabase(int roll);

void studentStatisticsFromDatabase();
void showTopperFromDatabase();
void sortStudentsByRollNoFromDatabase();
void sortStudentsByNameFromDatabase();
void sortStudentsByMarksFromDatabase();

#endif