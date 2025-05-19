import RootLayout from '@/components/layout/RootLayout';
import LoginPage from '@/pages/LoginPage';
import App from '@/App';
import RegisterPage from '@/pages/RegisterPage';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<LandingPage />}>
          {' '}
        </Route>
        <Route path="login" element={<LoginPage />}>
          {' '}
        </Route>
        <Route path="signup" element={<RegisterPage />}>
          {' '}
        </Route>
      </Route>
      {/* <Route path='contact' element={<Contact/>}> </Route>
        <Route path='user/:userid' element={<User/>}> </Route>
        <Route loader={githubInfoLoader} path='github' element={<Github/>}> </Route> */}
    </>
  )
);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />,
//     children: [
//       { path: '', element: <Home /> },
//       { path: 'about', element: <About /> },
//       { path: 'contact', element: <Contact /> },
//       { path: 'signup', element: <RegisterPage /> },
//     ],
//   },
//   {
//     path: '/signup',
//     element: <RegisterPage />,
//   },
//   {
//     path: '/login',
//     element: <LoginPage />,
//   },
// ]);

export default router;
