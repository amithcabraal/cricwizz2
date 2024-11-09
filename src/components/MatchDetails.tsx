import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMatchDetails, getLastAPIResponse } from '../api/client';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Grid,
  Alert,
  AlertTitle,
  CircularProgress,
  Box,
  Button,
  Collapse
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';
import { APIDebugPanel } from './APIDebugPanel';

export const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  
  const queryOptions: UseQueryOptions<Match, Error> = {
    queryKey: ['match', id],
    queryFn: () => fetchMatchDetails(Number(id)),
    refetchInterval: 30000,
    retry: 3,
    enabled: !!id
  };

  const { data: match, isLoading, error } = useQuery(queryOptions);

  const curlCommand = `curl -X GET "https://cricket.sportmonks.com/api/v2.0/fixtures/${id}?api_token=${import.meta.env.VITE_API_KEY}&include=localteam,visitorteam,batting,bowling,scoreboards,balls"`;

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
            <>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setShowDebug(!showDebug)}
                sx={{ mr: 1 }}
              >
                {showDebug ? 'HIDE DEBUG' : 'SHOW DEBUG'}
              </Button>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/')}
              >
                BACK TO LIST
              </Button>
            </>
          }
        >
          <AlertTitle>API Error</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {error.message}
          </Typography>
          <Collapse in={showDebug}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Debug Information:</Typography>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                Match ID: {id}<br/>
                API Key Present: {Boolean(import.meta.env.VITE_API_KEY).toString()}<br/>
                Endpoint: cricket.sportmonks.com/api/v2.0/fixtures/{id}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>Test using curl:</Typography>
              <Typography 
                variant="caption" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-all',
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  p: 1,
                  borderRadius: 1
                }}
              >
                {curlCommand}
              </Typography>
            </Box>
          </Collapse>
        </Alert>
        <APIDebugPanel show={showDebug} debugInfo={getLastAPIResponse()} />
      </>
    );
  }

  if (!match) {
    return (
      <Alert 
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => navigate('/')}>
            BACK TO LIST
          </Button>
        }
      >
        Match not found
      </Alert>
    );
  }

  const prepareChartData = (): OverData[] => {
    if (!match.balls?.length) return [];
    
    const overData: Record<number, OverData> = {};
    match.balls.forEach((ball: Ball) => {
      const over = Math.floor(ball.ball);
      if (!overData[over]) {
        overData[over] = { over, runs: 0, balls: [] };
      }
      overData[over].runs += ball.score;
      overData[over].balls.push(ball.score);
    });

    return Object.values(overData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Button 
            size="small"
            onClick={() => setShowDebug(!showDebug)}
            sx={{ mb: 1 }}
          >
            {showDebug ? 'Hide API Debug Info' : 'Show API Debug Info'}
          </Button>
          <APIDebugPanel show={showDebug} debugInfo={getLastAPIResponse()} />
        </Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            {match.localteam.name} vs {match.visitorteam.name}
          </Typography>
          {match.status && (
            <Typography variant="subtitle1" color="text.secondary">
              Status: {match.status}
            </Typography>
          )}
          <Typography variant="h6">
            Current Score: {match.runs ?? 0}/{match.wickets ?? 0}
          </Typography>
        </Paper>
      </Grid>

      {match.batting && match.batting.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Batting Scorecard</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Batsman</TableCell>
                    <TableCell align="right">Runs</TableCell>
                    <TableCell align="right">Balls</TableCell>
                    <TableCell align="right">4s</TableCell>
                    <TableCell align="right">6s</TableCell>
                    <TableCell align="right">SR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {match.batting.map((bat: BattingScore) => (
                    <TableRow key={bat.player_id}>
                      <TableCell>{bat.batsman.fullname}</TableCell>
                      <TableCell align="right">{bat.score}</TableCell>
                      <TableCell align="right">{bat.ball}</TableCell>
                      <TableCell align="right">{bat.four_x}</TableCell>
                      <TableCell align="right">{bat.six_x}</TableCell>
                      <TableCell align="right">{bat.rate.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      )}

      {match.balls && match.balls.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Over by Over Analysis</Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={prepareChartData()}>
                  <XAxis dataKey="over" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="runs" fill="#8884d8" name="Runs" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};