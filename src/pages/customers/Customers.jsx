import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import Table from "../../components/Table/Table";
import { Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCustomer, setCustomer } from "../../redux/ducks/customerSlice";
import {
  deleteAllCustomers,
  deleteCustomer,
  fetchAllCustomers,
} from "../../services/customerServices";
import ModalComponent from "../../components/Modal/ModalComponent";
const folderName = "Customers";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

function Customers() {
  const columns = [
    {
      field: "image",
      headerName: "Photo",
      width: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Avatar
            src={`http://localhost:8000/images/${folderName}/${params.value}`}
            style={{ width: 25, height: 25 }}
          />
        </Box>
      ),
    },
    { field: "firstName", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    {
      field: "phone",
      headerName: "Phone Numbers",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 130,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "Receivables",
      headerName: "Receivables",
      type: "number",
      width: 150,
    },
    {
      field: "Credits",
      headerName: "Credits",
      type: "number",
      width: 150,
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersList } = useSelector((state) => state.customers);

  const [selectedRow, setSelectedRow] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await fetchAllCustomers();
      dispatch(setCustomer(data));
    })();
  }, [dispatch]);

  const handleRowClick = (e, listOfItems) => {
    const id = e?.row?.id;
    if (!id) {
      if (e?.length) {
        const items = e.map((item1) => {
          const matchedItem = listOfItems.find((item2) => item2._id === item1);
          return { ...matchedItem };
        });

        return setSelectedRow(items);
      }

      setSelectedRow([]);
      return;
    }

    if (selectedRow?.length) {
      const exist = selectedRow?.filter((x) => x._id === id);
      if (exist?.length) {
        const filteredItems = selectedRow?.filter((x) => x._id !== id);
        setSelectedRow(filteredItems);
      }
    }
  };

  const handleDashboardNavigation = (e) => {
    navigate(`/customerdashboard/${e?.id}`);
  };

  const handleDelete = async () => {
    setLoading(true);

    let data;
    if (selectedRow?.length === customersList?.length) {
      data = await deleteAllCustomers();
    } else {
      data = await deleteCustomer(selectedRow);
    }
    dispatch(setCustomer(data));
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <div className="dashboard tw-mt-16 tw-bg-white">
        {/* modal starting for confirmation */}
        <ModalComponent
          title={`Delete invoice`}
          onClose={(e) => setOpen(false)}
          open={open}
          fade={open}
          style={{ ...baseStyle }}
        >
          <div className="tw-px-6 tw-pt-3 tw-pb-6">
            <div className="tw-text-[12px]">
              Are you sure you want to delete the selected {selectedRow?.length}{" "}
              {selectedRow?.length === 1 ? "item" : "items"} ?
            </div>
            <div className="tw-pt-3  tw-flex tw-items-end tw-justify-center tw-gap-5">
              <button
                onClick={() => setOpen(!open)}
                className="tw-px-3 tw-h-8 tw-w-24 tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-rounded-md tw-border tw-border-[#8153E2] tw-bg-[#8153E2]`}
              >
                {loading ? "Please wait" : "Delete"}
              </button>
            </div>
          </div>
        </ModalComponent>

        {/* modal ending for confirmation */}

        <DashboardNavbar
          rounded={true}
          url={"/addcustomer"}
          selectedRow={selectedRow}
          handleNavigation={() =>
            navigate(`/addCustomer/${selectedRow[0]?._id}`)
          }
          handleDelete={() => setOpen(!open)}
        />
      </div>
      <div className="tw-px-14 tw-h-[80vh] tw-bg-white">
        {customersList && (
          <Table
            columns={columns}
            rows={
              customersList &&
              customersList.length > 0 &&
              customersList.map((customer) => ({
                id: customer?._id,
                image: customer?.image,
                email: customer?.email,
                phone: customer?.phone,
                Receivables: customer?.receivables,
                Credits: customer?.credits,
                firstName: customer?.firstName,
              }))
            }
            dashboard={false}
            handleRowClick={handleRowClick}
            handleNavigation={handleDashboardNavigation}
            listOfItems={customersList}
          />
        )}
      </div>
    </>
  );
}

export default Customers;
