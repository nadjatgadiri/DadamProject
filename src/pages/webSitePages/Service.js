import React from 'react';
import { Grid, Box } from '@mui/material';

function ServicesSection() {
    return (
        <>
            <div className="untree_co-section services" id="Services">
                <div className="container">
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={12} md={12} data-aos="flip-up" data-aos-delay={0}>
                            <h2 className="line-bottom text-center mb-4">Découvrez nos Services Exceptionnels</h2>
                            <p>
                                Explorez la richesse de nos services académiques, activités stimulantes et soutien
                                complet pour une expérience éducative exceptionnelle.
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Programmes académiques</h3>
                                <p>
                                    une base solide dans les matières fondamentales telles que les mathématiques, les
                                    sciences et les langues
                                </p>
                            </Box>
                        </Grid>
                        {/* Other Grid items for different features */}
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Formation supplémentaire</h3>
                                <p>
                                    Nos cours de préparation aux examens et notre programme de tutorat individualisé
                                    visent à soutenir chaque étudiant dans sa réussite académique.
                                </p>
                            </Box>
                        </Grid>
                        {/* Add Grid items for other content similarly */}
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Activités parascolaires </h3>
                                <p>
                                    Rejoignez nos clubs de lecture dynamiques, explorez nos événements culturels
                                    captivants et engagez-vous dans nos activités sportives.
                                </p>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Projets Spéciaux et Voyages D'études</h3>
                                <p>
                                    Participez à nos projets spéciaux et à nos voyages d'études captivants, qui
                                    offrent aux élèves des opportunités uniques d'apprentissage expérientiel.
                                </p>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Développement Personnel</h3>
                                <p>
                                    En dehors des programmes académiques, nous offrons des ateliers visant à
                                    développer les compétences sociales et civiques.
                                </p>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4} data-aos="flip-up" data-aos-delay={100}>
                            <Box
                                className="feature"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <h3>Apprentissage à distance</h3>
                                <p>
                                    Proposant des cours en ligne et des options d'apprentissage à distance pour permettre une flexibilité accrue et une accessibilité optimale à nos programmes éducatifs.
                                </p>
                            </Box>
                        </Grid>
                    </Grid>
                </div>{' '}
                {/* /.container */}
            </div>{' '}
            {/* /.untree_co-section */}
        </>
    );
}

export default ServicesSection;