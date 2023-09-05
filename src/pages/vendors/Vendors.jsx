import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import { Avatar, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteAllVendors,
  deleteVendor,
  fetchAllVendors,
} from "../../services/vendorServices";
import { setVendor } from "../../redux/ducks/vendorSlice";
import Table from "../../components/Table/Table";
import ModalComponent from "../../components/Modal/ModalComponent";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

const folderName = "Vendors";

const Vendors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { vendorsList } = useSelector((state) => state.vendors);

  useEffect(() => {
    (async () => {
      const { data } = await fetchAllVendors();
      dispatch(setVendor(data));
    })();
  }, [dispatch]);

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
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    { field: "email", headerName: "Email", width: 180 },
    {
      field: "phone",
      headerName: "Phone Numbers",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 130,
    },
    {
      field: "receivables",
      headerName: "Receivables",
      type: "number",
      width: 150,
    },
    {
      field: "credits",
      headerName: "Credits",
      type: "number",
      width: 150,
    },
  ];

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
  const handleDelete = async () => {
    setLoading(true);

    let data;
    if (selectedRow?.length === vendorsList?.length) {
      data = await deleteAllVendors();
    } else {
      data = await deleteVendor(selectedRow);
    }
    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setVendor(filteredData));

    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="estimate-wrapper tw-mt-16">
      {/* modal starting for confirmation */}
      <ModalComponent
        title={`Delete vendor`}
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
      <div className="dashboard">
        <DashboardNavbar
          rounded={true}
          url={"add-new-vendor"}
          selectedRow={selectedRow}
          handleNavigation={() =>
            navigate(`edit-vendor/${selectedRow[0]?._id}`)
          }
          handleDelete={() => setOpen(!open)}
        />
      </div>
      <div className="tw-h-d tw-px-14 tw-mt-2.5 tw-w-[80vw]">
        {vendorsList && (
          <Table
            columns={columns}
            rows={
              vendorsList?.length >= 0 &&
              vendorsList
                .filter((x) => !x.blackList)
                .map((x, idx) => ({
                  id: x?._id,
                  image: x?.image,
                  email: x?.email,
                  phone: x?.mobileNumber,
                  receivables: x?.receivables,
                  credits: x?.credits,
                  name: x?.firstName + " " + x?.lastName,
                }))
            }
            handleRowClick={handleRowClick}
            handleNavigation={(e) => navigate(`/purchases/vendors/${e.row.id}`)}
            listOfItems={vendorsList}
            dashboard={false}
          />
        )}
      </div>
    </div>
  );
};

export default Vendors;
