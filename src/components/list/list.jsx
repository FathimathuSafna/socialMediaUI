import * as React from 'react';
import { Avatar, Box, Button, Card, CardContent, CardActions, Typography } from '@mui/joy';
import Grid from '@mui/material/Grid2';

export default function BottomActionsCard() {
  return (
    <Card
      variant="outlined"
      sx={{
        width: 300,
        height:30,
        resize: 'vertical',
        border:0
      }}
    >
        <Grid container alignItems="center" spacing={4} >
          <Grid item>
            <Avatar src="/static/images/avatar/1.jpg"  />
          </Grid>
          <Grid item xs>
            <Typography level="title">NYC Coders</Typography>
          </Grid>
          <Grid item xs>
            <Button variant="solid" color="primary">
              follow
            </Button>
          </Grid>
        </Grid>
     
    </Card>
  );
}