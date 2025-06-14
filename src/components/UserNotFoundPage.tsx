import { useNavigate } from "react-router";

const UserNotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">
        You are not logged in. Please login to access this page.
      </h1>
      <div className="flex space-x-4 *:cursor-pointer">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default UserNotFoundPage;
