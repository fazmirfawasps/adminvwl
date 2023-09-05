import React, { useState } from "react";
import "./dashboardNavbar.css";
import { MdArrowDropDown, MdOutlineArrowBackIos } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function DashboardNavbar({
  url,
  value,
  onModalOpen = null,
  tabLinks,
  backButton,
  rounded,
  selectedRow,
  handleNavigation,
  handleDelete,
  input,
  tax = false
}) {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  if(tax){
    return  <div
    className={`tw-h-14 tw-flex tw-justify-start tw-items-center tw-w-3/6 tw-absolute tw-left-[201px] tw-top-[168px] `}
  >
   
     <div>
    {selectedRow && selectedRow?.length > 0 && (
      <button
        onClick={handleDelete}
        className="tw-relative tw-ml-7 tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-drop-shadow-lg"
      >
        <AiOutlineDelete />
      </button>
    )}
    {selectedRow && selectedRow?.length === 1 && (
      <button
        onClick={handleNavigation}
        className="tw-relative tw-ml-7 tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-drop-shadow-lg"
      >
        <BiEditAlt />
      </button>
    )}
  </div>
  </div>
  }
  return (
    <>
      <div className={` tw-z-40 tw-fixed tw-w-[80vw] tw-bg-[#EEE7FF]`}>
        <div
          className={`tw-h-14 tw-flex ${rounded && "tw-rounded-t-[30px]"
            } lg:tw-gap-6 lg:tw-flex-row lg:tw-items-center tw-bg-white tw-px-14`}
        >
          <div
            className={`tw-h-14 tw-flex tw-justify-start tw-items-center tw-w-3/6`}
          >
            <div className={`${input && "tw-w-1/2"}`}>
              {backButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="tw-px-3 tw-mr-7 tw-h-8 tw-py-1 tw-text-xs tw-font-medium tw-text-start tw-text-[#8153E2] tw-bg-white tw-rounded-md tw-drop-shadow-lg"
                >
                  <MdOutlineArrowBackIos className="tw-inline" />
                </button>
              )}
              {!input && (
                <button className="tw-px-3 tw-h-8 tw-w-36 tw-py-1 tw-text-xs tw-font-medium tw-text-start tw-text-[#8153E2] tw-bg-white tw-rounded-md tw-drop-shadow-lg">
                  All
                  <MdArrowDropDown className="tw-inline" />
                </button>
              )}
              {input && input?.input}
            </div>
            {/* {tax && ( // Render this part only when tax is true */}

              <div>
                {selectedRow && selectedRow?.length > 0 && (
                  <button
                    onClick={handleDelete}
                    className="tw-relative tw-ml-7 tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-drop-shadow-lg"
                  >
                    <AiOutlineDelete />
                  </button>
                )}
                {selectedRow && selectedRow?.length === 1 && (
                  <button
                    onClick={handleNavigation}
                    className="tw-relative tw-ml-7 tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-drop-shadow-lg"
                  >
                    <BiEditAlt />
                  </button>
                )}
              </div>
            {/* )} */}
              
          </div>
          <div
            className={`tw-w-3/6 tw-flex tw-justify-end tw-items-center tw-h-14`}
          >
            {value == "1" ? (
              <button
                onClick={() => {
                  tabLinks?.length > 0 ? setActive(!active) : navigate(url);
                }}
                className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              >
                +Add new
                <span className="dropdown-icon">
                  <MdArrowDropDown className="tw-inline" />
                </span>
              </button>
            ) : onModalOpen !== null ? (
              <button
                onClick={onModalOpen}
                className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              >
                +Add new
                <span className="dropdown-icon">
                  <MdArrowDropDown className="tw-inline" />
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  tabLinks?.length > 0 ? setActive(!active) : navigate(url);
                }}
                className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              >
                +Add new
                <span className="dropdown-icon">
                  <MdArrowDropDown className="tw-inline" />
                </span>
                {active && tabLinks?.length > 0 && (
                  <div className="tw-relative tw-w-32">
                    <ul className="tw-absolute tw-right-7 tw-top-3 tw-z-50 tw-w-full tw-bg-white tw-shadow-lg tw-rounded-md">
                      {tabLinks.map((x, idx) => (
                        <li
                          key={idx}
                          onClick={() => navigate(x.url)}
                          className={`tw-text-xs tw-h-8 tw-text-start tw-text-black hover:tw-bg-[#8153E2] hover:tw-text-white tw-p-2 tw-pl-4 ${idx === 0 && "tw-rounded-t-md"
                            } ${idx === tabLinks?.length - 1 && "tw-rounded-b-md"
                            }`}
                        >
                          {x.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            )}
            <button className="tw-relative tw-ml-7 tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-drop-shadow-lg">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardNavbar;
