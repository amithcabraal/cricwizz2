import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LiveMatchesList } from './components/LiveMatchesList';
import { MatchDetails } from './components/MatchDetails';

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Router>
            <Routes>
              <Route path="/" element={<LiveMatchesList />} />
              <Route path="/match/:id" element={<MatchDetails />} />
            </Routes>
          </Router>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;