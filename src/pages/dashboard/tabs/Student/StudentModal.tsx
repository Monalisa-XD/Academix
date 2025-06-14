import Input from "../../../../components/Input";

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

interface StudentModalProps {
  editMode: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  currentStudent: Student;
  setShowModal: (modal: boolean) => void;
}

const StudentModal = ({
  editMode,
  handleSubmit,
  handleInputChange,
  currentStudent,
  setShowModal,
}: StudentModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editMode ? "Edit Student" : "Add New Student"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Personal Info */}
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={currentStudent.name}
                onChange={handleInputChange}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={currentStudent.email}
                onChange={handleInputChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={currentStudent.phone}
                onChange={handleInputChange}
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={currentStudent.dob}
                onChange={handleInputChange}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="gender"
                value={
                  currentStudent.gender.length === 0
                    ? ""
                    : currentStudent.gender
                }
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
              <Input
                label="Address"
                name="address"
                value={currentStudent.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Right Column - Academic Info */}
            <div className="space-y-4">
              <Input
                label="Department"
                name="department"
                value={currentStudent.department}
                onChange={handleInputChange}
              />
              <Input
                label="Roll Number"
                name="rollNumber"
                value={currentStudent.rollNumber}
                onChange={handleInputChange}
              />
              <Input
                label="Semester"
                name="semester"
                value={currentStudent.semester}
                onChange={handleInputChange}
              />
              <Input
                label="Admission Date"
                type="date"
                name="admissionDate"
                value={currentStudent.admissionDate}
                onChange={handleInputChange}
              />
              <Input
                label="Guardian Name"
                name="guardianName"
                value={currentStudent.guardianName}
                onChange={handleInputChange}
              />
              <Input
                label="Guardian Phone"
                name="guardianPhone"
                value={currentStudent.guardianPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              {editMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
