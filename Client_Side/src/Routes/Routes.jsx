import {
    createBrowserRouter
} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import Login from "../userlog/Login";
import Register from "../userlog/Register";
import AddTask from "../Pages/AddTask";
import Alltask from "../Pages/Alltask";
import EditTask from "../Pages/EditTask";
import ErrorPage from "../../ErrorPage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/add',
                element: <AddTask></AddTask>
            },
            {
                path: '/mytask',
                element: <Alltask></Alltask>
            },
            {
                path: "editTask/:id",
                element: <EditTask />,
                loader: ({ params }) =>fetch(`http://localhost:5000/tasks/${params.id}`)
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/signup",
                element: <Register></Register>
            }
        ]
    }
]);