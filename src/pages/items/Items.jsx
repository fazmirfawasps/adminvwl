import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabPanel from "@mui/lab/TabPanel";
import { Avatar, Button, MenuItem } from "@mui/material";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import ModalComponent from "../../components/Modal/ModalComponent";
import CommonTab from "../../components/CommonTab/CommonTab";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  addCategory,
  deleteAllItems,
  deleteItem,
  fetchAllItems,
  getAllParentCategories,
} from "../../services/ItemService";
import SelectDropDown from "../../components/SelectDropDown/SelectDropDown";
import TextArea from "../../components/TextArea/TextArea";
import Input from "../../components/Input/Input";
import { getItem, setItem } from "../../redux/ducks/itemSlice";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Table/Table";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

const modal3Style = {
  width: 394,
  height: 384,
};

const tabHeadContent = [
  { value: "1", label: "Items" },
  { value: "2", label: "Categories" },
];

const tableHeadContent2 = [
  { value: <input style={{ width: "12px" }} type="checkbox" /> },
  { value: " Name" },
  { value: "Description" },
  { value: "Parent" },
  { value: "Count" },
  {},
];

const Items = () => {
  const itemsColumns = [
    {
      field: "image",
      headerName: "Photo",
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={8}>
          <Avatar
            src={`http://localhost:8000/images/${folderName}/${params.value}`}
            // onClick={() => handleImageClick(params.row.id)}
            style={{ width: 25, height: 25, cursor: "pointer" }}
          />
        </Box>
      ),
    },
    { field: "firstName", headerName: "Name", width: 100 },
    { field: "description", headerName: "Description", width: 100 },
    {
      field: "Rate",
      headerName: "rate",
      type: "number",
      width: 100,
    },
    {
      field: "unit",
      headerName: "Unit",
      type: "number",
      width: 100,
    },
  ];
  const categoriesColumn = [
    { field: "itemName", headerName: "Name", width: 100 },
    { field: "description", headerName: "Description", width: 100 },
    {
      field: "parent",
      headerName: "Parent",
      type: "number",
      width: 100,
    },
    {
      field: "count",
      headerName: "Count",
      type: "number",
      width: 100,
    },
  ];
  const [value, setValue] = useState("1");
  const dispatch = useDispatch();
  const { data, itemCounts } = useSelector((state) => state.items);

  const [showModal, setShowModal] = useState(false);
  const [parentCategory, setParentCategory] = useState([]);
  const folderName = "Items";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [categoryValues, setCategoryValues] = useState({
    categoryName: "",
    parentCategory: "",
    categoryDescription: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const fetchedItems = await fetchAllItems();
      console.log(fetchedItems, "the dta in invoke function");
      dispatch(setItem(fetchedItems));
    })();
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddNewClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleParentCategorie = (event) => {
    setCategoryValues({
      ...categoryValues,
      [event.target.name]: event.target.value,
    });
  };
  const handleAddCategory = async () => {
    const { data } = await addCategory(categoryValues);
    if (data.message) {
      setCategoryValues("");
      handleCloseModal();
    }
  };
  const handleDashboardNavigation = (e) => {
    navigate(`/itemdashboard/${e?.id}`);
  };

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
    if (selectedRow?.length === data?.length) {
      data = await deleteAllItems();
    } else {
      data = await deleteItem(selectedRow);
    }

    dispatch(setItem(data));
    setLoading(false);
    setOpen(false);
    fetchAllItems();
  };

  // useEffect(() => {
  //   dispatch(getItem());
  // }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getAllParentCategories();
      setParentCategory(data);
    }
    fetchData();
  }, []);

  return (
    <>
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

      <div className="estimate-wrapper tw-mt-16">
        <Box sx={{ width: "100%" }}>
          <CommonTab
            onChange={handleChange}
            value={value}
            tabHeadContent={tabHeadContent}
          >
            {/* <TabContext value={value}> */}
            {/* <Box sx={{ borderColor: 'divider', textTransform: 'lowercase',width:'100%'  }}>
                            <TabList sx={{paddingLeft:'1rem'}} onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Items" value="1" sx={{ textTransform: 'capitalize' }} />
                                <Tab label="Categories" value="2" sx={{ textTransform: 'capitalize' }} />
                                
                            </TabList>
                        </Box> */}
            <div className="dashboard">
              {value == "1" ? (
                <DashboardNavbar
                  url={"/additem"}
                  value={"1"}
                  selectedRow={selectedRow}
                  handleNavigation={() =>
                    navigate(`/addItem/${selectedRow[0]?._id}`)
                  }
                  handleDelete={() => setOpen(!open)}
                />
              ) : (
                <DashboardNavbar onModalOpen={handleAddNewClick} />
              )}
            </div>
            <TabPanel
              sx={{ height: "76vh", padding: "0px 3.5rem", marginTop: "10px" }}
              value="1"
            >
              {data && (
                <Table
                  columns={itemsColumns}
                  rows={
                    data &&
                    data.length > 0 &&
                    data.map((items) => ({
                      id: items?._id,
                      image: items?.image,
                      firstName: items?.itemName,
                      description: items?.description,
                      rate: items?.rate,
                    }))
                  }
                  dashboard={false}
                  handleRowClick={handleRowClick}
                  handleNavigation={handleDashboardNavigation}
                  listOfItems={data}
                />
              )}
            </TabPanel>
            <TabPanel sx={{ height: "76vh", padding: "0px 3.5rem" }} value="2">
              <Table
                columns={categoriesColumn}
                rows={data?.map((data) => ({
                  id: data?._id,
                  itemName: data?.itemName,
                  description: data?.itemDescription,
                  itemCount: itemCounts?.find(
                    (itemCount) => itemCount?._id === data?.category?._id
                  )?.count,
                  // parent:itemCounts.map((items)=>({
                  //     parent:items?.name

                  // }
                  parent: itemCounts
                    .filter(
                      (itemCount) =>
                        (itemCount?._id === itemCount?._id) ===
                        data.category._id
                    )
                    .map((itemCount) => itemCount?.name),
                }))}
              />

              {/* <TableHeader headContents={tableHeadContent2} style={{ width: '100%', backgroundColor: 'white' }}   >
                                <TableBodyComponent>
                                    {data?.map((item) => (
                                        <StyledTableRow sx={{ height: '40px' }} key={item._id}>
                                            <input style={{ width: '12px', border: '1px solid #8153E2 ', cursor: 'pointer' }} type="checkbox" />
                                            <StyledTableCell onClick={() => {
                                                navigate(`/itemdashboard/${item._id}`)
                                            }} sx={{ cursor: 'pointer' }}   >{item.itemName}</StyledTableCell>
                                            <StyledTableCell   >{item.itemDescription}</StyledTableCell>
                                            <StyledTableCell  >
                                                {itemCounts?.find(
                                                    (itemCount) =>
                                                        itemCount?._id === item?.category?._id
                                                )?.count}</StyledTableCell>
                                            <StyledTableCell >
                                                <MoreVert /></StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBodyComponent>
                            </TableHeader> */}
            </TabPanel>
          </CommonTab>
        </Box>
      </div>

      <ModalComponent
        title={"New Category"}
        onClose={handleCloseModal}
        open={showModal}
        fade={showModal}
        style={{ ...baseStyle, ...modal3Style }}
      >
        <div
          className="tw-px-6 tw-py-3"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div className="tw-w-full">
            <Input
              type={"text"}
              label={"Category Name"}
              placeholder={"Enter Category Name"}
              name={"categoryName"}
              value={categoryValues.categoryName}
              onChange={handleParentCategorie}
              style={{
                height: "27px",
                fontSize: "12px",
                width: "100%",
              }}
            />
          </div>

          <div className="tw-w-full">
            <label>Parent Category </label>
            <SelectDropDown
              value={categoryValues.parentCategory}
              onChange={handleParentCategorie}
              name={"parentCategory"}
              style={{
                fontSize: "12px",
                height: "27px",
              }}
            >
              <MenuItem value="none">None</MenuItem>
              {parentCategory?.map((category) => (
                <MenuItem key={category} value={category?._id}>
                  {category.name}
                </MenuItem>
              ))}
            </SelectDropDown>
          </div>
          <div className="tw-w-full">
            <TextArea
              label={"Description"}
              name={"categoryDescription"}
              placeholder={"Enter Description here"}
              onChange={handleParentCategorie}
              style={{
                // border: formErrors.categoryDescription
                //   ? "1px solid #FF0000"
                //   : "",
                fontSize: "12px",
              }}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              paddingBlock: "1rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#8153E2",
                color: "white",
                height: "25px",
              }}
              onClick={handleAddCategory}
            >
              Save
            </Button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};

export default Items;
