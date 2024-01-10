import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
// @mui
import { Buffer } from "buffer";
import { Grid, Container, Typography, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
// sections
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';
import MyCalendar from './Programme/calendar/calendar'
import { getStatistiqueDataForDashbaord1 } from "../RequestManagement/dataManagment"
import { getGroups } from "../RequestManagement/groupManagement"
import { getAllSessions } from "../RequestManagement/sessionsManagement"
import { getUser } from '../RequestManagement/userManagement'
import { getGeneralSchoolData } from '../RequestManagement/schoolManagement'; // Update the import paths
import useResponsive from '../hooks/useResponsive';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const isDesktop = useResponsive('up', 'sm');
  const [dataStatistique, setDataStatistique] = useState({
    "nmbStudents": 0,
    "nmbTeachers": 0,
    "nmbPrograms": 0,
    "nmbClasses": 0
  });
  const [userData, setUserData] = useState('');
  const [schoolData, setSchoolData] = useState('');
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  /** api */
  const fetchData = async () => {
    const result = await getStatistiqueDataForDashbaord1();
    if (result.code === 200) {
      setDataStatistique(result.staticData);
    }
    const result2 = await getGroups();
    if (result2.code === 200) {
      const data = await result2.groups.map(group => ({
        id: group.ID_ROWID,
        name: group.GroupeName
      }));
      setGroups(ColorGenerator(data));
    }
    const result3 = await getAllSessions();
    if (result3.code === 200) {
      setEvents(result3.events);
    }
    // user Data 
    const usersData1 = await getUser(Cookies.get('userID'));
    const usersData = usersData1.userData;
    const image = usersData.personProfile.imagePath !== null && usersData.personProfile.imagePath !== '' ?
      `data:image/jpeg;base64,${Buffer.from(
        usersData.personProfile.imagePath).toString("base64")}` : '../../../../assets/images/avatars/avatar_10.jpg';
    const user = {
      id: usersData.ID_ROWID,
      name: `${usersData.personProfile.firstName} ${usersData.personProfile.lastName}`,
      phone: usersData.personProfile.phoneNumber,
      email: usersData.personProfile.mail,
      status: usersData.isConnected,
      role: usersData.role,
      dateOfBirth: usersData.personProfile.dateOfBirth,
      image, // shorthand notation for image: image
    };
    console.log(user);
    setUserData(user); // Putting user in an array, assuming setUserData expects an array
    // school 

    const dataSchool = await getGeneralSchoolData();
    const school = {
      name: dataSchool.data.name || '',
      email: dataSchool.data.contacts?.mail || '',
      phone: dataSchool.data.contacts?.phone || '',
      logo: dataSchool.data.logo || ''
    }
    setSchoolData(school);
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once when component mounts
  const stringToColor = (name) => {
    const hashCode = name.toString().split('').reduce((acc, char) => {
      acc = (acc * 31) + char.charCodeAt(0) + 100;
      return acc;
    }, 0);
    const color = `#${((hashCode & 0xffffff) << 0).toString(16).padStart(6, '0')}`; // eslint-disable-line no-bitwise
    return color;
  };

  const ColorGenerator = (data) => {
    const colors = {};

    data?.forEach((option) => {
      colors[option.id] = stringToColor(`${option.name}${option.id}`);
    });
    return colors;
  };
  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenue
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>

            <AppWidgetSummary title="Étudiants" total={dataStatistique.nmbStudents} icon={'ph:student-fill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Professeurs" total={dataStatistique.nmbTeachers} color="info" icon={'ph:chalkboard-teacher-fill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Programmes" total={dataStatistique.nmbPrograms} color="warning" icon={'solar:programming-bold'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Salles" total={dataStatistique.nmbClasses} color="error" icon={'mdi:dining-room'} />
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <div className="card">
              {/* <!-- card body --> */}
              <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                {/* <!-- card title --> */}
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={userData?.image} alt={userData?.name}
                        className="avatar-xl mr-3" // Increase size with the class
                      />

                    </ListItemAvatar>
                    <ListItemText style={{ paddingLeft: '16px' }} primary={<Typography variant="h5">{userData.name}</Typography>}
                      secondary={<Typography variant="body1">{userData.role}</Typography>} />
                  </ListItem>
                  <Divider component="li" style={{ marginBottom: "10px" }} />
                  <ListItem>
                    <ListItemText primary={<Typography variant="subtitle2">Téléphone</Typography>}
                      secondary={<Typography variant="body1">{userData?.phone}</Typography>} />
                    <ListItemText style={{ paddingLeft: '10px' }} primary={<Typography variant="subtitle2">Mail</Typography>}
                      secondary={<Typography variant="body1">{userData?.email}</Typography>} />

                    <ListItemText style={{ paddingLeft: '10px' }} primary={<Typography variant="subtitle2">Date De Naissance</Typography>}
                      secondary={<Typography variant="body1">{userData?.dateOfBirth}</Typography>} />
                  </ListItem>
                </List>

              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <div className="card">
              {/* <!-- card body --> */}
              <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                {/* <!-- card title --> */}
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <img
                        src={schoolData.logo}
                        alt="logo"
                        width={100}
                        height={79}
                      // Increase size with the class
                      />

                    </ListItemAvatar>
                    <ListItemText style={{ paddingLeft: '16px' }} primary={<Typography variant="h5">École : {schoolData.name}</Typography>} />
                  </ListItem>
                  <Divider component="li" style={{ marginBottom: "10px" }} />
                  <ListItem>
                    <ListItemText primary={<Typography variant="subtitle2">Téléphone</Typography>}
                      secondary={<Typography variant="body1">{schoolData.phone}</Typography>} />
                    <ListItemText style={{ paddingLeft: '10px' }} primary={<Typography variant="subtitle2">Mail</Typography>}
                      secondary={<Typography variant="body1">{schoolData.email}</Typography>} />

                  </ListItem>
                </List>

              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card style={{ height: isDesktop ? '650px' : '750px' }}>
              <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <MyCalendar colorMap={groups} events={events} fetchEvents={fetchData} />
              </div>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container >
    </>
  );
}
