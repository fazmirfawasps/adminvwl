import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Tab } from "@mui/material";
import React from "react";

const CommonTab = ({
  label,
  value,
  style,
  onChange,
  tabHeadContent,
  children,
  dashboard,
  buttons,
}) => {
  return (
    <>
      <div className={`${dashboard ? "" : "tw-bg-[#eee7ff]"} tw-h-14`}>
        <div
          className={`${
            !dashboard && "tw-fixed tw-rounded-t-[30px] tw-bg-white tw-w-[80vw]"
          }`}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                sx={{
                  height: "10px",
                  paddingLeft: "3.5rem",
                }}
                onChange={onChange}
                aria-label="lab API tabs example"
              >
                {tabHeadContent?.map((head) => (
                  <Tab
                    key={head.value}
                    icon={head.icon}
                    sx={{
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#828087",
                    }}
                    label={head.label}
                    value={head.value}
                  />
                ))}
                {/* <Tab icon={<GrNote />} label="Notes" value="2" sx={{ textTransform: 'capitalize' }} /> */}
                {/* <Tab icon={<TbReportAnalytics />} label="Transactions" sx={{ textTransform: 'capitalize' }} value="3" /> */}
                {buttons && (
                  <div className="tw-flex tw-items-center tw-px-4">
                    {buttons?.map((x) => (
                      <button
                        onClick={x.buttonFunction}
                        className={x.buttonStyles}
                      >
                        {x.buttonName}
                      </button>
                    ))}
                  </div>
                )}
              </TabList>
            </Box>
            {children}
          </TabContext>
        </div>
      </div>
    </>
  );
};

export default CommonTab;
