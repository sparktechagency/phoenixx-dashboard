import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, Empty, Form, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AddEditModal, DeleteModal } from "./Modals";
import { FiEdit3 } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import {
  useCategoryFAQQuery,
  useCreateFAQCategoryMutation,
  useDeleteFAQCategoryMutation,
  useUpdateFAQCategoryMutation,
} from "../../../redux/apiSlices/faqCategoryApi";
import {
  useGetFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "../../../redux/apiSlices/faqApi";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";

const { Panel } = Collapse;
const { Option } = Select;

const CategoryFAQ = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState("faq");
  const [deleteType, setDeleteType] = useState("faq");
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const {
    data: faqCategory,
    isLoading,
    isError: cfaqError,
  } = useCategoryFAQQuery();
  const [createFAQC] = useCreateFAQCategoryMutation();
  const [updateFAQC] = useUpdateFAQCategoryMutation();
  const [deleteFAQC] = useDeleteFAQCategoryMutation();

  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();
  const {
    data: categoryFaqs,
    isLoading: faqsLoading,
    isError: faqsError,
  } = useGetFAQQuery(selectedCategoryId, { skip: !selectedCategoryId });

  console.log("faqC", faqCategory?.data);
  console.log("categoryFaqs", categoryFaqs?.data?.data); // Check the actual structure

  useEffect(() => {
    if (faqCategory?.data) {
      const formatted = faqCategory.data.map((faq) => ({
        id: faq._id,
        name: faq.name,
      }));
      setCategories(formatted);
    }
  }, [faqCategory]);

  // Store the fetched FAQs in state
  const [faqs, setFaqs] = useState([]);

  // Update faqs state when categoryFaqs data changes - fixed to handle different response structures
  useEffect(() => {
    if (categoryFaqs) {
      // Check the structure of categoryFaqs and extract the data accordingly
      const faqsData = categoryFaqs?.data?.data || categoryFaqs || [];

      // If faqsData is an array, we can map through it
      if (Array.isArray(faqsData)) {
        const formattedFaqs = faqsData.map((faq) => ({
          id: faq._id,
          categoryId: faq.category,
          question: faq.question,
          answer: faq.answer,
        }));
        setFaqs(formattedFaqs);
      } else {
        console.error("Unexpected response format for FAQs:", categoryFaqs);
        setFaqs([]);
      }
    }
  }, [categoryFaqs]);

  const [selectedItem, setSelectedItem] = useState(null);

  const openAddModal = (type) => {
    form.resetFields();
    setModalType(type);
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item, type) => {
    form.setFieldsValue(item);
    setModalType(type);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (values) => {
    if (modalType === "category") {
      if (editItem) {
        try {
          const res = await updateFAQC({
            id: editItem.id,
            updatedData: values,
          }).unwrap();
          if (res.success) {
            message.success("FAQ Category Updated");
            setCategories((prev) =>
              prev.map((cat) =>
                cat.id === editItem.id ? { ...cat, ...values } : cat
              )
            );
          } else {
            message.error("Failed to update category");
          }
        } catch (err) {
          console.error(err);
          message.error("Update failed");
        }
      } else {
        try {
          const res = await createFAQC(values).unwrap();
          if (res.success) {
            message.success("FAQ Category Added");
            setCategories((prev) => [
              ...prev,
              { id: res.data._id, name: res.data.name },
            ]);
          } else {
            message.error("Failed to create category");
          }
        } catch (err) {
          console.error(err);
          message.error("Creation failed");
        }
      }
    } else {
      if (editItem) {
        // Handle FAQ update logic here
        try {
          const res = await updateFAQ({
            id: editItem.id,
            updatedData: values,
          }).unwrap();

          if (res.success) {
            message.success("FAQ Updated Successfully");
            setFaqs((prev) =>
              prev.map((faq) =>
                faq.id === editItem.id ? { ...faq, ...values } : faq
              )
            );
          } else {
            message.error("Failed to Update FAQ");
          }
        } catch (err) {
          console.error(err);
          message.error("Update failed");
        }
      } else {
        try {
          // Create new FAQ
          const res = await createFAQ({
            ...values,
            category: values.categoryId,
          }).unwrap();

          if (res.success) {
            message.success("FAQ Added");
            // Refresh faqs if the newly added FAQ belongs to the selected category
            if (selectedCategoryId === values.categoryId) {
              setFaqs((prev) => [
                ...prev,
                {
                  id: res.data._id,
                  categoryId: res.data.category,
                  question: res.data.question,
                  answer: res.data.answer,
                },
              ]);
            }
          } else {
            message.error("Failed to create FAQ");
          }
        } catch (err) {
          console.error(err);
          message.error("Creation failed");
        }
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteType === "category") {
      try {
        // Use selectedItem.id instead of selectedCategoryId
        const res = await deleteFAQC(selectedItem.id).unwrap();
        if (res.success) {
          message.success("Category Successfully Deleted");
          // Update UI after successful deletion
          setCategories((prev) =>
            prev.filter((cat) => cat.id !== selectedItem.id)
          );
          setFaqs((prev) =>
            prev.filter((faq) => faq.categoryId !== selectedItem.id)
          );
        } else {
          message.error("Failed to Delete Category");
        }
      } catch (err) {
        console.error(err);
        message.error("Delete failed");
      }
    } else {
      // For FAQ deletion
      try {
        // Use selectedItem.id instead of faq.id
        const res = await deleteFAQ(selectedItem.id).unwrap();
        if (res.success) {
          message.success("FAQ Successfully Deleted");
          // Update UI after successful deletion
          setFaqs((prev) => prev.filter((faq) => faq.id !== selectedItem.id));
        } else {
          message.error("Failed to Delete FAQ");
        }
      } catch (err) {
        console.error(err);
        message.error("Delete failed");
      }
    }
    setIsDeleteModalOpen(false);
  };

  // Handle panel change to load FAQs for the selected category
  const handlePanelChange = (key) => {
    if (key) {
      setSelectedCategoryId(key);
    }
  };

  if (cfaqError) return <Error description={"Error Fetching FAQ Category"} />;
  // if (faqsError) return <Error description={"Error Fetching FAQ "} />;

  return (
    <Card
      title={<p className="text-black font-semibold text-xl">Category FAQs</p>}
      extra={
        <div className="flex gap-2">
          <Button
            icon={<PlusOutlined />}
            onClick={() => openAddModal("category")}
            className="bg-smart h-8 text-white"
          >
            Add Category
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => openAddModal("faq")}
            className="bg-smart h-8 text-white"
          >
            Add FAQ
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <Empty description="No categories found" />
      ) : (
        <div className="h-[45.5rem] overflow-auto border-b rounded-lg ">
          <Collapse accordion onChange={handlePanelChange}>
            {categories.map((category) => (
              <Panel
                header={
                  <div className="flex justify-between items-center font-medium text-base">
                    <span>{category.name}</span>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        className="w-6 h-6 text-smart"
                        icon={<FiEdit3 />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(category, "category");
                        }}
                      />
                      <Button
                        className="w-6 h-6 text-[#ff4e50]"
                        icon={<ImBin />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(category, "category");
                        }}
                      />
                    </div>
                  </div>
                }
                key={category.id}
              >
                {selectedCategoryId === category.id && faqsLoading ? (
                  <div>Loading FAQs...</div>
                ) : faqs.filter((faq) => faq.categoryId === category.id)
                    .length === 0 ? (
                  <Empty description="No FAQs in this category" />
                ) : (
                  faqs
                    .filter((faq) => faq.categoryId === category.id)
                    .map((faq) => (
                      <Card
                        key={faq.id}
                        title={
                          <p className="text-black font-bold">
                            Q: {faq.question}
                          </p>
                        }
                        extra={
                          <div className="flex gap-2">
                            <Button
                              className="w-5 h-6 text-smart"
                              icon={<FiEdit3 />}
                              onClick={() => openEditModal(faq, "faq")}
                            />
                            <Button
                              className="w-5 h-6 text-[#ff4e50]"
                              icon={<ImBin />}
                              onClick={() => openDeleteModal(faq, "faq")}
                            />
                          </div>
                        }
                        className="mb-4"
                      >
                        <span className="text-black font-bold">A:</span>{" "}
                        {faq.answer}
                      </Card>
                    ))
                )}
              </Panel>
            ))}
          </Collapse>
        </div>
      )}

      {/* Modals */}
      <AddEditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        form={form}
        handleSave={handleSave}
        modalType={modalType}
        editItem={editItem}
        categories={categories}
      />

      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
        deleteType={deleteType}
      />
    </Card>
  );
};

export default CategoryFAQ;
