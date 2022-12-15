import { useState } from "react";
import Papa from "papaparse";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { makeStyles } from "@mui/styles";
import EmptyTableIcon from "./EmptyTableIcon";
//import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    paddingInline: "20px",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "rgba(152,101,192,0.18)",
  },

  title: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  titleText: {
    padding: "8px",
    margin: "10px",
    textDecoration: "underline #678cdc 2px",
    textTransform: "uppercase",
    //background: "rgba(0,0,0,0.13)"
  },

  tableHeader: {
    boxShadow: "0px 5px 8px rgba(0,0,0,0.1)",
  },

  pagination: {
    boxShadow: "0px -5px 8px rgba(0,0,0,0.1)",
  },
});

function App() {
  const classes = useStyles();

  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = () => {
    setPage(1);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  return (
    <Box className={classes.body}>
      <Box className={classes.title}>
        <Typography className={classes.titleText} variant="h4">
          CSV File Visualizer
        </Typography>

        {/*File Uploader */}
        <Button
          component="label"
          size="small"
          variant="outlined"
          startIcon={<FileUploadIcon />}
        >
          Upload File
          <input type="file" onChange={changeHandler} accept=".csv" hidden />
        </Button>
      </Box>

      {/* DataTable */}

      <Paper>
        <TableContainer
          style={{
            height: 600,
            minWidth: 800,
            width: "100%",
            position: "relative",
          }}
        >
          {parsedData.length <= 0 ? (
            <EmptyTableIcon />
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  {tableRows.map((rows, index) => {
                    return <TableCell key={index}>{rows}</TableCell>;
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {values
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value, index) => {
                    return (
                      <TableRow key={index}>
                        {value.map((val, i) => {
                          return (
                            <TableCell style={{ maxWidth: 400 }} key={i}>
                              {val}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={values.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default App;
