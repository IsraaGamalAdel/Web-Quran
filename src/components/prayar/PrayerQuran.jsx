import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PrayerQuran({namePrayer, timePrayer ,imgPrayer}) {
return <>
    <Card sx={{width: "18vw" }}>
        <CardMedia component="img" alt="green iguana" height="140" image={imgPrayer} />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">{namePrayer}</Typography>
        <Typography variant="h2" sx={{ color: 'text.secondary' }}>{timePrayer}</Typography>
        </CardContent>
    </Card>
</>
}
