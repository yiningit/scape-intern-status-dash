import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';
import DeleteIcon from '@mui/icons-material/Delete';

const STATE_ICON_MAP = {
    up: {
        icon: <CheckCircleRoundedIcon />,
        colour: 'success.main',
    },
    warn: {
        icon: <ReportRoundedIcon />,
        colour: 'fail.main',
    },
    error: {
        icon: <HelpCenterRoundedIcon />,
        colour: 'unknown.main',
    }
}

// Icon lookup map
function StateAvatar ({state}) {
    const config = STATE_ICON_MAP[state] ?? STATE_ICON_MAP['error']
    return (
        <Avatar sx={{ bgcolor: config.colour }}>
            {config.icon}
        </Avatar>
    )
}

export default function ServiceCard({s, onDelete}) {
    return (
        <Card sx={{ width: '100%', height: '100%' }}>
            <CardContent>
                <Stack spacing={1} >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{s.service}</Typography>
                        </Box>
                        <Box>
                            <StateAvatar state={s.state} />
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">{s.status}</Typography>
                        </Box>

                        <Box>
                            <IconButton onClick={() => onDelete(s.service)} aria-label="delete" color="primary">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Stack>


                </Stack>
            </CardContent>
        </Card>
    )
}