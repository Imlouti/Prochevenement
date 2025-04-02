import React, { useState } from "react";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

import { frFR } from '@mui/x-date-pickers/locales';

import 'dayjs/locale/fr';
import { Navigator } from "../components/Navigator";



const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

//higlight the dates in highlightedDays arra
const ServerDay = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.includes(day.format("YYYY-MM-DD"));

  return (
    <HighlightedDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      selected={isSelected}
    />
  );
};

const SessionBooking = ({ doctor }) => {
  const [highlightedDays] = useState([
    "2025-04-07",
    "2025-04-09",
    "2025-03-21",
    "2025-03-12",
  ]);


  const today = dayjs();

  return (
    <div id="background">
      <Navigator/>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} adapterLocale="fr"        >
          <StaticDatePicker
            defaultValue={today}
            minDate={today}
            maxDate={today.add(10, "year")}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
              },
              actionBar: { actions: ["accept"] },
            }}
            onAccept	={(date) => {
              date=new Date(date)
              date=date.toISOString().split('T')[0]
              highlightedDays.forEach(function (item, index) {
                if (highlightedDays[index]==date){
                  alert(item)
                }
              });
              

           }}
           
           localeText={{ clearButtonLabel: 'Empty' }} 

          />
        </LocalizationProvider>
      </div>
  );
};

export default SessionBooking;


