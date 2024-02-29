// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    subItems: [],
  },
  {
    title: 'ressources humaines',
    icon: icon('manager-3'),
    subItems: [
      { title: 'Utilisateurs', path: '/dashboard/user' },
      { title: 'Professeurs', path: '/dashboard/teacher' },
      { title: 'Étudiants', path: '/dashboard/student' },
    ],
  },
  {
    title: 'Gestion des Programmes',
    icon: icon('management-2'),
    subItems: [
      { title: 'Programmes', path: '/dashboard/Programme' },
      { title: 'Catégories', path: '/dashboard/Categorie' },
      { title: 'Salles', path: '/dashboard/Class' },
    ],
  },
  {
    title: 'Gestion des Inscriptions',
    path: '/dashboard/registration',
    icon: icon('subscribe-14'),
  },
];

export default navConfig;
