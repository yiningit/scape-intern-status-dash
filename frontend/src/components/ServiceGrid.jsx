import Grid from '@mui/material/Grid';
import ServiceCard from './ServiceCard';

export default function ServiceGrid({services, onDelete}) {
    return (
        <Grid container spacing={3}>
            {services.map(s => (
                    <Grid size={{xs: 12, sm: 6, md: 4 }} sx={{ alignItems: 'stretch' }} key={s.service}>
                        <ServiceCard s={s} onDelete={onDelete}/>
                    </Grid>
            ))}
        </Grid>
    )
}