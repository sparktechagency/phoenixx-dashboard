import React, { useRef, useState, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";

import { message, Spin } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";
import Spinner from "../../../components/common/Spinner";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";
import {
  useAboutUsQuery,
  useCreateAboutUsMutation,
} from "../../../redux/apiSlices/aboutusApi";

function AboutUs() {
  const editor = useRef(null);
  const [createAboutUs, { isLoading: isSaving }] = useCreateAboutUsMutation();
  const {
    data: getAboutUs,
    isLoading: isLoadingPolicy,
    isError,
    refetch,
  } = useAboutUsQuery();

  const [content, setContent] = useState("");

  // Load existing About Us
  useEffect(() => {
    if (getAboutUs) {
      const policyContent = getAboutUs.data || getAboutUs.content || getAboutUs;
      if (policyContent) {
        // Ensure we're setting a string value
        setContent(typeof policyContent === "string" ? policyContent : "");
      }
    }
  }, [getAboutUs]);

  const config = useMemo(
    () => ({
      theme: "default",
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: true,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: false,
      allowResizeX: false,
      allowResizeY: false,
      statusbar: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      useSearch: false,
      spellcheck: false,
      iframe: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      toolbarButtonSize: "small",
      readonly: false,
      observer: { timeout: 100 },
    }),
    []
  );

  // Handle editor content change
  const handleEditorChange = (newContent) => {
    // Ensure we're always setting a string value
    setContent(newContent || "");
  };

  const handleSave = async () => {
    try {
      // Ensure content is a valid string before sending to API
      const safeContent = content || "";

      const requestData = {
        content: safeContent,
      };

      const response = await createAboutUs(requestData);
      console.log("API response:", response);

      if (response.data) {
        message.success("About Us updated successfully");
        refetch();
      } else if (response.error) {
        console.error("Error from API:", response.error);
        message.error(
          `Failed to update: ${response.error.data?.message || "Unknown error"}`
        );
      } else {
        message.error("Failed to update About Us");
      }
    } catch (err) {
      console.error("Error saving terms:", err);
      message.error("Failed to update About Us");
    }
  };

  if (isLoadingPolicy) return <Loading />;
  if (isError) return <Error description={"Error Fetching About Us"} />;
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">About Us</h1>

      {isLoadingPolicy ? (
        <div className="flex justify-center items-center p-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <JoditEditor
              ref={editor}
              value={content || ""}
              onChange={handleEditorChange}
              config={config}
            />
          </div>

          <div className="flex justify-end mt-6">
            <ButtonEDU onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner size="small" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </ButtonEDU>
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(AboutUs);
