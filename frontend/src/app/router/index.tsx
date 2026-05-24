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
import RoleRoute from "../../components/RoleRoute";

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
      { path: "dashboard", element: <RoleRoute roles={['student']}><Dashboard /></RoleRoute> },
      { path: "teacher-dashboard", element: <RoleRoute roles={['teacher']}><TeacherDashboard /></RoleRoute> },
      { path: "admin-dashboard", element: <RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute> },
      { path: "subjects", element: <RoleRoute roles={['student', 'teacher', 'admin']}><Subjects /></RoleRoute> },
      { path: "topics", element: <RoleRoute roles={['student', 'teacher', 'admin']}><Topics /></RoleRoute> },
      { path: "mock-testlar", element: <RoleRoute roles={['student']}><MockTests /></RoleRoute> },
      { path: "ai-tutor", element: <AITutor /> },
      { path: "darsliklar", element: <RoleRoute roles={['student']}><Lessons /></RoleRoute> },
      { path: "progress", element: <RoleRoute roles={['student']}><Progress /></RoleRoute> },
      { path: "leaderboard", element: <RoleRoute roles={['student']}><Leaderboard /></RoleRoute> },
      { path: "history", element: <RoleRoute roles={['student']}><History /></RoleRoute> }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
