import * as Sentry from '@sentry/react';
import { parse as cookieParse } from 'cookie';
import { RouterProvider } from 'react-router/dom';

import { client } from '@/js/api/client.gen';
import { AuthProvider } from '@/js/contexts/AuthContext';
import { ToastProvider } from '@/js/hooks/use-toast';
import { Toaster } from '@/js/components/Toaster';
import router from '@/js/routes';

client.instance.interceptors.request.use((request) => {
  const { csrftoken } = cookieParse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers['X-CSRFTOKEN'] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <ToastProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ToastProvider>
  </Sentry.ErrorBoundary>
);

export default App;
