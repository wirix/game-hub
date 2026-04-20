import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import GameDetailPage from './pages/GameDetailPage';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Создадим этот компонент

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'games/:slug',
        element: <GameDetailPage />,
      },
      {
        path: 'profile/',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login/',
        element: <Login />,
      },
      {
        path: 'register/',
        element: <Register />,
      },
    ],
  },
]);

export default router;
