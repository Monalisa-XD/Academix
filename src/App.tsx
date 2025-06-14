import { Route, Routes } from "react-router";
import AdminLogin from "./pages/AdminLogin";
import Index from "./pages/dashboard/Index";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Index />} />
    </Routes>
  );
};

export default App;
