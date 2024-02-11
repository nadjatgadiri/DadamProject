import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Iconify from '../../../components/iconify';

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}
function getFrenchDay(dayIndex) {
  const frenchDays = [
    'Lundi', // Monday
    'Mardi', // Tuesday
    'Mercredi', // Wednesday
    'Jeudi', // Thursday
    'Vendredi', // Friday
    'Samedi', // Saturday
    'Dimanche', // Sunday
  ];

  if (dayIndex >= 1 && dayIndex <= 7) {
    return frenchDays[dayIndex - 1];
  }
  return 'Invalid day index';
}
// rows
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  console.log(row);
  return (
    <fragment style={{ width: '100%' }}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: '20%' }} component="th" scope="row">
          {row.day}
        </TableCell>
        <TableCell sx={{ width: '50%' }} align="right">
          Répétition de ce jours est : {row.Frequence} fois.
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => {
              props.openDialog1(row.codeDay);
            }}
          >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Zones horaires
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '40%' }}>Commencé à</TableCell>
                    <TableCell sx={{ width: '40%' }}>Fini à</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.timeZones.map((timeZonesRow, index) => (
                    <TableRow key={row.codeDay}>
                      <TableCell component="th" scope="row">
                        {timeZonesRow.timeStart}
                      </TableCell>
                      <TableCell>{timeZonesRow.timeEnd}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => {
                            props.openDialog2(row.codeDay, index);
                          }}
                        >
                          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </fragment>
  );
}

function RowStep3(props) {
  const { row, id, isSessionInClass } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{getFrenchDay(id)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Les Plans
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Titre</TableCell>
                    <TableCell>Début</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Disponibilité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(row).map(([key, value]) => (
                    <Row2 key={key} row={value} id={key} isSessionInClass={isSessionInClass} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function Row2(props) {
  const { row, id, isSessionInClass } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow key={id}>
        <TableCell sx={{ width: '30%' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>

          {id}
        </TableCell>
        <TableCell>{row.start.substring(0, 5)}</TableCell>
        <TableCell>{row.end.substring(0, 5)}</TableCell>
        <TableCell>{row.used} fois</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    {isSessionInClass && <TableCell>Salles</TableCell>}
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.data.map((rowData, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell scope="row">{formatDate(rowData.day)}</TableCell>
                      {isSessionInClass && (
                        <TableCell>
                          {rowData.classes.map((classe, index) => (
                            <span key={index}>
                              {`${classe.name}${index < rowData.classes.length - 1 ? ', ' : ''}`}
                            </span>
                          ))}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function Row4(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <fragment style={{ width: '100%' }}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: '20%' }} component="th" scope="row">
          {row.groupName}
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => {
              props.openDialog1(row.codeDay);
            }}
          >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '40%' }}>Jour</TableCell>
                    <TableCell sx={{ width: '40%' }}>Débuté à</TableCell>
                    <TableCell sx={{ width: '40%' }}>Terminée à</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(row.days).map((day) =>
                    Object.entries(day.plans).map(([plan]) => (
                      <TableRow key={day.codeDay}>
                        <TableCell component="th" scope="row">
                          {getFrenchDay(day.codeDay)}
                        </TableCell>
                        <TableCell>{plan.start}</TableCell>
                        <TableCell>{plan.end}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </fragment>
  );
}
// Row2.propTypes = {
//   row: PropTypes.shape({
//     start: PropTypes.string.isRequired,
//     end: PropTypes.string.isRequired,
//     used: PropTypes.number.isRequired,
//     data: PropTypes.arrayOf(
//       PropTypes.shape({
//         day: PropTypes.string.isRequired,
//         classes: PropTypes.arrayOf(
//           PropTypes.shape({
//             name: PropTypes.string.isRequired,
//           })
//         ).isRequired,
//       })
//     ).isRequired,
//   }).isRequired,
//   id: PropTypes.string.isRequired,
//   isSessionInClass: PropTypes.bool,
// };

// Row.propTypes = {
//   row: PropTypes.shape({
//     day: PropTypes.string.isRequired,
//     Frequence: PropTypes.number.isRequired,
//     timeZones: PropTypes.arrayOf(
//       PropTypes.shape({
//         timeStart: PropTypes.string.isRequired,
//         timeEnd: PropTypes.string.isRequired,
//       })
//     ).isRequired,
//     codeDay: PropTypes.string.isRequired,
//   }).isRequired,
//   openDialog1: PropTypes.func.isRequired,
//   openDialog2: PropTypes.func.isRequired,
// };

// RowStep3.propTypes = {
//   row: PropTypes.object.isRequired,
//   id: PropTypes.string.isRequired,
//   isSessionInClass: PropTypes.bool,
// };

// Row4.propTypes = {
//   row: PropTypes.shape({
//     groupName: PropTypes.string.isRequired,
//     codeDay: PropTypes.string.isRequired,
//     days: PropTypes.object.isRequired,
//   }).isRequired,
//   openDialog1: PropTypes.func.isRequired,
// };

// end rows

export { Row, RowStep3, Row4, Row2 };
