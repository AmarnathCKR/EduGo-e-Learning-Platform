import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function DataTable(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: "name", sort: "asc" }]);
  const [searchText, setSearchText] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => <img width="20" src={params.value} alt="icon" />,
    },
    { field: "name", headerName: "Name", width: 300 },
    { field: "tag", headerName: "Tag", width: 300 },
  ];
  const token = useSelector((state) => state.adminToken);

  const fetchCategory = (page, pageSize, sortModel, searchText) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/admin/fetch-field?page=${page}&pageSize=${pageSize}&sortField=${
          sortModel.length > 0 ? sortModel[0].field : ""
        }&sortOrder=${
          sortModel.length > 0 ? sortModel[0].sort : ""
        }&searchText=${searchText}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data.items);
        setTotalCount(response.data.totalCount);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(
    () => fetchCategory(page, pageSize, sortModel, searchText),
    [page, pageSize, sortModel, searchText,props.show]
  );

  const handlePageChange = (params) => {
    setPage(params.page);
    setPageSize(params.pageSize);
  };

  const handleSortChange = (params) => {
    setSortModel(params);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          fontWeight: 400,
          fontSize: 14,
          opacity: 0.9,
          border: 1,
          color: "#000000",
          "& .MuiDataGrid-row": {},
          "& .MuiDataGrid-columnHeaders": {
            borderTop: 1,
            borderBottom: 1,
            borderRadius: 0,
            backgroundColor: "#a9c2af",
          },
          "& .MuiDataGrid-footerContainer": {
            border: 0,
          },
          "& .MuiTablePagination-selectLabel": {
            color: "rgba(0, 54, 101, 0.6)",
          },
          "& .MuiSelect-select": {
            color: "#003665",
          },
          "& .MuiTablePagination-displayedRows": {
            color: "#003665",
          },
          "& .MuiSvgIcon-root": {
            color: "#003665",
          },
        }}
        columns={columns}
        pagination
        pageSize={pageSize}
        rowCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={setPageSize}
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        components={{
          Toolbar: () => (
            <div className="ml-10 mt-3">
              <input
                className=" p-2 border rounded pr-10"
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
          ),
        }}
      />
    </div>
  );
}

export default DataTable;
