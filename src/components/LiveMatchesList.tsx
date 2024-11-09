import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches, getLastAPIResponse } from '../api/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  AlertTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { APIDebugPanel } from './APIDebugPanel';

export const LiveMatchesList = () => {
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  
  const queryOptions: UseQueryOptions<Match[], Error> = {
    queryKey: ['liveMatches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
    retry: 3
  };

  const { data: matches = [], isLoading, error } = useQuery(queryOptions);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'HIDE DEBUG' : 'SHOW DEBUG'}
            </Button>
          }
        >
          <AlertTitle>API Error</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {error.message}
          </Typography>
        </Alert>
        <APIDebugPanel show={showDebug} debugInfo={getLastAPIResponse()} />
      </>
    );
  }

  if (!matches.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No live matches available at the moment
        </Typography>
        <Button 
          size="small"
          onClick={() => setShowDebug(!showDebug)}
          sx={{ mt: 2 }}
        >
          {showDebug ? 'Hide API Debug Info' : 'Show API Debug Info'}
        </Button>
        <APIDebugPanel show={showDebug} debugInfo={getLastAPIResponse()} />
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button 
          size="small"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide API Debug Info' : 'Show API Debug Info'}
        </Button>
        <APIDebugPanel show={showDebug} debugInfo={getLastAPIResponse()} />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teams</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match: Match) => (
              <TableRow key={match.id}>
                <TableCell>
                  {match.localteam.name} vs {match.visitorteam.name}
                </TableCell>
                <TableCell>{match.venue?.name || 'TBD'}</TableCell>
                <TableCell>{match.status}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};