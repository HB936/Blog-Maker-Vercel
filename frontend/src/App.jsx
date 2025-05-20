import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Create from './pages/Create'
import Drafts from './pages/Drafts'
import { ToastContainer, toast } from 'react-toastify'
function App() {
  const routes = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Home />
          },
          {
            path: "create",
            element: <Create />
          },
          {
            path: "drafts",
            element: <Drafts/>
          }
        ]
      }
    ]
  )
  return (
    <>
    <ToastContainer />
      <RouterProvider router={routes} />
    </>
  )
}

export default App
