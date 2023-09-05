import { MenuItem } from "@mui/material";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
const statusList = [
  {
    value: "Draft",
  },
  {
    value: "Send",
  },
  {
    value: "Viewed",
  },
  {
    value: "Accepted",
  },
  {
    value: "Expired",
  },
];

const DashboardCommonSection = ({
  number,
  name,
  image,
  buttons,
  category,
  status,
  description,
  price,
  statusInput,
}) => {
  return (
    <div className="tw-px-6 tw-py-4 tw-mb-4 tw-rounded-xl tw-bg-white tw-drop-shadow-lg tw-mt-2">
      <div className="tw-flex tw-justify-between">
        <div
          className={`tw-text-start tw-pl-2 ${
            !image && "tw-border-l-2 tw-border-l-[#8153E2]"
          } ${image && "tw-flex"}`}
        >
          {image && (
            <div className="tw-inline-block">
              <img
                className="tw-w-11 tw-h-11 tw-rounded-full"
                src={image}
                alt=""
              />
              {status && (
                <span className="tw-text-green-400 tw-text-xs tw-mt-2 tw-truncate">
                  {status}
                </span>
              )}
            </div>
          )}
          <div className={`${image && "tw-ml-5"}`}>
            {category && (
              <h2 className="tw-text-xs tw-text-[#8153E2]">{category}</h2>
            )}
            <h2
              className={`tw-text-black ${category ? "tw-block" : "tw-inline"}`}
            >
              {number}
            </h2>
            {name && (
              <span className="tw-block tw-text-xs tw-text-black">{name}</span>
            )}
            {description && (
              <h2 className="tw-block tw-text-xs tw-text-[#828087] tw-text-ellipsis">
                {description}
              </h2>
            )}
            {price && (
              <h2 className="tw-block tw-text-md tw-text-[#8153E2] tw-mt-3">
                {price}
              </h2>
            )}
          </div>
        </div>
        <div className="tw-flex tw-items-start">
          {statusInput && (
            <SelectDropDown
              name={"status"}
              onChange={statusInput.method}
              value={statusInput?.value}
              style={{
                fontSize: "12px",
                height: "32px",
                width: "100px",
              }}
            >
              {statusList.map((status) => (
                <MenuItem value={status.value}>{status.value}</MenuItem>
              ))}
            </SelectDropDown>
          )}
          {buttons &&
            buttons.map((x, idx) => (
              <button onClick={x.buttonFunction} className={x.buttonStyles}>
                {x.buttonName}
                {x.dropDown && x.dropDown}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCommonSection;
