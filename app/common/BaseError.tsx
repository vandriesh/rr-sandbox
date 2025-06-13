import { Alert, AlertTitle } from '@mui/material';

interface Props {
    error: string;
}

function BaseError({ error }: Props) {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error Alert with a scary title.
        </Alert>
    )
}