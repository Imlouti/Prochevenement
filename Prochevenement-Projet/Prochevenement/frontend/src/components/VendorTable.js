import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  { id: 'event', label: 'Événement', minWidth: 100 },

  { id: 'location', label: 'Location', minWidth: 100 },
  { id: 'price', label: 'Prix', minWidth: 100 },
  { id: 'tickets', label: 'Billets restant', minWidth: 100 },



];

function createData(id, event, location, price, tickets) {
  return { id, event, location, price, tickets };
}



const response = await fetch('http://localhost:4001/auth/eventTable', {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }});

const data = await response.json();

var result = Object.keys(data).map((key) => [key, data[key]]);


var i;
var rows =[];
for (i = 0; i < result.length; i++) {
if(result[i][1]!=undefined){
var id =result[i][1]._id;
var nom =result[i][1].nom;
var location =result[i][1].location;
var billets =result[i][1].billets;
var prix ="$"+result[i][1].prix;




rows.push(createData(id, nom, location, prix, billets, '<Button>Creation</Button>'));
}

}
if(rows.length==0){
  rows.push(createData("Pas d'evenements", "", 0, 0));
}

export const VendorTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const paginationModel = { page: 0, pageSize: 5 };


  return (
    <div style={{margin:"10px"}}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        
            
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        if(column.id!='event'){
                          return (
                            <TableCell key={column.id} align={column.align}>
                            {
                            
                            column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )
                        }
                        else{

                        return (
                            <TableCell key={column.id} align={column.align}>
                            {
                            
                            column.format && typeof value === 'number'
                                ? column.format(value)
                                : <a href={`/ModifierEvenement?@${value}`} style={{fontSize: 14, textAlign: "left"}}> {value}</a>}
                            </TableCell>
                        );
                      }
                        })}
                    </TableRow>
                    );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
        
    </div>
  );
}