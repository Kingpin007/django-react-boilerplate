import { createBrowserRouter } from 'react-router';

import { AuthProvider } from '@/js/contexts/AuthContext';
import { Layout } from '@/js/components/Layout';
import Dashboard from '@/js/pages/Dashboard';
import Home from '@/js/pages/Home';
import Login from '@/js/pages/Login';
import Signup from '@/js/pages/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      { index: true, Component: Home },
      { path: 'dashboard', Component: Dashboard },
    ],
  },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
]);

export default router;
