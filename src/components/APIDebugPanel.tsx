import { Box, Typography, Collapse, Paper } from '@mui/material';
import { APIDebugInfo } from '../api/client';

interface APIDebugPanelProps {
  show: boolean;
  debugInfo: APIDebugInfo | null;
}

export const APIDebugPanel = ({ show, debugInfo }: APIDebugPanelProps) => {
  if (!debugInfo) return null;

  return (
    <Collapse in={show}>
      <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
        <Typography variant="subtitle2" gutterBottom>API Response Details:</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
            <strong>Endpoint:</strong> {debugInfo.url}<br/>
            <strong>Status:</strong> {debugInfo.status}<br/>
            <strong>Timestamp:</strong> {debugInfo.timestamp}
          </Typography>
        </Box>

        <Typography variant="subtitle2" gutterBottom>Response Headers:</Typography>
        <Box 
          sx={{ 
            mb: 2,
            p: 1,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(debugInfo.headers, null, 2)}
          </pre>
        </Box>

        <Typography variant="subtitle2" gutterBottom>Response Data:</Typography>
        <Box 
          sx={{ 
            p: 1,
            bgcolor: 'grey.900',
            color: 'grey.100',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(debugInfo.responseData, null, 2)}
          </pre>
        </Box>
      </Paper>
    </Collapse>
  );
};