import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { IoNotifications } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import ModalComponent from "../Modal/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setAdminLogOut } from "../../redux/ducks/adminSlice";
import { useNavigate } from "react-router-dom";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

function Navbar({ title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { estimatesList, quotesList } = useSelector((state) => state.estimates);
  const { invoicesList } = useSelector((state) => state.invoices);
  const { salesOrderList } = useSelector((state) => state.salesOrders);
  const { paymentReceiptsList, refundReceiptsList } = useSelector(
    (state) => state.receipts
  );

  const [modalForLogOut, setModalForLogOut] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hidden, setHidden] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState("");
  const [list, setList] = useState([]);

  const getValuesFromTitle = () => {
    if (title === "Estimates" || title === "Home") {
      if (estimatesList.length || quotesList.length) {
        const estimates = estimatesList?.map((x) => {
          return {
            ...x,
            url: "/sales/estimates",
            main: "estimate",
            sub: "EST-",
          };
        });
        const quotes = quotesList?.map((x) => {
          return { ...x, url: "/sales/quotes", main: "quote", sub: "QOT-" };
        });

        if (title === "Home") {
          setList((prev) => ({ prev, ...estimates, ...quotes }));
        } else {
          setList(estimates.concat(quotes));
        }
      }
    }
    if (title === "Invoices" || title === "Home") {
      if (invoicesList.length) {
        const invoices = invoicesList.map((x) => {
          return {
            ...x,
            url: "/sales/invoices",
            main: "invoice",
            sub: "INV-",
          };
        });

        if (title === "Home") {
          setList((prev) => ({ prev, ...invoices }));
        } else {
          setList(invoices);
        }
      }
    }
    if (title === "Sales order" || title === "Home") {
      if (salesOrderList.length) {
        const salesOrders = salesOrderList.map((x) => {
          return {
            ...x,
            url: "/sales/sales-order",
            main: "salesOrder",
            sub: "SLO-",
          };
        });

        if (title === "Home") {
          setList((prev) => ({ prev, ...salesOrders }));
        } else {
          setList(salesOrders);
        }
      }
    }
    if (title === "Receipts" || title === "Home") {
      if (paymentReceiptsList.length && refundReceiptsList.length) {
        const paymentReceipts = paymentReceiptsList.map((x) => {
          return {
            ...x,
            url: "/sales/payment-receipts",
            main: "paymentReceipt",
            sub: "PAY-",
          };
        });
        const refundReceipts = refundReceiptsList.map((x) => {
          return {
            ...x,
            url: "/sales/refund-receipts",
            main: "refundReceipt",
            sub: "RET-",
          };
        });

        if (title === "Home") {
          setList((prev) => ({ prev, ...paymentReceipts, ...refundReceipts }));
        } else {
          setList(paymentReceipts.concat(refundReceipts));
        }
      }
    }
  };

  const getHomeValues = () => {};

  const handleFiltering = (event) => {
    const input = event.target.value;
    setInputValue(input);

    // Filter options by input value
    const filtered = list?.filter((option) => {
      const { sub, main } = option;
      const name = sub + option[main];
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredOptions(filtered);
  };

  const handleInputClick = () => {
    setHidden(!hidden);
    setFilteredOptions(list);
  };

  const handleLogOut = () => {
    dispatch(setAdminLogOut());
    localStorage.clear();
    setModalForLogOut(false);
    navigate("/");
  };

  const handleNavigate = (url, id, value) => {
    setHidden(false);
    setInputValue(value);
    navigate(`${url + "/" + id}`);
  };

  useEffect(() => {
    getValuesFromTitle();
  }, [
    estimatesList,
    quotesList,
    invoicesList,
    salesOrderList,
    paymentReceiptsList,
    refundReceiptsList,
  ]);

  return (
    <>
      <nav className="tw-fixed tw-flex tw-items-center tw-justify-between tw-h-16 tw-w-[80vw] tw-px-14 tw-z-50 tw-bg-mud">
        <div className="tw-text-xl">{title}</div>
        <div className="tw-flex tw-w-4/6 tw-justify-end">
          <form className="tw-mr-20 tw-w-full">
            <label
              for="default-search"
              class="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 tw-sr-only dark:text-white"
            >
              Search
            </label>
            <div class="tw-relative tw-w-full">
              <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-pointer-events-none">
                <svg
                  aria-hidden="true"
                  class="tw-w-5 tw-h-5 tw-text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                value={inputValue}
                onClick={handleInputClick}
                onChange={handleFiltering}
                class="tw-block tw-w-full tw-p-4 tw-pl-10 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-50"
                placeholder="Search"
                required
              />
              <div className="tw-relative tw-w-full">
                {hidden && (
                  <ul className="tw-absolute tw-top-0.5 tw-w-full tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm">
                    {filteredOptions?.length > 0 ? (
                      filteredOptions.map((x, idx) => (
                        <li
                          key={idx}
                          onClick={() =>
                            handleNavigate(x.url, x._id, x.sub + x[x.main])
                          }
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-main hover:tw-text-white"
                        >
                          {x.sub + x[x.main]}
                        </li>
                      ))
                    ) : filteredOptions?.length === 0 ? (
                      <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-main hover:tw-text-white">
                        No matching results
                      </li>
                    ) : (
                      <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-main hover:tw-text-white">
                        No results
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </form>

          <div className="tw-flex tw-items-center tw-justify-between tw-w-14">
            <IoNotifications className="tw-text-main tw-text-lg tw-mr-4" />
            <FiLogOut
              onClick={() => setModalForLogOut(true)}
              className="tw-text-main tw-text-lg tw-cursor-pointer"
            />
          </div>
        </div>
      </nav>
      {/* modal starting for confirmation */}
      <ModalComponent
        title={"Logout"}
        onClose={() => setModalForLogOut(false)}
        open={modalForLogOut}
        fade={modalForLogOut}
        style={{ ...baseStyle }}
      >
        <div className="tw-px-6 tw-pt-3 tw-pb-6">
          <div className="tw-text-[12px]">
            Are you sure you want to logout ?
          </div>
          <div className="tw-pt-3  tw-flex tw-items-end tw-justify-center tw-gap-5">
            <button
              onClick={() => setModalForLogOut(false)}
              className="tw-px-3 tw-h-8 tw-w-24 tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-main tw-rounded-md tw-border tw-border-main"
            >
              Cancel
            </button>
            <button
              onClick={handleLogOut}
              className={`tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-rounded-md tw-border tw-border-main tw-bg-main`}
            >
              Logout
            </button>
          </div>
        </div>
      </ModalComponent>

      {/* modal ending for confirmation */}
    </>
  );
}

export default Navbar;
