import { BrowserRouter} from 'react-router-dom';
import { useEffect } from 'react';

import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
import './global.css';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
// import Home from './site-web/home';

// ----------------------------------------------------------------------

export default function App() {
  useEffect(() => {
    const initialValue = document.body.style.zoom;
    // Change zoom level on mount
    // document.body.style.zoom = "90%";
    // Set the zoom level for all elements except the header
    const bodyElements = document.querySelectorAll('body > *:not(header)');
    bodyElements.forEach((element) => {
      element.style.zoom = '90%'; // Set your desired zoom level here
    });
    // return () => {
    //   // Restore default value
    //   document.body.style.zoom = initialValue;
    // };
  }, []);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />

          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
