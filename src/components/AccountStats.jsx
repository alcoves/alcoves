import { Typography, } from '@material-ui/core';
import React from 'react';

function StatCard({ title, value }) {
  return (
    <Typography variant='subtitle1'>{`${title} : ${value}`}</Typography>
  );
}

export default function AccountStats({ totalViews, totalVideos }) {
  return (
    <div>
      {totalViews && <StatCard title='Total Views' value={totalViews} />}
      {totalVideos && <StatCard title='Total Videos' value={totalVideos} />}
    </div>
  );
}