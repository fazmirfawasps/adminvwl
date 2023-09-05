import React from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Box, Fade, Modal, Backdrop } from "@mui/material";

const ModalComponent = ({ title, children, onClose, open, fade, style }) => {
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={fade}>
          <Box sx={style}>
            <div
              style={{
                display: "flex",
                backgroundColor: "#EEE7FF",
                justifyContent: "space-between",
                alignItems: "center",
                height: "40px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                padding: "0 1.5rem",
              }}
            >
              {/* <div style={{ paddingLeft: '2rem' }} >
                                <p>{title}</p>
                            </div>
                            <div style={{ display: 'flex', width: '60%', justifyContent: 'flex-end' }}  >
                                <ClearRoundedIcon sx={{ color: '#85A3A0', cursor: 'pointer' }} onClick={onClose} />
                            </div> */}
              <p>{title}</p>
              <ClearRoundedIcon
                sx={{ color: "#85A3A0", cursor: "pointer" }}
                onClick={onClose}
              />
            </div>
            {children}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalComponent;
