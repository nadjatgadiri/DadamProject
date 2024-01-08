import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './app.css'; // Import the external CSS file
import { Button, Typography, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, Grid, useMediaQuery, useTheme } from '@mui/material';
import { deleteSession } from '../../../RequestManagement/sessionsManagement'

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
  useEffect(() => {
    if (Array.isArray(props.events)) {
      const data = props.events.map(option => {
        return {
          ...option,
          start: new Date(option.start),
          end: new Date(option.end)
        };
      });
      setEvents(data);
      console.log(data);
    }
  }, [props.events]);


  // const [events, setEvents] = useState([
  //   {
  //     id: 1,
  //     title: 'Meeting',
  //     start: new Date(2023, 11, 15, 10, 0),
  //     end: new Date(2023, 11, 15, 12, 0),
  //     groupID: '22'
  //   },
  //   {
  //     id: 3,
  //     title: 'Conference',
  //     start: new Date(2023, 11, 18, 15, 0),
  //     end: new Date(2023, 11, 18, 16, 0),
  //     groupID: '23'
  //   },

  //   {
  //     id: 2,
  //     title: 'Conference',
  //     start: new Date(2023, 11, 18, 14, 0),
  //     end: new Date(2023, 11, 18, 16, 0),
  //     groupID: '22'
  //   },
  // Add more events as needed
  // ]);
  const [selectedView, setSelectedView] = useState('month'); // State to track selected view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const eventStyleGetter = (event, start, end, isSelected) => {
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

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      deleteSession(selectedEvent.id);
      await props.fetchEvents();
      setOpenDialog(false);
      setSelectedEvent(null);
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
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: '15px', marginBottom: '30px' }}>
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
          <Typography variant="h4">
            {toolbar.label}
          </Typography>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {selectedEvent && (
          <>
            <DialogTitle>
              <div>
                {selectedEvent.title}{' '}
                <Typography variant="subtitle1" display="inline" style={{ margin: "20px" }} gutterBottom>
                  {formatDate(selectedEvent.start)}
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent>
              <p>Commencé à {moment(selectedEvent.start).format('HH:mm')} - Fini à {moment(selectedEvent.end).format('HH:mm')}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteEvent} color="error">
                Supprimer
              </Button>
              <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div >
  );
};

export default MyCalendar;


/**
 *  <div className="custom-toolbar" style={{ margin: '30px' }}>
        <div className="toolbar-left">
          <ButtonGroup className="custom-button-group">
            <Button onClick={goToBack}>Back</Button>
            <Button onClick={goToToday}>Today</Button>
            <Button onClick={goToNext}>Next</Button>
          </ButtonGroup>

        </div>
        <div className="toolbar-center">
          <Typography variant="h4">{toolbar.label}</Typography>
        </div>
        <div className="toolbar-right">
          <ButtonGroup className="custom-button-group">
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
      </div>
 */