import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    title: 'User LogOut Successful.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
            })
            .catch(error => console.log(error))
    }


    return (
        <div className="navbar bg-base-200">
            <div className="flex-1">
                <NavLink to='/' className="btn btn-ghost text-xl">Task Manager</NavLink>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 flex justify-center items-center gap-5">
                    <NavLink to="/add"><button className='btn btn-sm border-0 border-b-4 border-r-4 normal-case border-green-600'><span className='text-green-600'>Add task</span></button></NavLink>
                    <NavLink to="/mytask"><button className='btn btn-sm border-0 border-b-4 border-r-4 normal-case border-green-600'><span className='text-green-600'>My Task</span></button></NavLink>
                    {
                        user ?
                            <div className="dropdown dropdown-end">
                                <div className="tooltip tooltip-left" data-tip={user?.displayName}>
                                    <button><label className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full" >
                                            <img src={user?.photoURL} />
                                        </div>
                                    </label></button>
                                </div>
                                <ul tabIndex={0} className="mt-3 py-5 z-10 shadow-xl menu menu-sm dropdown-content  rounded-box bg-slate-900 w-40">
                                    <button onClick={handleLogOut} className='btn btn-sm bg-white w-9/12 mx-auto border-0 border-b-4 border-r-4 normal-case border-green-600'><span className='text-green-600'>Log Out</span></button>
                                </ul>
                            </div>
                            : <> <NavLink to="/login"><button className='btn btn-sm bg-slate-700 border-0 border-b-4 border-r-4 normal-case border-green-600'><span className='text-green-600'>Login</span></button></NavLink> </>
                    }

                </ul>
            </div>
        </div>
    )
};

export default Navbar;

