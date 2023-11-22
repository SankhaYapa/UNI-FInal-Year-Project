import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UploadResume from "./pages/resume/uploadResume/UploadResume";
import { BuildResume } from "./pages/resume/buildResume/BuildResume";
import { Profile } from "./pages/profile/Profile";
import HomeVideos from "./pages/pagesvideos/HomeVideos";
import Videos from "./pages/pagesvideos/Video";
import { Jobs } from "./pages/jobs/Jobs";
import { EditAccount } from "./pages/editAcount/EditAccount";
import NewResume from "./pages/resume/newResume/NewResume";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage";
import { RecomendedCources } from "./pages/recommendations/RecomendedCources";


function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
      
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/uploadResume",
          element: <UploadResume />,
        },
        {
          path: "/uploadResume/newResume/",
          element: <NewResume />,
        },
        {
          path: "/recommendations",
          element: <RecommendationsPage />,
        },
        {
          path: "/uploadResume/buildResume",
          element: <BuildResume />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/recommendedCourses",
          element: <RecomendedCources />,
        },
        {
          path: "/recommendedCourses/:id",
          element: <Videos />,
        },
        {
          path: "/jobs",
          element: <Jobs />,
        },
        {
          path: "/profile/editprofile",
          element: <EditAccount />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
