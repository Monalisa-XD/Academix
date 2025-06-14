import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import StudentModal from "./StudentModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  rollNumber: string;
  admissionDate: string;
  semester: string;
  dob: string;
  gender: "Male" | "Female" | "Other" | "";
  address: string;
  guardianName: string;
  guardianPhone: string;
}

const StudentTab = () => {
  // State for search and filters
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [semester, setSemester] = useState("All Semesters");
  const [departments, setDepartments] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: "",
    rollNumber: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
    dob: "",
    gender: "Male",
    address: "",
    guardianName: "",
    guardianPhone: "",
    admissionDate: "",
  });

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/students`);
        const data = await res.json();
        const sortedData = data.sort((a: Student, b: Student) =>
          a.name.localeCompare(b.name)
        );
        setStudents(sortedData);
        setFilteredStudents(sortedData);
        setDepartments(sortedData.map((member: Student) => member.department));
        setSemesters(
          Array.from(
            new Set(sortedData.map((member: Student) => member.semester))
          )
        );
      } catch (error) {
        console.log("Error fetching students:", error);
      }
    };

    getStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((member) => {
      const matchesSearch = member.name
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All Departments" ||
        member.department === departmentFilter;

      const matchessemester =
        semester === "All Semesters" || member.semester === semester;

      return matchesSearch && matchesDepartment && matchessemester;
    });
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset pagination when filters change
  }, [searchTerm, departmentFilter, semester, students]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle add new faculty
  const handleAddFaculty = () => {
    setEditMode(false);
    setCurrentStudent({
      id: `FAC-${new Date().getFullYear()}-${String(
        students.length + 1
      ).padStart(4, "0")}`,
      rollNumber: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      semester: "",
      dob: "",
      gender: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      admissionDate: "",
    });
    setShowModal(true);
  };

  // Handle edit faculty
  const handleEditFaculty = (member: Student) => {
    setEditMode(true);
    setCurrentStudent(member);
    setShowModal(true);
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      try {
        await fetch(`${API_BASE_URL}/students/${id}`, {
          method: "DELETE",
        });
        const res = students.filter((member) => member.id !== id);
        setFilteredStudents(res);
        setStudents(res);
      } catch (error) {
        console.log("Error deleting student:", error);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode) {
      await fetch(`${API_BASE_URL}/students/${currentStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStudent),
      });
      const updatedData = students.map((member) =>
        member.id === currentStudent.id ? currentStudent : member
      );
      setFilteredStudents(updatedData);
      setStudents(updatedData);
    } else {
      const newStudent = {
        name: currentStudent.name,
        rollNumber: currentStudent.rollNumber,
        email: currentStudent.email,
        phone: currentStudent.phone,
        department: currentStudent.department,
        semester: currentStudent.semester,
        dob: currentStudent.dob,
        gender: currentStudent.gender,
        address: currentStudent.address,
        guardianName: currentStudent.guardianName,
        guardianPhone: currentStudent.guardianPhone,
        admissionDate:
          currentStudent.admissionDate.length === 0
            ? new Date().toISOString().split("T")[0]
            : currentStudent.admissionDate,
      };
      const res = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      setFilteredStudents([...students, data]);
      setStudents([...students, data]);
    }

    setShowModal(false);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Student Management
          </h2>
          <button
            onClick={handleAddFaculty}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center w-full sm:w-auto justify-center cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 sm:p-6">
        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <FiSearch size={18} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 p-2 w-full sm:w-auto"
            >
              <option>All Departments</option>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 p-2 w-full sm:w-auto"
            >
              <option>All Semesters</option>
              {semesters.map((semester, index) => (
                <option key={index}>{semester}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Faculty table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Roll Number
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  semester
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {member.rollNumber}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {member.department}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {member.semester}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditFaculty(member)}
                      className="text-blue-600 hover:text-blue-900 mr-3 flex items-center sm:inline-flex cursor-pointer mb-2 sm:mb-0"
                    >
                      <FiEdit size={16} className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(member.id)}
                      className="text-red-600 hover:text-red-900 flex items-center sm:inline-flex cursor-pointer"
                    >
                      <FiTrash2 size={16} className="mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No faculty members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredStudents.length)}
            </span>{" "}
            of <span className="font-medium">{filteredStudents.length}</span>{" "}
            faculty members
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <FiChevronLeft />
            </button>
            {[...Array(Math.min(totalPages, 3)).keys()].map((number) => {
              const pageNumber = number + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            {totalPages > 3 && (
              <button className="px-3 py-1 border border-gray-300 rounded-md">
                ...
              </button>
            )}
            {totalPages > 3 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 border border-gray-300 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing faculty */}
      {showModal && (
        <StudentModal
          editMode={editMode}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          currentStudent={currentStudent}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default StudentTab;
