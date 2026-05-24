import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicRoute from "../../pages/Auth/Public/PublicRoute";
import PrivateRoute from "../../pages/Auth/Private/PrivateRoute";
import MainLayout from "../../layouts/MainLayout";
import Landing from "../../pages/Landing";
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
import { useAuth } from "../../hooks/useAuth";

function HomeRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center', color: 'var(--text2)' }}>Yuklanmoqda...</div>;
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  switch (user?.role) {
    case 'teacher': return <Navigate to="/teacher-dashboard" replace />;
    case 'admin': return <Navigate to="/admin-dashboard" replace />;
    default: return <Navigate to="/dashboard" replace />;
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <HomeRoute /> },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
      {
        element: (
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        ),
        children: [
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
          { path: "history", element: <History /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
