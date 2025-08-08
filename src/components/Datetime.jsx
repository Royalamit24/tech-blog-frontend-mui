import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const today = dayjs();

// const isInCurrentMonth = (today) => today.get('month') === dayjs().get('month');

export default function Datetime({styles, onChange}) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DemoItem label="Date of birth">
          <DatePicker 
           sx={{
            border: '1px solid #227ad9' ,
            ...styles
          }}
            // name = {name}
            onChange={onChange}
            autoFocus= "false"
            defaultValue={today}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}