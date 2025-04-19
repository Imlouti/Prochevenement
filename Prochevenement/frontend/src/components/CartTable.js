import * as React from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, Collapse, Paper, TableRow, TableHead, TableCell, TableContainer, TableBody, Table } from '@mui/material';

const TAX_RATE = 0.07;

// Currency Formatting
function ccyFormat(num) {
  return num;// `${num.toFixed(2)}`;
}

function createEventDetails(event, vendor, ...ticketDetails) {
  
  let price = 0;
  let eventTotal = 0;

  function eventPrice(value) {

    eventTotal = eventTotal + value
    //console.log(eventTotal)

  };

  function createTicketInfo(...ticketDetails) {

    //console.log(ticketDetails)

    let ticketDesc = ""
    let individualPrice = 0
    let quantity = 0

    ticketDetails.forEach(element => {
      element.forEach(item => {
        //console.log(item)
        ticketDesc = item[0];
        individualPrice = item[1];
        quantity = item[2];
        const price = individualPrice * quantity;
        eventPrice(price);
      });

    });

    //console.log(ticketDesc + ", " + individualPrice + ", " + quantity)
    
    return {ticketDesc, individualPrice, quantity, price};
  
  };

  function iterateTickets(...data) {

    let array = [];
    
    data.forEach(element => {
      let i = 0
      element.forEach(item => {
        //console.log(item)
        array[i] = createTicketInfo(item);
        i++;
      });
    });
    console.log(array)
    return {array};

  };

  return {

    event,
    vendor,
    ticketDetails: iterateTickets(ticketDetails),
    eventTotal,

  }

}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createEventDetails('Event 1', 'Vendor 1', [['Ticket 1', 10, 1]]),
  //createEventDetails('Event 2', 'Vendor 2', [['Ticket 1', 12, 2], ['Ticket 2', 8, 1]])
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

// Function that will return a row for an event purchase
function Row(props) {

  const { row } = props;
  const [open, setOpen] = React.useState;

  return (

    <React.Fragment>
      <TableRow sx={{ '& > *': {borderBottom: 'unset' }}}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>

  );

}

Row.propTypes = {

  row: PropTypes.shape({
    event: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    ticketDetails: PropTypes.arrayOf(
      PropTypes.shape({
        ticketDesc: PropTypes.string.isRequired,
        individualPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      }),
    ).isRequired,
    eventTotal: PropTypes.number.isRequired,
  }).isRequired,

};

export const CartTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Event Name</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell colSpan={1}/>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell>{row.qty}</TableCell>
              <TableCell colSpan={1}/>
              <TableCell align="right">${ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={0} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}