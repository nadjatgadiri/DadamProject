import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  OutlinedInput,
  Avatar,
  Table,
  Stack,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  DialogTitle,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Buffer } from 'buffer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from '../../../components/iconify'; // You need to provide the correct path to the Iconify component
import Scrollbar from '../../../components/scrollbar'; // You need to provide the correct path to the Scrollbar component
// sections
import { UserListHead, UserListToolbarP } from '../../../sections/@dashboard/user';
// api importation
import {
  deletePayment,
  getStudentsForProgramPayments,
} from '../../../RequestManagement/paymentManagement';

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'paymentDate', label: 'Payment Date', alignRight: false },
  { id: 'montant', label: 'Montant', alignRight: false },
  { id: '' },
];

// table functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, filterGroup) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_cat) => _cat.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  if (filterGroup === 'aucun') {
    return filter(array, (item) => item.group === null);
  }
  if (filterGroup !== '') {
    return filter(array, (item) => item.group === filterGroup);
  }
  return stabilizedThis.map((el) => el[0]);
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 50,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 300,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const PaymentComponent = (props) => {
  const { idProg, groups } = props; // Accessing id from props

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuTargetRow, setMenuTargetRow] = useState('');
  const [data, setData] = useState([]);
  const [chartLineData, setChartLineData] = useState(null);
  const [filterGroup, setFilterGroup] = useState('');

  const handleSortClick = (value) => {
    setFilterGroup(value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filtered = applySortFilter(data, getComparator(order, orderBy), filterName, filterGroup);

  const isNotFound = !filtered.length && !!filterName;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const handleDeleteClick = (payment) => {
    setMenuTargetRow(payment);
    setIsDialogOpen(true);
  };

  const handleDeleteClick2 = () => {
    setIsDialogOpen2(true);
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };

  const handleCancelClick2 = () => {
    setIsDialogOpen2(false);
  };

  const handleConfirmClick = () => {
    console.log(menuTargetRow && menuTargetRow.id);
    if (menuTargetRow && menuTargetRow.id) {
      onSubmitDeletePayment(menuTargetRow.id);
    }
    setIsDialogOpen(false);
    setMenuTargetRow(null);
  };

  const handleConfirmClick2 = () => {
    onSubmitDeleteMultiplePayments();
    setIsDialogOpen2(false);
  };

  const onSubmitDeletePayment = async (paymentId) => {
    try {
      const response = await deletePayment(paymentId);

      if (response.code === 200) {
        toast.success('Le paiement a été supprimé avec succès.', {
          position: toast.POSITION.TOP_RIGHT,
        });
        const updatedPayments = data.filter((payment) => payment.id !== paymentId);
        setData(updatedPayments);
      } else {
        toast.error(`Error: ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error('Error deleting payment:', response.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const onSubmitDeleteMultiplePayments = async () => {
    try {
      await Promise.all(selected.map((id) => onSubmitDeletePayment(id)));
      await fetchData();
      setSelected([]);
    } catch (error) {
      console.error('Error deleting multiple payments:', error.message);
    }
  };

  /* const handleUpdatePayment = async (paymentId, updatedPaymentData) => {
     try {
       const response = await updatePayment(paymentId, updatedPaymentData);
 
       if (response.code === 200) {
         toast.success('Les données de paiement ont été mises à jour avec succès.', {
           position: toast.POSITION.TOP_RIGHT,
         });
         const updatedPayments = data.map((payment) =>
           payment.id === paymentId ? { ...payment, ...updatedPaymentData } : payment
         );
         setData(updatedPayments);
       } else {
         toast.error(`Error: ${response.message}`, {
           position: toast.POSITION.TOP_RIGHT,
         });
         console.error('Error updating payment:', response.message);
       }
     } catch (error) {
       console.error('Error:', error.message);
     }
   };    */

  const fetchData = async () => {
    try {
      const result = await getStudentsForProgramPayments(idProg);
      if (result.code === 200) {
        const payments = result.payments.map((payment) => ({
          id: payment.ID_ROWID,
          name: `${payment.students.personProfile2.firstName} ${payment.students.personProfile2.lastName}`,
          image:
            payment.students.personProfile2.imagePath !== null &&
              payment.students.personProfile2.imagePath !== ''
              ? `data:image/jpeg;base64,${Buffer.from(
                payment.students.personProfile2.imagePath
              ).toString('base64')}`
              : '',
          paymentDate: payment.createdAt,
          montant: payment.montant,
        }));
        console.log(payments);
        setData(payments);
        // Convert paymentDate to a Date object and filter data for the last few days (e.g., 7 days)
        const aggregatedPayments = {};
        payments.forEach(payment => {
          const date = payment.paymentDate.split('T')[0]; // Extracting date without time
          if (aggregatedPayments[date]) {
            aggregatedPayments[date] += payment.montant;
          } else {
            aggregatedPayments[date] = payment.montant;
          }
        });

        // Transform data to match the format expected by Recharts
        const sortedAggregatedData = Object.keys(aggregatedPayments)
          .map(date => ({
            name: date,
            montant: aggregatedPayments[date]
          }))
          .sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort by date (oldest to latest)

        // Limit data to the latest 10 dates
        const limitedData = sortedAggregatedData.slice(-4);
        setChartLineData(limitedData);
      } else {
        // Handle the case when there's an error with the API response
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      // Handle the error appropriately
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  return (<>
    <div className="col-md-12 col-xl-6 col-12">
      <div className="row">
        <div className="col-md-12 mb-5">
          <div className="card">
            <UserListToolbarP
              title="Liste Des Paiements"
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              onDeleteSelected={() => {
                handleDeleteClick2();
              }}
              isFilterd={false}
              selectList={groups}
              onGroupSelected={(value) => {
                handleSortClick(value);
              }}
            />

            <Scrollbar>
              <TableContainer sx={{ width: "100%", height: 300 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filtered.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, image, group, paymentDate, montant } = row;

                      return (
                        <TableRow hover key={id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.indexOf(id) !== -1}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center">
                              <Avatar alt={name} src={image} style={{ width: '40px', height: '40px', marginRight: '5px' }} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {formatDate(paymentDate)}
                          </TableCell>
                          <TableCell>
                            {montant}       DA                 </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={(e) => {
                              handleOpenMenu(e);
                              setMenuTargetRow(row);
                            }}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filtered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Scrollbar>
          </div>
        </div>
      </div>
    </div>

    <div className="col-md-12 col-xl-6 col-12">
      <div className="card mb-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div style={{ height: "40px", paddingTop: "5px" }}>
            <Typography className="mb-0 " variant="h6">Paiements au cours des jours</Typography>
          </div>
        </div>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center' }}>
          {chartLineData !== null ? (
            <ResponsiveContainer width="100%" height={305}>
              <LineChart
                data={chartLineData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="montant" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </div>
    </div >

    <Popover
      open={Boolean(open)}
      anchorEl={open}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 140,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        },
      }}
    >
      {  /*  <MenuItem onClick={() => { }}>
      <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
      Modifier
</MenuItem> */ }
      <MenuItem
        sx={{ color: 'error.main' }}
        onClick={() => {
          handleDeleteClick(menuTargetRow);
          handleCloseMenu();
        }}
      >
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Supprimer
      </MenuItem>
    </Popover>

    {/* Dialog for deleting one item */}
    <Dialog open={isDialogOpen} onClose={handleCancelClick}>
      <DialogContent>
        <DialogTitle>Êtes-vous sûr de vouloir supprimer cet élément ?</DialogTitle>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} color="primary">
          Annuler
        </Button>
        <Button onClick={handleConfirmClick} color="error">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>

    {/* Dialog for deleting many items */}
    <Dialog open={isDialogOpen2} onClose={handleCancelClick2}>
      <DialogContent>
        <DialogTitle>Êtes-vous sûr de vouloir supprimer ces éléments ?</DialogTitle>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick2} color="primary">
          Annuler
        </Button>
        <Button onClick={handleConfirmClick2} color="error">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
}
export default PaymentComponent;
;