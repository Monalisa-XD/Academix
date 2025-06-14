import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import FacultyModal from "./FacultyModal";
import FacultyRow from "../../../../components/FacultyRow";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Faculty = {
  id: string;
  name: string;
  department: string;
  education: string;
  email: string;
  phone: string;
  specialization: string;
  isHod: boolean;
  joiningDate: string;
};

const FacultyTab = () => {
  // State for search and filters
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty>({
    id: "",
    name: "",
    department: "",
    education: "",
    email: "",
    phone: "",
    specialization: "",
    isHod: false,
    joiningDate: "",
  });

  useEffect(() => {
    const getFaculties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/faculties`);
        const data = await response.json();
        const sortedData = data.sort((a: Faculty, b: Faculty) =>
          a.name.localeCompare(b.name)
        );
        setDepartments(
          Array.from(
            new Set(sortedData.map((member: Faculty) => member.department))
          )
        );
        setFaculty(sortedData);
        setFilteredFaculty(sortedData);
      } catch (error) {
        console.log("Error fetching faculties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getFaculties();
  }, []);

  // Filter faculty based on search term and filters
  useEffect(() => {
    const filtered = faculty.filter((member) => {
      return (
        member.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        (departmentFilter === "All Departments" ||
          member.department === departmentFilter)
      );
    });
    setFilteredFaculty(filtered);
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, faculty]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle add new faculty
  const handleAddFaculty = () => {
    setEditMode(false);
    setCurrentFaculty({
      id: "",
      name: "",
      department: "",
      education: "",
      email: "",
      phone: "",
      specialization: "",
      isHod: false,
      joiningDate: "",
    });
    setShowModal(true);
  };

  // Handle edit faculty
  const handleEditFaculty = (member: Faculty) => {
    setEditMode(true);
    setCurrentFaculty(member);
    setShowModal(true);
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (id: string) => {
    try {
      if (
        window.confirm("Are you sure you want to delete this faculty member?")
      ) {
        await fetch(`${API_BASE_URL}/faculties/${id}`, {
          method: "DELETE",
        });
        const res = faculty.filter((member) => member.id !== id);
        setFilteredFaculty(res);
        setFaculty(res);
      } else {
        return;
      }
    } catch (error) {
      console.log("Error deleting faculty:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editMode) {
        await fetch(`${API_BASE_URL}/faculties/${currentFaculty.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentFaculty),
        });
        const updatedData = faculty.map((member) =>
          member.id === currentFaculty.id ? currentFaculty : member
        );
        setFilteredFaculty(updatedData);
        setFaculty(updatedData);
      } else {
        const newFaculty = {
          name: currentFaculty.name,
          department: currentFaculty.department,
          education: currentFaculty.education,
          email: currentFaculty.email,
          phone: currentFaculty.phone,
          specialization: currentFaculty.specialization,
          isHod: currentFaculty.isHod,
          joiningDate:
            currentFaculty.joiningDate.length === 0
              ? new Date().toISOString().split("T")[0]
              : currentFaculty.joiningDate,
        };

        const res = await fetch(`${API_BASE_URL}/faculties`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFaculty),
        });
        const data = await res.json();

        setFilteredFaculty([...faculty, data]);
        setFaculty([...faculty, data]);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    }

    setShowModal(false);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "isHod") {
      setCurrentFaculty({
        ...currentFaculty,
        [name]: value === "Yes" ? true : false,
      });
    } else {
      setCurrentFaculty({ ...currentFaculty, [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Faculty Management
          </h2>
          <button
            onClick={handleAddFaculty}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center w-full sm:w-auto justify-center cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Add New Faculty
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
                <option key={department} value={department}>
                  {department}
                </option>
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
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Position
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No faculty members found
                  </td>
                </tr>
              ) : (
                (currentItems ?? []).map((member) => (
                  <FacultyRow
                    member={member}
                    key={member.id}
                    handleEditFaculty={handleEditFaculty}
                    handleDeleteFaculty={handleDeleteFaculty}
                  />
                ))
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
              {Math.min(indexOfLastItem, filteredFaculty.length)}
            </span>{" "}
            of <span className="font-medium">{filteredFaculty.length}</span>{" "}
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
        <FacultyModal
          editMode={editMode}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          currentFaculty={currentFaculty}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default FacultyTab;
