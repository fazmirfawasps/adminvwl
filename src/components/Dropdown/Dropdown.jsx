const DropDown = ({ hidden, listItems, position, ulStyles, baseStyle }) => {
  return (
    <div className={`tw-relative ${ hidden && 'tw-hidden'}`}>
      <div className="tw-z-50 tw-absolute tw-w-full">
        <div className={`tw-w-36 tw-mt-2 tw-p-2 tw-bg-white tw-shadow-md tw-z-50 ${ baseStyle }`}>
          <ul className={ ulStyles }>
            {listItems.map((x) => (
              <li
                onClick={listItems?.handler}
                className="tw-text-sm tw-text-black hover:tw-bg-[#EEE7FF] tw-py-1"
              >
                {x.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
