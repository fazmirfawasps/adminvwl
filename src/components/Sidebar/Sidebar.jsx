import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/kxenceLogo.png";
import UserProfile from "../../assets/images/userProfile.avif";
import { SidebarData } from "../SidebarData/SidebarData";
import { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
const Sidebar = () => {
  const navigate = useNavigate();
  const [subMenu, setSubMenu] = useState(1);
  const [subList, setSubList] = useState("");
  const handleSubMenu = (id) => {
    setSubMenu(id);
  };
  const handleDropDown = (id) => {
    setSubMenu("");
  };

  const handleHomeNavigation = (path, id) => {
    setSubMenu(id);
    setSubList("");
    navigate(path);
  };
  return (
    <div className="container tw-select-none tw-bg-sub">
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-sub">
        <div>
          <img className="tw-w-44" src={Logo} alt="kxencelogo" />
          <div className="tw-flex  tw-pl-2">
            <div className="user-img">
              <img src={UserProfile} alt="kxencelogo" />
            </div>
            <div className="userDetails">
              <div className="name">
                <h5 className="tw-font-Manrope tw-text-[15px] tw-font-medium">
                  Alla Kovich
                </h5>
              </div>
              <div className="email">
                <h5 className="tw-font-Manrope tw-text-xs">
                  kovichalla@gmail.com
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-bg-sub">
        <ul className="sidebar-list">
          {SidebarData.map((values, index) => {
            return (
              <>
                <li key={index} className="row">
                  <div
                    id="icon"
                    style={{
                      color: subMenu === values.id ? "#008955" : "",
                      borderLeft:
                        subMenu === values.id ? "2px solid #008955" : "",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      subMenu === values?.id
                        ? handleDropDown(values?.id)
                        : handleSubMenu(values?.id);
                    }}
                  >
                    {values.icon}{" "}
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                      color: subMenu === values.id ? "black" : "#008955",
                      fontSize: "14px",
                    }}
                    id="title"
                    onClick={() => {
                      !values.showDrop
                        ? handleHomeNavigation(values.path, values.id)
                        : subMenu === values?.id
                        ? handleDropDown(values?.id)
                        : handleSubMenu(values?.id);
                    }}
                  >
                    {values.title}{" "}
                    {values.showDrop  && subMenu === values?.id ? (
                      <IoMdArrowDropup
                        className="tw-cursor-pointer tw-inline"
                        onClick={() => {
                          handleDropDown(values?.id);
                        }}
                      />
                    ) : values.showDrop  && subMenu !== values?.id ? (
                      <IoMdArrowDropdown
                        className="tw-cursor-pointer tw-inline"
                        onClick={() => {
                          handleSubMenu(values?.id);
                        }}
                      />
                    ) : (
                      <span></span>
                    )}
                  </div>
                </li>
                {subMenu === values?.id &&
                  values?.subMenuItems?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        style={{
                          listStyle: "none",
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "100%",
                          marginLeft: "45px",
                          borderLeft: "1px solid #008955 ",
                          paddingInline: "46px",
                          paddingBlock: "4px",
                        }}
                      >
                        <div
                          className="submenuList tw-truncate"
                          style={{
                            cursor: "pointer",
                            color: "#545357",
                            backgroundColor:
                              subList === item.id ? "#EEE7FF" : "",
                          }}
                          onClick={() => {
                            setSubList(item?.id);
                            navigate(item.path);
                          }}
                        >
                          {item?.title}
                        </div>
                      </li>
                    );
                  })}
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
