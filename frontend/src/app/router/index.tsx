import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../../pages/Auth/Public/PublicRoute";
import PrivateRoute from "../../pages/Auth/Private/PrivateRoute";
import MainLayout from "../../layouts/MainLayout";
import Dashboard from "../../pages/Dashboard";
import TeacherDashboard from "../../pages/TeacherDashboard";
import AdminDashboard from "../../pages/AdminDashboard";
import NotFound from "../../pages/NotFound";
import Subjects from "../../pages/Subjects";
import Topics from "../../pages/Topics";
import MockTests from "../../pages/MockTests";
import Lessons from "../../pages/Lessons";
import AITutor from "../../pages/AITutor";
import Progress from "../../pages/Progress";
import Leaderboard from "../../pages/LeaderBoard";
import History from "../../pages/History";
import Auth from "../../pages/Auth";
import RoleDashboardRedirect from "../../components/RoleDashboardRedirect";

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    )
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <RoleDashboardRedirect /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "teacher-dashboard", element: <TeacherDashboard /> },
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "subjects", element: <Subjects /> },
      { path: "topics", element: <Topics /> },
      { path: "mock-testlar", element: <MockTests /> },
      { path: "ai-tutor", element: <AITutor /> },
      { path: "darsliklar", element: <Lessons /> },
      { path: "progress", element: <Progress /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "history", element: <History /> }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
