import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function SchoolProfilePage() {
  // Supposons que vous ayez un objet "schoolInfo" avec les informations de l'école
  const schoolInfo = {
    schoolName: "Nom de l'école",
    address: "Adresse de l'école",
    phoneNumber: "Numéro de téléphone de l'école",
    website: "Site Web de l'école",
    // Ajoutez d'autres informations de l'école ici
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Profil de l'école
      </Typography>
      <Typography variant="body1">
        <strong>Nom de l'école :</strong> {schoolInfo.schoolName}
      </Typography>
      <Typography variant="body1">
        <strong>Adresse :</strong> {schoolInfo.address}
      </Typography>
      <Typography variant="body1">
        <strong>Numéro de téléphone :</strong> {schoolInfo.phoneNumber}
      </Typography>
      <Typography variant="body1">
        <strong>Site Web :</strong> {schoolInfo.website}
      </Typography>
      {/* Affichez d'autres informations de l'école de la même manière */}
    </Box>
  );
}

export default SchoolProfilePage;
