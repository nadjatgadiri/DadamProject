import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/Users/UsersList';
import StudentPage from './pages/Students/Studentslist';
import TeacherPage from './pages/Teachers/Teacherslist';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUser from './pages/Users/AddUser';
import Home from './site-web/home';
import AddStudent from './pages/Students/addStudent';
import AddTeacher from './pages/Teachers/addTeacher';
// categorie 
import CategoriePage from './pages/Categorie/CategoriesList';
// class
import ClassPage from './pages/Salles/SallesList';
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
        { path: 'teacher', element: <TeacherPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'addUser', element: <AddUser /> },
        { path: 'addStudent', element: <AddStudent /> },
        { path: 'addTeacher', element: <AddTeacher /> },
        { path: 'Categorie', element: <CategoriePage /> },
        { path: 'Class', element: <ClassPage /> }
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
