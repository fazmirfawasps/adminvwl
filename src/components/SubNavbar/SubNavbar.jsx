import { useState } from "react";
import { BiMenu, BiMenuAltLeft } from "react-icons/bi";

const SubNavBar = ({
  leftText,
  rightText,
  buttons,
  fullBorder,
  clickEvent,
}) => {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`${
        fullBorder && "tw-border-b"
      } tw-z-40 tw-fixed tw-w-[80vw] tw-bg-[#EEE7FF]`}
    >
      <div className="tw-h-12 tw-flex tw-rounded-t-[30px] lg:tw-gap-6 lg:tw-flex-row lg:tw-items-center tw-bg-white tw-px-14">
        <div
          className={`${
            !fullBorder && "tw-border-b"
          } tw-h-12 tw-flex tw-justify-start tw-items-center tw-w-3/6`}
        >
          <div className="tw-text-[#828087]">
            <span>{leftText}</span>
          </div>
        </div>
        <div
          className={`tw-w-3/6 tw-flex ${
            !rightText ? "tw-justify-end" : "tw-justify-between"
          } tw-items-center tw-h-12`}
        >
          <span
            onClick={clickEvent}
            className="tw-text-xs xl:tw-text-sm tw-cursor-pointer"
          >
            {rightText}
          </span>
          <div className="lg:tw-flex tw-hidden lg:block">
            {buttons &&
              buttons?.map((x,index) => (
                <button key={index}
                  onClick={x?.buttonFunction && x.buttonFunction}
                  className={x?.buttonStyles}
                >
                  <span className="">{x.buttonName}</span>
                </button>
              ))}
          </div>

          <div className="lg:tw-hidden tw-w-3/6 tw-flex tw-justify-end tw-items-center">
            {active && (
              <div className={`tw-relative`}>
                <div className="tw-z-50 tw-absolute tw-right-32 tw-w-full">
                  <div
                    className={`tw-w-36 tw-mt-2 tw-p-2 tw-bg-white tw-shadow-md tw-z-50`}
                  >
                    <ul>
                      {buttons.map((x) => (
                        <li
                          onClick={x?.buttonFunction && x.buttonFunction}
                          className="tw-text-sm tw-text-black hover:tw-bg-[#EEE7FF] tw-py-1 tw-cursor-pointer"
                        >
                          {x.buttonName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {active ? (
              <BiMenuAltLeft
                onClick={() => setActive(!active)}
                className="tw-text-[#8153E2] tw-text-lg tw-cursor-pointer"
              />
            ) : (
              <BiMenu
                onClick={() => setActive(!active)}
                className="tw-text-[#8153E2] tw-text-lg tw-cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNavBar;
