import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa';


function Alltask() {
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

    const handleDelete = (task, refetch) => {
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
        <div className="overflow-x-auto w-full pb-10">
            <table className="table w-full ">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((task, index) => <tr
                            key={task._id}
                        >
                            <td>
                                {index + 1}
                            </td>

                            <td>
                                {task.title}
                            </td>
                            <td>{task.status}</td>
                            <td>{task.info}</td>
                            <td>
                                <div className='flex gap-2'>
                                    <button onClick={() => handleEdit(task)} className="btn btn-sm btn-ghost bg-red-600  text-white"><FaTrashAlt></FaTrashAlt></button>
                                    <button onClick={() => handleDelete(task)} className="btn btn-sm btn-ghost bg-red-600  text-white"><FaTrashAlt></FaTrashAlt></button>
                                </div>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Alltask;