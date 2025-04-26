import React, { useState } from "react";
import GetPageName from "../../../components/common/GetPageName";
import AddEditModal from "./AddEditModal";
import DeletePackageModal from "./DeletePackageModal";
import dayjs from "dayjs";
import {
  useCreatePackageMutation,
  useGetPackageQuery,
  useDeletePackageMutation,
  useUpdatePackageMutation,
} from "../../../redux/apiSlices/packageApi";
import { message } from "antd";
import { FaTags } from "react-icons/fa6";

function Package() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const {
    data: getPackages,
    isLoading,
    isError,
    refetch,
  } = useGetPackageQuery();

  const [createPackage] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

  const defaultPackages = getPackages?.data?.map((pkg) => ({
    id: pkg?._id,
    name: pkg?.name,
    price: pkg?.price,
    description: pkg?.description,
    features: pkg?.features,
    status: pkg?.status,
    createdAt: pkg?.createdAt,
    interval: pkg?.interval,
  }));

  const handleAdd = () => {
    setEditingPackage(null);
    setModalVisible(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setModalVisible(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deletePackage(packageToDelete.id).unwrap();
      if (res.success) {
        message.success("Package deleted successfully");
        setDeleteModalVisible(false);
        setPackageToDelete(null);
        refetch();
      } else {
        message.error("Failed to delete package");
      }
    } catch (err) {
      console.error("Delete error:", err);
      message.error("An error occurred while deleting");
    }
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingPackage) {
        const res = await updatePackage({
          id: editingPackage.id,
          updatedData: data,
        }).unwrap();
        if (res.success) {
          message.success("Package updated successfully 😅");
        } else {
          message.error("Failed to update package 😅");
        }
      } else {
        const res = await createPackage(data).unwrap();
        if (res.success) {
          message.success("Package created successfully");
        } else {
          message.error("Failed to create package 😅");
        }
      }
      setModalVisible(false);
      refetch();
    } catch (err) {
      console.error("Error:", err);
      message.error(err.data?.message || "An error occurred");
    }
  };

  return (
    <div className="p-5">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading packages</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-[20px] font-medium flex items-center gap-2">
              {GetPageName()}
              <FaTags />
            </h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Package
            </button>
          </div>

          <div className="flex gap-4 flex-wrap hover:cursor-pointer">
            {defaultPackages?.map((pkg) => (
              <div
                key={pkg.id}
                className="relative group flex-1 min-w-[250px] p-4 rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm hidden group-hover:flex items-center justify-center gap-4 z-10">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(pkg)}
                    className="px-4 py-1 bg-red-600 text-white text-sm rounded-md shadow hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="relative z-0">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">{pkg.name}</h2>
                    <div
                      className={`relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all ${
                        pkg.status === "active" ? "bg-green-500" : "bg-red-500"
                      } rounded-xl group`}
                    >
                      <span
                        className={`absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out ${
                          pkg.status === "active"
                            ? "bg-green-700"
                            : "bg-red-700"
                        } rounded group-hover:-mr-4 group-hover:-mt-4`}
                      >
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full ${
                          pkg.status === "active"
                            ? "bg-green-600"
                            : "bg-red-600"
                        } rounded-2xl group-hover:mb-12 group-hover:translate-x-0`}
                      ></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        {pkg.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 mb-1">
                    ${pkg.price}/
                    {pkg.interval.charAt(0).toUpperCase() +
                      pkg.interval.substr(1)}
                  </p>
                  <p className="text-gray-500 mb-3">{pkg.description}</p>

                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {Array.isArray(pkg.features) &&
                      pkg.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AddEditModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialValues={
          editingPackage || {
            name: "",
            price: 0,
            description: "",
            features: [],
            status: "active",
            interval: "",
          }
        }
        isEditing={!!editingPackage}
      />

      <DeletePackageModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={isDeleting}
        packageName={packageToDelete?.name}
      />
    </div>
  );
}

export default Package;
