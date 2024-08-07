import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { databases } from "../../appWrite";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";
const LISTS = ["todo", "in-progress", "complete"];
const PRIORIRY = ["high", "medium", "normal", "low"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen }) => {
  const task = "";
  const documentId = uuidv4();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = (data) => {
    console.log("hi",data,stage,priority,team);
   const taskData ={
         title: data.title,
         date:data.date,
         status:stage,
         priority:priority,
         assingnee:team[0]
    
    }
    try {
      setTimeout(() => {
        const response = databases.createDocument('66b30edc003c5993210e', '66b317e300240053a94a', documentId, taskData);
        console.log('Document created successfully', response);
        setOpen(false)
        // window.location.reload();
      }, 500);

    } catch (error) {
      console.error('Error creating document:', error);
    }finally{
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    
    }
    
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

             
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  Uploading assets
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
