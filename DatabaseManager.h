#ifndef DATABASEMANAGER_H
#define DATABASEMANAGER_H

#include "Student.h"

bool initializeDatabase();
bool addStudentToDatabase(const Student& s);
void migrateStudentsFromFile();
void displayStudentsFromDatabase();

#endif