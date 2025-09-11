import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import AuthedLayout from "./layouts/AuthedLayout";
import Badges from "./pages/Badges";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import TeamBuilder from "./pages/TeamBuilder";
import { store } from "./store";

const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
      { path: "/", element: <Login /> },

      {
        element: <AuthedLayout />,
        children: [
          { path: "/builder", element: <TeamBuilder /> },
          { path: "/profile", element: <Profile /> },
          { path: "/badges", element: <Badges /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);