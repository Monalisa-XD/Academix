import { useState } from "react";
import { FiLogOut, FiMenu, FiUsers } from "react-icons/fi";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const tabs = [
  { id: "faculty", name: "Faculty", icon: <FiUsers size={20} /> },
  { id: "students", name: "Students", icon: <FiUsers size={20} /> },
];

const SideBar = ({ activeTab, setActiveTab, handleLogout }: SideBarProps) => {
  // const navigator = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768 ? true : false
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-700 to-indigo-800 text-white ${
        sidebarOpen ? "w-64" : "w-14"
      } flex-shrink-0 transition-all duration-300`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">Academix</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="mt-8">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center py-3 px-4 hover:bg-blue-600 cursor-pointer ${
              activeTab === tab.id ? "bg-blue-600" : ""
            }`}
          >
            {tab.icon}
            {sidebarOpen && <span className="ml-4">{tab.name}</span>}
          </a>
        ))}
        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="flex w-full items-center py-3 px-4
          hover:bg-blue-600 cursor-pointer"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
