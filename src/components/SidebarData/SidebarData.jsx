import { BiHomeAlt2, BiPurchaseTagAlt } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";
import { MdAccountBox } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";

export const SidebarData = [
  {
    id: 1,
    title: "Home",
    icon: <BiHomeAlt2 />,
    path: "/",
    showDrop:false
  },
  {
    id:8 ,
    title: "Orders",
    icon: <BiHomeAlt2 />,
    path: "/orders",
    showDrop:false
  },
  {
    id:9 ,
    title: "Staff",
    icon: <BiHomeAlt2 />,
    path: "/staff",
    showDrop:false
  },{
    id:10 ,
    title: "Route",
    icon: <BiHomeAlt2 />,
    path: "/route",
    showDrop:false
  },
  {
    id: 2,
    title: "Sales",
    icon: <BiPurchaseTagAlt />,
    path: "/sales",
    showDrop:true,
    subMenuItems: [
      {
        id: 101,
        title: "Estimates",
        path: "/sales/estimates",
      },
      {
        id: 102,
        title: "Invoices",
        path: "/sales/invoices",
      },
      {
        id: 103,
        title: "Sales Order",
        path: "/sales/sales-order",
      },
      {
        id: 104,
        title: "Receipts",
        path: "/sales/receipts",
      },
      {
        id: 105,
        title: "Customers",
        path: "/sales/customers",
      },
      {
        id: 106,
        title: "Items",
        path: "/sales/items",
      },
    ],
  },
  {
    id: 3,
    title: "Purchases",
    icon: <MdAccountBox />,
    path: "/purchases",
    showDrop:true,
    subMenuItems: [
      {
        id: 301,
        title: "Vendors",
        path: "/purchases/vendors",
      },
      {
        id: 302,
        title: "Purchase Orders",
        path: "/purchases/purchase-orders",
      },
      {
        id: 303,
        title: "Bills",
        path: "/purchases/bills",
      },
      {
        id: 304,
        title: "Payment Receipts",
        path: "/purchases/payment-receipts",
      },
      {
        id: 305,
        title: "Goods Receive Notes",
        path: "/purchases/goods-receive-notes",
      },
    ],
  },
  {
    id: 4,
    title: "Accounting",
    icon: <BiHomeAlt2 />,
    path: "/accounting",
    showDrop:true,

    subMenuItems: [
      {
        id: 401,
        title: "Banking",
        path: "/accounting/banking",
      },
      {
        id: 402,
        title: "Journal Entry",
        path: "/accounting/journalEntry",
      },
      {
        id: 403,
        title: "Chart of Accounts",
        path: "/accounting/chart-of-accounts",
      },
      {
        id: 404,
        title: "Assets",
        path: "/accounting/assets",
      },
    ],
  },
  {
    id: 5,
    title: "Payroll",
    icon: <VscAccount />,
    showDrop:true,
    path: "/payroll",
  },
  {
    id: 6,
    title: "Reports",
    icon: <TbReportAnalytics />,
    path: "/reports",
  },
  {
    id: 7,
    title: "Settings",
    icon: <FiSettings />,
    path: "/settings",
    showDrop:true,
    subMenuItems: [
      {
        id: 107,
        title: "Profile",
        path: "/settings/profile",
      },

      {
        id: 108,
        title: "Tax",
        path: "/settings/tax",
      },

      {
        id: 109,
        title: "Invoice",
        path: "/settings/invoices",
      },
      {
        id: 110,
        title: "Receipts",
        path: "/settings/receipts",
      },
      {
        id: 111,
        title: "Customers",
        path: "/settings/clients",
      },
      {
        id: 112,
        title: "Items",
        path: "/settings/items",
      },
    ],
  },
];
