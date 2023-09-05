import { useState } from "react";
import ModalComponent from "../Modal/ModalComponent";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

const DashboardDeleteModal = ({
  title,
  message,
  handleDelete,
  loading,
  open,
  onClose,
}) => {
  return (
    <>
      {/* modal starting for confirmation */}
      <ModalComponent
        title={title}
        onClose={onClose}
        open={open}
        fade={open}
        style={{ ...baseStyle }}
      >
        <div className="tw-px-6 tw-pt-3 tw-pb-6">
          <div className="tw-text-[12px]">
            Are you sure you want to delete {message} ?
          </div>
          <div className="tw-pt-3  tw-flex tw-items-end tw-justify-center tw-gap-5">
            <button
              onClick={onClose}
              className="tw-px-3 tw-h-8 tw-w-24 tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-rounded-md tw-border tw-border-[#8153E2] tw-bg-[#8153E2]`}
            >
              {loading ? "Please wait" : "Delete"}
            </button>
          </div>
        </div>
      </ModalComponent>

      {/* modal ending for confirmation */}
    </>
  );
};

export default DashboardDeleteModal;
