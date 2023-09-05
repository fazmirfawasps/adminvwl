import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import AddNewCustomer from "./components/AddNewCustomer/AddNewCustomer";
import CustomerDashboard from "./components/CustomerDashboard/CustomerDashboard";
import Customers from "./pages/customers/Customers";
import Estimates from "./pages/estimates/Estimates";
import Items from "./pages/items/Items";
import AddNewItem from "./components/AddNewItem/AddNewItem";
import ItemDashboard from "./components/ItemDashboard/ItemDashboard";
import Tax from "./pages/tax/Tax";
import EstimateDashboard from "./components/EstimateDashboard/EstimateDashboard";
import Invoices from "./pages/invoices/Invoices";
import AddAndEditInvoice from "./components/AddAndEditInvoice/AddAndEditInvoice";
import InvoiceDashboard from "./components/InvoiceDashboard/InvoiceDashboard";
import AdminLogin from "./pages/adminLogin/AdminLogin";
import SalesOrder from "./pages/salesOrder/SalesOrder";
import AddAndEditSalesOrder from "./components/AddAndEditSalesOrder/AddAndEditSalesOrder";
import SalesOrderDashboard from "./components/SalesOrderDashboard/SalesOrderDashboard";
import Receipts from "./pages/receipts/Receipts";
import AddAndEditPaymentReceipt from "./components/AddAndEditReceipt/AddAndEditPaymentReceipt";
import AddAndEditRefundReceipt from "./components/AddAndEditReceipt/AddAndEditRefundReceipt";
import RefundReceiptDashboard from "./components/ReceiptDashboard/RefundReceiptDashboard";
import PaymentReceiptDashboard from "./components/ReceiptDashboard/PaymentReceiptDashboard";
import { useDispatch, useSelector } from "react-redux";
import AdminLoginRouter from "./utils/AdminLoginRouter";
import QuoteDashboard from "./components/EstimateDashboard/QuoteDashboard";
import Vendors from "./pages/vendors/Vendors";
import PurchaseOrders from "./pages/purchaseOrder/PurchaseOrder";
import PurchaseOrderDashboard from "./components/PurchaseOrderDashboard/PurchaseOrderDashboard";
import VendorDashboard from "./components/VendorDashboard/VendorDashboard";
import AddAndEditBill from "./components/AddAndEditBill/AddAndEditBill";
import Bills from "./pages/bills/Bill";
import AddAndEditGoodsReceiveNote from "./components/AddAndEditGoodsReceiveNote/AddAndEditGoodsReceiveNote";
import GoodsReceiveNotes from "./pages/goodsReceiveNotes/goodsReceiveNotes";
import BillDashboard from "./components/BillDashboard/BillDashboard";
import GoodsReceiveNoteDashboard from "./components/GoodsReceiveNoteDashboard/GoodsReceiveNoteDashboard";
import Banking from "./pages/banking/Banking";
import AddAndEditExpense from "./components/AddAndEditExpense/AddAndEditExpense";
import AddAndEditContraEntry from "./components/AddAndEditContraEntry/AddAndEditContraEntry";
import JournalEntry from "./pages/journalEntry/JournalEntry";
import AddNewJournal from "./components/AddNewJournal/AddNewJournal";
import ChartOfAccounts from "./pages/chartOfAccounts/ChartOfAccounts";
import AddAndEditVendor from "./components/AddAndEditVendor/AddAndEditVendor";
import JournalEntryDashboard from "./components/JournalEntryDashboard/JournalEntryDashboard";
import AddAndEditEstimate from "./components/AddAndEditEstimate/AddAndEditEstimate";
import AddAndEditQuote from "./components/AddAndEditEstimate/AddAndEditQuote";
import RootLayout from "./layouts/RootLayout";
import PaymentReceipts from "./pages/paymentReceipts/PaymentReceipts";
import AddAndEditPurchasePaymentReceipts from "./components/AddAndEditPurchasePaymentReceipts/AddAndEditPurchasePaymentReceipts";
import { getProfile } from "./services/profileService";
import { setCountryCode } from "./redux/ducks/countrySlice";
import { useEffect } from "react";
import AddAndEditPurchaseOrder from "./components/AddAndEditPurchaseOrder/AddAndEditPurchaseOrder";

