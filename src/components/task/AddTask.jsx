import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "/src/components/ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "/src/components/Textbox";
import Loading from "/src/components/Loader";
import Button from "/src/components/Button";
import { databases } from "/src/appWrite";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const AddUser = ({ open, setOpen, userData }) => {
  const navigate = useNavigate();
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const isLoading = false,
    isUpdating = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // Define the documentId based on whether it's an update or create operation
  const documentId = userData?.id || uuidv4();

  // Define a function to handle the form submission
  const handleOnSubmit = async (data) => {
    console.log("Submitted data:", data);
    const taskData = {
      name: data.name,
      title: data.title,
      email: data.email,
      role: data.role,
    };

    try {
      // Check if the operation is an update or a create
      if (userData) {
        // Update existing user document
        const response = await databases.updateDocument(
          "66b30edc003c5993210e", // Your database ID
          "66b34ee30007c705f964", // Your collection ID
          documentId, // Existing document ID
          taskData // Updated data
        );
        console.log("User updated successfully", response);
      } else {
        // Create a new user document
        const response = await databases.createDocument(
          "66b30edc003c5993210e", // Your database ID
          "66b34ee30007c705f964", // Your collection ID
          documentId, // New document ID
          taskData // New user data
        );
        console.log("User created successfully", response);
      }
      navigate("/team"); // Redirect after success
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
