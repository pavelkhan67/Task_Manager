import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AddTask = () => {
    const { user } = useContext(AuthContext);
    const [axiosSecure] = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        const { title, status, info } = data;
    
        const newItem = {
            title, status, info
        };
    
        axiosSecure.post('/addedtask', newItem)
            .then(data => {
                if (data.data.insertedId) {
                    reset();
                    Swal.fire({
                        icon: 'success',
                        title: 'Task added successfully',
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
    };

    return (
        <div className="w-9/12 mx-auto mt-10 bg-base-200 ">
            <form onSubmit={handleSubmit(onSubmit)} className='p-10'>
                    <div className="form-control w-full ">
                        <label className="label">
                            <span className="label-text font-semibold">Title*</span>
                        </label>
                        <input type="text" placeholder='Title'
                            {...register("title", { required: true, maxLength: 30 })}
                            className="input input-bordered w-full " />
                    </div>
                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text font-semibold">Status*</span>
                        </label>
                        <input type="text" {...register("status", { required: true })} value={'pending'} className="input input-bordered w-full " />
                    </div>
                
                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text font-semibold">Description*</span>
                        </label>
                        <input type="text" {...register("info", { required: true })} placeholder='Description' className="input input-bordered w-full " />
                    </div>

                <input className="btn btn-outline text-green-600 w-1/3 mx-auto bg-slate-100 border-0 border-b-4 border-r-4 border-green-600  form-control mt-8 mb-5 " type="submit" value="Add Task" />
            </form>
        </div>
    );
};

export default AddTask;