import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export class StudentComponent implements OnInit {
  students: any[] = [];
  name = '';
  firstName = '';
  lastName = '';
  dob: string = '';
  mainCourse = '';
  filteredDepartments: string[] = [];
  course = '';
  courseType = '';
  courseTypes = ['B.E', 'B.Tech', 'MBA'];
  departmentList: string[] = [];
  courseData: any = {
    'B.E': [
      'Civil Engineering',
      'Computer Science & Engineering',
      'Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
      'Computer Science and Engineering (Cyber Security)',
      'Electrical & Electronics Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
      'Mechatronics Engineering'
    ],
    'B.Tech': [
      'Artificial Intelligence and Data Science',
      'Electronics Engineering (VLSI Design and Technology)',
      'Information Technology'
    ],
    'MBA': ['Business Administration']
  };
  city = '';
  message = '';
  editingId: string | null = null;
  searchText = '';
  sortKey = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getStudents();
  }

  updateDepartments() {
  this.filteredDepartments = this.courseData[this.mainCourse] || [];
  this.course = ''; // reset selected department when mainCourse changes
  }


  async getStudents() {
    const res = await axios.get('http://localhost:5000/api/students');
    this.students = res.data;
    this.cdr.detectChanges();
  }

  async addOrUpdateStudent() {
    this.message = '';

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.dob ||
      !this.mainCourse ||
      !this.course ||
      !this.city.trim()
    ) {
      this.message = 'Please fill all fields!';
      return;
    }


    const data = {
      name: `${this.firstName.trim()} ${this.lastName.trim()}`,
      dob: this.dob,
      course: `${this.mainCourse} - ${this.course}`,
      city: this.city.trim()
    };

    try {
      if (this.editingId) {
        await axios.put(`http://localhost:5000/api/students/${this.editingId}`, data);
        this.message = 'Student updated successfully!';
      } else {
        await axios.post('http://localhost:5000/api/students', data);
        this.message = 'Student added successfully!';
      }

      this.resetForm();
      await this.getStudents();
    } catch (err: any) {
      if (err.response?.status === 409)
        this.message = 'Duplicate student found!';
      else
        this.message = 'Error saving student.';
    }
  }

  editStudent(s: any) {
    this.editingId = s._id;
    const [first, ...rest] = s.name.split(' ');
    this.firstName = first || '';
    this.lastName = rest.join(' ') || '';
    if (s.dob) {
    const d = new Date(s.dob);
    this.dob = d.toISOString().split('T')[0]; // converts to proper input[type=date] format
    } else {
      this.dob = '';
    }
    const [main, dept] = (s.course || '').split(' - ');
    this.mainCourse = main?.trim() || '';
    this.filteredDepartments = this.courseData[this.mainCourse] || [];
    this.course = dept?.trim() || '';
    this.city = s.city || '';
    this.message = 'Editing mode...';
    this.cdr.detectChanges();
  }

  async deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      this.message = 'Student deleted successfully!';
      await this.getStudents();
    }
  }

  resetForm() {
  this.editingId = null;
  this.firstName = '';
  this.lastName = '';
  this.dob = '';
  this.mainCourse = '';
  this.course = '';
  this.city = '';
  this.filteredDepartments = [];
  this.message = '';
  }

  get filteredStudents() {
    let filtered = this.students;

    if (this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase();

      filtered = filtered.filter(s => {
        const name = s.name?.toLowerCase() || '';
        const course = s.course?.toLowerCase() || '';
        const city = s.city?.toLowerCase() || '';

        let dob = '';
        if (s.dob) {
          const date = new Date(s.dob);
          // Normalize date to "dd-MM-yyyy" format
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          dob = `${day}-${month}-${year}`.toLowerCase();
        }

        // Allow matching by name, course, city, or DOB parts (day, month, year)
        return (
          name.includes(search) ||
          course.includes(search) ||
          city.includes(search) ||
          dob.includes(search)
        );
      });
    }

    // Sorting logic
    filtered = filtered.sort((a, b) => {
      const fieldA = (a[this.sortKey] || '').toString().toLowerCase();
      const fieldB = (b[this.sortKey] || '').toString().toLowerCase();

      if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }



  setSort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

}
