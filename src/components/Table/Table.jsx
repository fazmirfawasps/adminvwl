import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const styles = {
  borderRadius: "8px",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#EEE7FF",
    padding: "0px 10px",
  },
  "& .MuiDataGrid-columnHeadersInner": {
    width: "-webkit-fill-available",
  },
  "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
    width: "-webkit-fill-available",
    display: "flex",
    justifyContent: "space-between",
  },
  "& .css-k008qs": {
    width: "-webkit-fill-available",
    display: "flex",
    justifyContent: "space-between",
  },
  "& .MuiDataGrid-row": {
    cursor: "pointer",
    width: "-webkit-fill-available",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    padding: "0px 10px",
  },
  "& .MuiDataGrid-virtualScrollerRenderZone": {
    width: "-webkit-fill-available",
  },
  "& .MuiDataGrid-cell:empty": {
    display: "contents",
  },
  "& .MuiSvgIcon-fontSizeMedium": {
    color: "#8153E2",
  },
  "& .MuiDataGrid-iconSeparator": {
    color: "inherit",
  },
};

const theme = createTheme({
  typography: {
    fontFamily: ["Manrope", "sans-serif"].join(","),
  },
});

const Table = ({
  rows,
  columns,
  handleRowClick,
  handleNavigation,
  listOfItems,
  dashboard,
}) => {
  // console.log(rows,'rowsssssssssinside');
  return (
    <div className="tw-h-full tw-w-full">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataGrid
          // getRowId={(row) => row.id}
          sx={
            ({
              fontFamily: "Raleway",
            },
              styles)
          }
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 7 },
            },
          }}
          pageSizeOptions={[7, 14]}
          checkboxSelection={!dashboard}
          // rowCount={columns?.length - 1}
          // getRowClassName={getRowClassName}
          onRowClick={(e) => handleNavigation(e)}
          onRowSelectionModelChange={(e) => handleRowClick(e, listOfItems)}
        />
      </ThemeProvider>
    </div>
  );
};

export default Table;
