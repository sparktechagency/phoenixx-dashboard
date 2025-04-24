import React, { useRef, useState, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import {
  useCreateTermsAndConditionsMutation,
  useTermsAndConditionQuery,
} from "../../../redux/apiSlices/termsAndConditionApi";
import { message, Spin } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";
import Spinner from "../../../components/common/Spinner";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";

function TermsAndCondition() {
  const editor = useRef(null);
  const [createTermsAndCondition, { isLoading: isSaving }] =
    useCreateTermsAndConditionsMutation();
  const {
    data: getTermsAndCondition,
    isLoading: isLoadingPolicy,
    isError,
    refetch,
  } = useTermsAndConditionQuery();

  const [content, setContent] = useState("");

  // Load existing terms and conditions
  useEffect(() => {
    if (getTermsAndCondition) {
      const policyContent =
        getTermsAndCondition.data ||
        getTermsAndCondition.content ||
        getTermsAndCondition;
      if (policyContent) {
        setContent(policyContent);
      }
    }
  }, [getTermsAndCondition]);

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

  const handleSave = async () => {
    try {
      const requestData = {
        content,
      };

      const response = await createTermsAndCondition(requestData);
      console.log("API response:", response);

      if (response.data) {
        message.success("Terms and Conditions updated successfully");
        refetch();
      } else if (response.error) {
        console.error("Error from API:", response.error);
        message.error(
          `Failed to update: ${response.error.data?.message || "Unknown error"}`
        );
      } else {
        message.error("Failed to update Terms and Conditions");
      }
    } catch (err) {
      console.error("Error saving terms:", err);
      message.error("Failed to update Terms and Conditions");
    }
  };
  if (isLoadingPolicy) return <Loading />;
  if (isError)
    return <Error description={"Error Fetching Terms and Conditions"} />;
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Terms and Conditions
      </h1>

      {isLoadingPolicy ? (
        <div className="flex justify-center items-center p-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(newContent) => setContent(newContent)}
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

export default React.memo(TermsAndCondition);
