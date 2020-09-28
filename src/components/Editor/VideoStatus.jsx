import React from 'react';

import Step from '@material-ui/core/Step';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';

export default function VideoStatus({ status }) {
  function getSteps() {
    return ['uploaded', 'segmenting', 'processing', 'completed'];
  }

  return (
    <Paper style={{ marginBottom: '8px' }}>
      <Stepper activeStep={getSteps().indexOf(status)}>
        {getSteps().map((label) => {
          label = `${label.charAt(0).toUpperCase()}${label.substring(1)}`;
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
}
