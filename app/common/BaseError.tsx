import { Alert, AlertTitle } from '@mui/material';

interface Props {
    error: string;
}

function BaseError({ error }: Props) {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
            <p>
                Refresh the page to try again.
            </p>
        </Alert>
    )
}

export default BaseError;