function App() {
  const  isLoggedIn = true ;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await getProfile();
      localStorage.setItem("selectedCountryId", data.countryCode);
      dispatch(setCountryCode(data.countryCode));
    };
    fetchProfile();
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<AdminLoginRouter />}>
            <Route
              path="/"
              element={!isLoggedIn ? <Navigate to="/login" /> : <RootLayout />}
            >
              <Route index element={<Home />} />
              <Route path="sales/">
                <Route path="customers" element={<Customers />} />
                <Route path="estimates" element={<Estimates />} />
                <Route
                  path="estimates/add-new-estimate"
                  element={<AddAndEditEstimate />}
                />
                <Route
                  path="estimates/add-new-quote"
                  element={<AddAndEditQuote />}
                />
                <Route path="estimates/:id" element={<EstimateDashboard />} />
                <Route
                  path="estimates/edit-estimate/:id"
                  element={<AddAndEditEstimate />}
                />
                <Route path="quotes/:id" element={<QuoteDashboard />} />
                <Route
                  path="estimates/edit-quote/:id"
                  element={<AddAndEditQuote />}
                />
                <Route path="invoices" element={<Invoices />} />
                <Route
                  path="invoices/add-new-invoice"
                  element={<AddAndEditInvoice />}
                />
                <Route path="invoices/:id" element={<InvoiceDashboard />} />
                <Route
                  path="invoices/edit-invoice/:id"
                  element={<AddAndEditInvoice />}
                />
                <Route path="sales-order" element={<SalesOrder />} />
                <Route
                  path="sales-order/add-new-sales-order"
                  element={<AddAndEditSalesOrder />}
                />
                <Route
                  path="sales-order/:id"
                  element={<SalesOrderDashboard />}
                />
                <Route
                  path="sales-order/edit-sales-order/:id"
                  element={<AddAndEditSalesOrder />}
                />
                <Route path="receipts" element={<Receipts />} />

                <Route
                  path="receipts/add-new-payment-receipt"
                  element={<AddAndEditPaymentReceipt />}
                />
                <Route
                  path="receipts/add-new-payment-receipt/:id"
                  element={<AddAndEditPaymentReceipt />}
                />
                <Route
                  path="receipts/add-new-refund-receipt"
                  element={<AddAndEditRefundReceipt />}
                />
                <Route
                  path="payment-receipts/:id"
                  element={<PaymentReceiptDashboard />}
                />
                <Route
                  path="refund-receipts/:id"
                  element={<RefundReceiptDashboard />}
                />
                <Route
                  path="receipts/edit-refund-receipt/:id"
                  element={<AddAndEditRefundReceipt />}
                />
                <Route path="items" element={<Items />} />
              </Route>

              <Route path="settings/">
                <Route path="profile" element={<Profile />} />
                <Route path="tax" element={<Tax />} />
              </Route>
              <Route path="addcustomer" element={<AddNewCustomer />} />
              <Route path="addcustomer/:id" element={<AddNewCustomer />} />
              <Route
                path="customerdashboard/:id"
                element={<CustomerDashboard />}
              />
              <Route path="additem" element={<AddNewItem />} />
              <Route path="additem/:id" element={<AddNewItem />} />
              <Route path="itemdashboard/:id" element={<ItemDashboard />} />

              <Route path="purchases/">
                <Route path="vendors" element={<Vendors />} />
                <Route
                  path="vendors/add-new-vendor"
                  element={<AddAndEditVendor />}
                />
                <Route path="vendors/:id" element={<VendorDashboard />} />
                <Route
                  path="vendors/edit-vendor/:id"
                  element={<AddAndEditVendor />}
                />
                <Route path="purchase-orders" element={<PurchaseOrders />} />
                <Route
                  path="purchase-orders/add-new-purchase-order"
                  element={<AddAndEditPurchaseOrder />}
                />
                <Route path="bills/add-new-bill" element={<AddAndEditBill />} />
                <Route path="payment-receipts" element={<PaymentReceipts />} />
                <Route
                  path="payment-receipts/add-new-payment-receipt"
                  element={<AddAndEditPurchasePaymentReceipts />}
                />
                <Route
                  path="payment-receipts/add-new-payment-receipt/:id"
                  element={<AddAndEditPurchasePaymentReceipts />}
                />
                <Route
                  path="goods-receive-notes/add-new-goods-receive-note"
                  element={<AddAndEditGoodsReceiveNote />}
                />
                <Route
                  path="purchase-orders/:id"
                  element={<PurchaseOrderDashboard />}
                />
                <Route
                  path="purchase-orders/edit-purchase-order/:id"
                  element={<AddAndEditPurchaseOrder />}
                />
                <Route path="bills" element={<Bills />} />
                <Route path="bills/:id" element={<BillDashboard />} />
                <Route
                  path="bills/edit-bill/:id"
                  element={<AddAndEditBill />}
                />
                <Route
                  path="goods-receive-notes"
                  element={<GoodsReceiveNotes />}
                />
                <Route
                  path="goods-receive-notes/:id"
                  element={<GoodsReceiveNoteDashboard />}
                />
                <Route
                  path="goods-receive-notes/edit-goods-receive-note/:id"
                  element={<AddAndEditGoodsReceiveNote />}
                />
              </Route>

              <Route path="accounting/">
                <Route path="banking" element={<Banking />} />
                <Route
                  path="banking/add-new-petty-cash-expense"
                  element={<AddAndEditExpense />}
                />
                <Route
                  path="banking/add-new-bank-expense/:id"
                  element={<AddAndEditExpense />}
                />
                <Route
                  path="banking/edit-expense/:id"
                  element={<AddAndEditExpense />}
                />
                <Route
                  path="banking/add-new-contra-entry"
                  element={<AddAndEditContraEntry />}
                />
                <Route
                  path="banking/edit-contra-entry/:id"
                  element={<AddAndEditContraEntry />}
                />
                <Route path="journalEntry" element={<JournalEntry />} />
                <Route path="add-new-journal" element={<AddNewJournal />} />
                <Route path="add-new-journal/:id" element={<AddNewJournal />} />
                <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
              </Route>
              <Route
                path="jounral-entry-dashboard/:id"
                element={<JournalEntryDashboard />}
              />
            </Route>
            <Route
              path="login"
              element={isLoggedIn ? <Navigate to="/" /> : <AdminLogin />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
