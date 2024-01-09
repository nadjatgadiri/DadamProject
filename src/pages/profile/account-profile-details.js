import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from '@mui/material';


export const AccountProfileDetails = () => {
  const [values, setValues] = useState({
    nom: 'DADAM School',
    description: "Ets d'enseignement et de formation",
    email: 'dadam@gmail.com',
    adresse: 'Tlemcen',
    phone: '0712345678',
    fax: '042346789',
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Modifier les informations" sx={{ mb: 2 }} />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom de l'école"
                  name="nom"
                  onChange={handleChange}
                  required
                  value={values.nom}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  required
                  value={values.description}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Addresse Email "
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Fax" name="fax" onChange={handleChange} type="number" value={values.fax} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Adresse"
                  name="adresse"
                  onChange={handleChange}
                  required
                  value={values.adresse}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
};
