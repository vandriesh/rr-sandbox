import { Box } from '@mui/system';

import BaseError from '../common/BaseError';
import BaseData from '../Data/BaseData';

import type { Route } from './+types/apps-discovery';

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const pageSize = url.searchParams.get('pageSize') ?? '25';

    const body = {
        appName: '',
        category: '',
        pageNumber: 0,
        pageSize: 50, // hardcode to "simulate" pagination
    };
    const data = await fetch('https://recotest.pythonanywhere.com/api/v1/app-service/get-apps', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    // console.log({data: await data.json()});
    return { data: await data.json() };
}

function AppsDiscovery({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;

    if (data.error) {
        return (
            <Box
                sx={{
                    // bgcolor: '#cfe8fc',
                    height: 'calc(100vh-56px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <BaseError error={data.error} />
            </Box>
        );
    }

    return <BaseData data={data.appRows} />;
}

export default AppsDiscovery;