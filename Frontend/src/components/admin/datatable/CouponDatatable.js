import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { BiEdit } from "react-icons/bi";


import { fetchAnyDetailsApi, getDataApi } from "../../../api/adminAPI";
import AddCouponsModal from "../modals/AddCouponsModal";
import { blockCouponApi } from "../../../api/adminAPI";

function CouponDatatable(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: "name", sort: "asc" }]);
  const [searchText, setSearchText] = useState("");
  const [tempSearch, setTemp] = useState("");
  const [stat, setStat] = useState(false);
  const [item, setItem] = useState();
  const [show, setShow] = useState(false);
  const handleDelete = (id) => {
    blockCouponApi(id, token).then((res) => {
      setStat(!stat);
    });
  };

  const handleEdit = (id) => {
    getDataApi("get-coupon",id, token).then((res) => {
      // console.log(res.data.data.content.data)
      setItem(res.data.data.content.data);
      setShow(true);
    });
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 100 },
    
    { field: "name", headerName: "Name", width: 200 },
    { field: "discount", headerName: "Discount In Percentage", width: 200 },
    { field: "expirationTime", headerName: "Expiration Data", width: 200 },

    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <>{params.value === true ? "Active" : "Blocked"}</>
      ),
    },
    {
      field: "ref",
      headerName: "Edit",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center">
          <button
            className="text-center flex justify-center"
            onClick={() => {
              handleEdit(params.value);
            }}
          >
            <BiEdit size="20px" />
          </button>
        </div>
      ),
    },
    {
      field: "id",
      headerName: "Control",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center">
          <button
            className="text-center flex justify-center"
            onClick={() => {
              handleDelete(params.value);
            }}
          >
            Change Status{" "}
          </button>
        </div>
      ),
    },
  ];
  const token = useSelector((state) => state.adminToken);

  const fetchCategory = (page, pageSize, sortModel, searchText) => {
    setLoading(true);
    const queries = {
      page: page,
      pageSize: pageSize,
      sortModel: sortModel,
      searchText: searchText,
    };

    fetchAnyDetailsApi("fetch-coupon",queries, token)
      .then((response) => {
        console.log(response.data.items);
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
    // eslint-disable-next-line
    [page, pageSize, sortModel, searchText, props.show, stat]
  );

  const handlePageChange = (params) => {
    setPage(params.page);
    setPageSize(params.pageSize);
  };

  const handleSortChange = (params) => {
    setSortModel(params);
  };

  const handleSearchChange = (event) => {
    event.preventDefault();
    setTemp(event.target.value);
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleSubmit = () => {
    setSearchText(tempSearch);
  };
  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div style={{ height: 480, width: "100%" }}>
      <AddCouponsModal
        show={show}
        toggle={setStat}
        click={handleClick}
        data={item}
        link="edit-coupon"
      />
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
            <div className="ml-10 mt-3 flex my-3 justify-center">
              <form onSubmit={handleSubmit}>
                <input
                  className=" p-2 border rounded pr-10 focus:outline-none"
                  type="text"
                  placeholder="Search..."
                  variant="outlined"
                  autoFocus="autoFocus"
                  value={tempSearch}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="bg-black border rounded text-white p-2"
                >
                  Search
                </button>
              </form>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default CouponDatatable;
