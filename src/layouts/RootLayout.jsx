import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const RootLayout = () => {
  const location = useLocation();
  const pageValues = getPageTitle(location.pathname);

  function getPageTitle(pathname) {
    switch (true) {
      // Home route
      case pathname === "/":
        return "Home";

      // Sales routes
      case pathname.includes("/sales/estimates"):
      case pathname.includes("/sales/quotes"):
        return "Estimates";
      case pathname.includes("/sales/invoices"):
        return "Invoices";
      case pathname.includes("/sales/sales-order"):
        return "Sales order";
      case pathname.includes("/sales/receipts"):
      case pathname.includes("/sales/payment-receipts"):
      case pathname.includes("/sales/refund-receipts"):
        return "Receipts";
      case pathname.includes("/sales/customers"):
        return "Customers";
      case pathname.includes("/sales/items"):
        return "Items";

      // Purchases routes
      case pathname.includes("/purchases/vendors"):
        return "Vendors";
      case pathname.includes("/purchases/purchase-orders"):
        return "Purchase orders";
      case pathname.includes("/purchases/bills"):
      case pathname.includes("/purchases/payment-receipts"):
        return "Payment receipts";
      case pathname.includes("/purchases/goods-receive-notes"):
        return "Goods receive notes";

      // Accounting routes
      case pathname.includes("/accounting/banking"):
        return "Banking";

      // Profile routes
      case pathname.includes("/settings"):
        return "Settings";
      default:
        return "Dashboard";
    }
  }
  return (
    <>
      <div className="tw-flex tw-overflow-hidden tw-w-full tw-bg-[#fffff]">
        <div className="tw-w-[20vw] tw-h-screen tw-bg-sub">
          <Sidebar />
        </div>
        <div className="tw-w-[80vw] tw-bg-mud tw-flex tw-flex-col">
          <Navbar title={pageValues} />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
