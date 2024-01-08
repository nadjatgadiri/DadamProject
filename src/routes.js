import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/Users/UsersList';
import StudentPage from './pages/Students/Studentslist';
import SchooolinfoupdatePage from './pages/profileEcole/addschoolinfo';
import RegistrationList from './pages/registration/RegistrationList';
import Updatepassword from './pages/Users/Updateuserpassword';
import TeacherPage from './pages/Teachers/Teacherslist';
import RegistrationPage from './pages/registration/addRegistration';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUser from './pages/Users/AddUser';


import Home from "./pages/webSitePages/home"
import CategoryList from "./pages/webSitePages/menuCategoriesProgramme"
import MenuProgrammes from "./pages/webSitePages/menuProgrammes"
import ProgrammeProfileHome from "./pages/webSitePages/profileProgramme"

import AddStudent from './pages/Students/addStudent';
import AddTeacher from './pages/Teachers/addTeacher';
import StudentProfile from './pages/Students/ProfileStudent';
// categorie 
import CategoriePage from './pages/Categorie/CategoriesList';
// class
import ClassPage from './pages/Salles/SallesList';
// Programme
import AddProgramme from './pages/Programme/addProgramme';
import ProgrammePage from './pages/Programme/ProgrammeList';
import UpdateProgramme from './pages/Programme/updateProgramme';
import ProgrameProfile from './pages/Programme/programeProfile';

// ----------------------------------------------------------------------
export default function Router() {
  const isAuthenticated =
    localStorage.getItem("userID") !== null;
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
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
        { path: 'Class', element: <ClassPage /> },
        { path: 'addProgramme', element: <AddProgramme /> },
        { path: 'Programme', element: <ProgrammePage /> },
        { path: 'updateProgramme/:id', element: <UpdateProgramme /> },
        { path: 'ProgrameProfile/:id', element: <ProgrameProfile /> },
        { path: 'addRegistration', element: <RegistrationPage /> },
        { path: 'Categorie', element: <CategoriePage /> },
        { path: 'Class', element: <ClassPage /> },
        { path: 'registration', element: <RegistrationList /> },
        { path: 'schooledit', element: <SchooolinfoupdatePage /> },
        { path: 'passwordedit', element: <Updatepassword /> },
        { path: 'StudentProfile/:id', element: <StudentProfile /> },

      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      path: '/home',
      // element: <Home />,
      children: [
        { path: '', element: <Home /> },
        { path: 'Categories/:catId', element: <CategoryList /> }, // 'Categories' changed to 'categories'
        { path: 'Programmes', element: <MenuProgrammes /> }, // 'Categories' changed to 'categories'
        { path: 'ProgrammeProfile/:progId', element: <ProgrammeProfileHome /> }, // 'Categories' changed to 'categories'


      ]
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
