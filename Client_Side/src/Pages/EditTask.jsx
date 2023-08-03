import React from "react";
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditTask = () => {
    const taskData = useLoaderData();
    const navigate = useNavigate()
    const { register } = useForm();
    //   handle Edit Task
    const handleEditTask = (e) => {
        e.preventDefault();
        const taskTitle = e.target.title.value;
        const taskInfo = e.target.info.value;
        const task = {
            title: taskTitle,
            info: taskInfo,
        };
        fetch(
            `http://localhost:5000/edit/${taskData._id}`,
            {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(task),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.modifiedCount > 0) {
                    navigate('/')
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Successfully edited Task",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });
    };
    return (
        <div>
            <div className="w-9/12 mx-auto mt-10 bg-base-200 rounded-sm">
                <h2 className="text-lg pt-10 text-center font-semibold">Edit Your task</h2>
                <form onSubmit={handleEditTask} className='p-10'>
                    <div className="form-control w-full ">
                        <label className="label">
                            <span className="label-text font-semibold">Title*</span>
                        </label>
                        <input type="text" defaultValue={taskData.title}
                            {...register("title", { required: true, maxLength: 30 })}
                            className="input input-bordered w-full " />
                    </div>

                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text font-semibold">Description*</span>
                        </label>
                        <input type="text" {...register("info", { required: true })} defaultValue={taskData.info} className="input input-bordered w-full " />
                    </div>

                    <input className="btn btn-outline text-green-600 w-1/3 mx-auto bg-slate-100 border-0 border-b-4 border-r-4 border-green-600  form-control mt-8 mb-5 " type="submit" value="Edit Task" />
                </form>
            </div>
        </div>
    );
};

export default EditTask;