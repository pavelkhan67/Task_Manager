import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
const AllTask = () => {

    const [data, setData] = useState([]);
    const [axiosSecure] = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get('/addedtask')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    //   handle Status and Update Status
    const handleStatus = (id) => {
        fetch(`http://localhost:5000/status/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ status: "Completed" }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.modifiedCount > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "successfully Updated Your Task",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });
    };
    //Handle Delete
    const handleDelete = (task) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete ${task.title} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/addedtask/${task._id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            Swal.fire(
                                'Deleted!',
                                'Your Selected Task has been deleted.',
                                'success'
                            );
                        }
                    });
            }
        });
    }

    return (
        <div className="bg-base-200 mt-10">
            <h2 className="text-center font-semibold text-xl pt-5">All Task List</h2>
            {data.length > 0 ?
                <div className="table-responsive">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Update Status</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {data.map((task, index) => (
                            <tbody key={task._id}>
                                <tr className="text-start">
                                    <th scope="row">{index + 1}</th>
                                    <td>{task.title}</td>
                                    <td>{task.info}</td>
                                    <td>
                                        <button
                                            onClick={() => handleStatus(task._id)}
                                            className={`${task.status == "pending"
                                                ? "text-red-500 "
                                                : "text-green-600"
                                                }`}
                                        >
                                            {task.status}
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/editTask/${task._id}`}>
                                            <button className="btn btn-sm btn-ghost bg-blue-600 text-white">
                                                <FaEdit /></button>
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(task)}
                                            className="btn btn-sm btn-ghost bg-red-600  text-white"><FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div> :
                <div className="text-center mt-5">
                    <p> No Task <Link to="/add" className="text-green-600 text-sm underline">
                        Add New Task
                    </Link></p>
                </div>}
        </div>
    );
};

export default AllTask;