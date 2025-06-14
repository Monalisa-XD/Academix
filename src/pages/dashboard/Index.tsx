import AdminDashboard from "./AdminDashboard";
import UserNotFoundPage from "../../components/UserNotFoundPage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = localStorage.getItem("user");
        if (response) {
          setUser(JSON.parse(response));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setisLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? <AdminDashboard setUser={setUser} /> : <UserNotFoundPage />;
};

export default Index;
