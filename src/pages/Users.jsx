import React, { useState,useEffect } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
// import { summary } from "../assets/data";
import { databases } from "../appWrite";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userActionHandler = () => {};
  const deleteHandler = async () => {
    try {
      await databases.deleteDocument(
        '66b30edc003c5993210e', // Database ID
        '66b34ee30007c705f964', // Collection ID
        selected
      );

      setTaskData((prevData) => ({
        ...prevData,
        last10Task: prevData.last10Task.filter((task) => task._id !== selected),
      }));
      setOpenDialog(false);
      setSelected(null);
    } catch (err) {
      setError(err.message);
    }
  };


  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await databases.listDocuments(
          '66b30edc003c5993210e', // Database ID
          '66b34ee30007c705f964' // Collection ID
        );

        const totalTasks = response.total;
        const last10Task = response.documents.slice(-10).map(task => ({
          _id: task.$id,
          name: task.name,
          email: task.email,
          role: task.role,
        
        }));

        setTaskData({ totalTasks, last10Task });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Name</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {task.name.charAt(0)}
            </span>
          </div>
          {task.name}
        </div>
      </td>

  
      <td className='p-2'>{task.email || "user.email.com"}</td>
      <td className='p-2'>{task.role}</td>

      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(task)}
        />

        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(task?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {taskData.last10Task.map((task, index) => (
                  <TableRow key={index} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;