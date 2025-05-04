import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import {
  useCreatePricyPolicyMutation,
  usePrivacyPolicyQuery,
} from "../../../redux/apiSlices/privacyPolicyApi";
import { message, Spin } from "antd";
import Loading from "../../../components/common/Loading";
import ButtonEDU from "../../../components/common/ButtonEDU";
import Spinner from "../../../components/common/Spinner";

function PrivacyPolicy() {
  const editor = useRef(null);
  const [createPrivacyPolicy, { isLoading: isSaving }] =
    useCreatePricyPolicyMutation();
  const {
    data: getPrivacyPolicy,
    isLoading: isLoadingPolicy,
    refetch,
  } = usePrivacyPolicyQuery();

  const [content, setContent] = useState("");

  console.log("Raw privacy policy data:", getPrivacyPolicy);

  // Initialize editor with existing privacy policy data when available
  useEffect(() => {
    if (getPrivacyPolicy) {
      // Try to extract content based on common API response structures
      const policyContent =
        getPrivacyPolicy.data || getPrivacyPolicy.content || getPrivacyPolicy;
      console.log("Setting policy content to:", policyContent);

      if (policyContent) {
        // Ensure we're setting a string value
        setContent(typeof policyContent === "string" ? policyContent : "");
      }
    }
  }, [getPrivacyPolicy]);

  const handleSave = async () => {
    try {
      // Ensure content is a valid string before sending to API
      const safeContent = content || "";

      // Format the data according to what your API expects
      const requestData = {
        content: safeContent,
      };

      console.log("Sending data to API:", requestData);

      const response = await createPrivacyPolicy(requestData);
      console.log("API response:", response);

      if (response.data) {
        message.success("Privacy Policy updated successfully");
        // Refetch the data to ensure we display the latest version
        refetch();
      } else if (response.error) {
        console.error("Error from API:", response.error);
        message.error(
          `Failed to update: ${response.error.data?.message || "Unknown error"}`
        );
      } else {
        message.error("Failed to update Privacy Policy");
      }
    } catch (err) {
      console.error("Error updating privacy policy:", err);
      message.error("Failed to update Privacy Policy");
    }
  };

  const config = React.useMemo(
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

  if (isLoadingPolicy) return <Loading />;
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Privacy Policy
      </h1>

      {isLoadingPolicy ? (
        <div className="flex justify-center items-center p-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-md overflow-hidden ">
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

export default React.memo(PrivacyPolicy);
