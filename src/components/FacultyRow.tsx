import { FiEdit, FiTrash2 } from "react-icons/fi";

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

type FacultyRowProps = {
  member: Faculty;
  handleEditFaculty: (member: Faculty) => void;
  handleDeleteFaculty: (id: string) => void;
};

const FacultyRow = ({
  member,
  handleEditFaculty,
  handleDeleteFaculty,
}: FacultyRowProps) => {
  return (
    <tr key={member.id}>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {member.name}
            </div>
            <div className="text-sm text-gray-500">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        {member.department}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
        {member.specialization}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
        {member.joiningDate}
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
  );
};

export default FacultyRow;
