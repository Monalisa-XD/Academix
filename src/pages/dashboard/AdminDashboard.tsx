import { useState, type Dispatch, type SetStateAction } from "react";
import SideBar from "../../components/SideBar";
import FacultyTab from "./tabs/Faculty/FacultyTab";
import StudentTab from "./tabs/Student/StudentTab";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AdminDashboardProps {
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setUser }) => {
  // const navigator = useNavigate();
  const [activeTab, setActiveTab] = useState("faculty");

  const handleLogout = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 shadow-sm">
          <div className="flex items-center">
            <h1 className="md:text-2xl text-xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "faculty" && <FacultyTab />}

          {activeTab === "students" && <StudentTab />}

          {/* {activeTab === "notices" && <NoticesTab />} */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
