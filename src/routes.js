import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/Users/UsersList';
import StudentPage from './pages/Students/Studentslist';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUser from './pages/Users/AddUser';
import Home from './site-web/home';
// import AddStudent from './pages/Students/AddStudent';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'student', element: <StudentPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },

        { path: 'addUser', element: <AddUser /> },
        // {path :'addStudent',element:<AddStudent/>}


      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'home',
      element: <Home />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    { path: '*', element: <Navigate to="/404" /> },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        // { path: '404', element: <Page404 /> },
        // { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
