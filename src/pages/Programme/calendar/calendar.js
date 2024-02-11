import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import './app.css'; // Import the external CSS file
import {
  Button,
  Typography,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useMediaQuery,
  useTheme,
  TextField,
  InputLabel,
  Box,
  Container,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { deleteSession, updateSession } from '../../../RequestManagement/sessionsManagement';

const localizer = momentLocalizer(moment);
// convert date
function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}
const MyCalendar = (props) => {
  const { colorMap } = props;
  const [events, setEvents] = useState([]);
  const [selectedView, setSelectedView] = useState('month'); // State to track selected view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (Array.isArray(props.events)) {
      const data = props.events.map((option) => {
        return {
          ...option,
          start: new Date(option.start),
          end: new Date(option.end),
        };
      });
      setEvents(data);
    }
  }, [props.events]);

  const onSubmitUpdate = async (e) => {
    e.preventDefault(); // Prevents the default behavior of form submission

    // Additional logic to handle form submission
    try {
      const response = await updateSession(updatedData);
      if (response && response.code === 200) {
        toast.success(`La séance est modifier avec succès!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Optionally reset form fields here
        await props.fetchEvents();
        // Close the dialog or perform any other actions
        setOpenDialog(false);
        setUpdateMode(false);
        setError('');
      } else if (response && response.code === 401) {
        setError("À cette période et à cette heure, il n'y a pas de salles disponibles.");
      } else {
        toast.error(`Erreur! + ${response.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Erreur! Une erreur s'est produite. Veuillez réessayer.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: colorMap[event.groupID],
        color: 'white',
      },
    };
  };
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };
  const handleUpdateEventSelect = (event) => {
    setUpdateMode(true);
    setUpdatedData({
      eventID: event.id,
      date: new Date(event.start).toISOString().split('T')[0],
      startAt: moment(event.start).format('HH:mm'),
      endAt: moment(event.end).format('HH:mm'),
      isSessionInClass: false,
    });
  };
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const result = await deleteSession(selectedEvent.id);
      if (result.code === 200) {
        toast.success(`La séance a été annulée avec succès!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        await props.fetchEvents();
        setOpenDialog(false);
        setSelectedEvent(null);
      } else {
        toast.error(`Erreur! + ${result.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: '15px', marginBottom: '30px' }}
      >
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup className="custom-button-group" fullWidth={!isSmallScreen}>
              <Button onClick={goToBack}>Back</Button>
              <Button onClick={goToToday}>Today</Button>
              <Button onClick={goToNext}>Next</Button>
            </ButtonGroup>
          </div>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4} xl={4} style={{ textAlign: 'center' }}>
          <Typography variant="h4">{toolbar.label}</Typography>
        </Grid>

        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup className="custom-button-group" fullWidth={!isSmallScreen}>
              <Button
                onClick={() => {
                  handleViewChange('month');
                  toolbar.onView('month');
                }}
                className={selectedView === 'month' ? 'selected' : ''}
              >
                Month
              </Button>
              <Button
                onClick={() => {
                  handleViewChange('week');
                  toolbar.onView('week');
                }}
                className={selectedView === 'week' ? 'selected' : ''}
              >
                Week
              </Button>
              <Button
                onClick={() => {
                  handleViewChange('day');
                  toolbar.onView('day');
                }}
                className={selectedView === 'day' ? 'selected' : ''}
              >
                Day
              </Button>
            </ButtonGroup>
          </div>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container className="app-content-area">
      <div style={{ height: '650px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventSelect} // Event selection handler
          eventPropGetter={eventStyleGetter} // Set event styles using eventStyleGetter
          components={{
            toolbar: CustomToolbar,
          }}
        />
        {/* Dialog to show event details and delete option */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setUpdateMode(false);
          }}
        >
          {selectedEvent && (
            <>
              <DialogTitle>
                <div>
                  {selectedEvent.title}{' '}
                  <Typography
                    variant="subtitle1"
                    display="inline"
                    style={{ margin: '20px' }}
                    gutterBottom
                  >
                    {formatDate(selectedEvent.start)}
                  </Typography>
                </div>
              </DialogTitle>
              <DialogContent>
                <p>
                  Commencé à {moment(selectedEvent.start).format('HH:mm')} - Fini à{' '}
                  {moment(selectedEvent.end).format('HH:mm')}
                </p>
                {updateMode && (
                  <DialogContent>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                      <form onSubmit={onSubmitUpdate}>
                        <Grid item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <InputLabel htmlFor="role">Le Jour</InputLabel>
                          <TextField
                            type="date"
                            value={updatedData?.date}
                            onChange={(e) => {
                              setUpdatedData({
                                ...updatedData,
                                date: e.target.value,
                              });
                            }}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <InputLabel htmlFor="role">Débuté à </InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['MobileTimePicker']}>
                              <MobileTimePicker
                                value={dayjs(`2023-01-01T${updatedData.startAt}:00`)}
                                onChange={(newTime) => {
                                  setUpdatedData({
                                    ...updatedData,
                                    startAt: newTime.format('HH:mm'),
                                  });
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <InputLabel htmlFor="role">Débuté à </InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['MobileTimePicker']}>
                              <MobileTimePicker
                                value={dayjs(`2023-01-01T${updatedData.endAt}:00`)}
                                onChange={(newTime) => {
                                  setUpdatedData({
                                    ...updatedData,
                                    endAt: newTime.format('HH:mm'),
                                  });
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={updatedData.isSessionInClass}
                                  onChange={() => {
                                    setUpdatedData({
                                      ...updatedData,
                                      isSessionInClass: !updatedData.isSessionInClass,
                                    });
                                  }}
                                />
                              }
                              label="Planifier des sessions dans les salles"
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <Typography variant="body2" color="error">
                            {error}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ alignItems: 'center', paddingTop: '10px' }}>
                          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                            <Button
                              type="submit"
                              variant="contained"
                              style={{ backgroundColor: 'blue', color: 'white' }}
                            >
                              Modifier
                            </Button>
                          </Box>
                        </Grid>
                      </form>
                    </Grid>
                  </DialogContent>
                )}
              </DialogContent>
              <DialogActions>
                {!updateMode ? (
                  <>
                    <Button onClick={handleDeleteEvent} color="error">
                      Supprimer
                    </Button>
                    <Button onClick={() => handleUpdateEventSelect(selectedEvent)}>modifier</Button>
                    <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setUpdateMode(false)}>Annuler</Button>
                  </>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </div>
    </Container>
  );
};

export default MyCalendar;
