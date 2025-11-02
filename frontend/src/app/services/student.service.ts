import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://student-details-6277.onrender.com/api/students';

  constructor(private http: HttpClient) {}

  // Get all students
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new student
  addStudent(studentData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, studentData);
  }

  // Update existing student
  updateStudent(id: string, studentData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, studentData);
  }

  // Delete a student
  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Upload CSV file
  uploadCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }
}
