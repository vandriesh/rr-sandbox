import Grid from '@mui/material/Grid';

import BaseError from '../common/BaseError';
import BaseData from '~/AppsDiscovery/BaseData';

import type { Route } from './+types/apps-discovery';
import AppsDiscoveryFilter from '~/AppsDiscovery/Filter';
import { useState } from 'react';

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const pageSize = url.searchParams.get('pageSize') ?? '25';
    const pageNumber = url.searchParams.get('pageNumber') ?? '0';

    const body = {
        appName: '',
        category: '',
        pageNumber: +pageNumber,
        pageSize:+pageSize, // hardcode to "simulate" pagination
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
    const [filter, setFilter] = useState({
        name: '',
        category: '',
    });

    if (data.error) {
        return <BaseError error={data.error} />;
    }

    const updateFilter = (filter: { name: string; value: string }) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                [filter.name]: filter.value,
            };
        });
    };

    const { name, category } = filter;

    const filteredData = data.appRows.filter((row) => {
        if (name && row.appName.toLowerCase().indexOf(name.toLowerCase()) === -1) {
            return false;
        }

        if (category && row.category.toLowerCase().indexOf(category.toLowerCase()) === -1) {
            return false;
        }

        return true;
    });


    return (
        <Grid container spacing={3}>
{/*
            [filter : {JSON.stringify(filter)}
*/}
            <Grid size={10}>
                <BaseData data={filteredData} totalCount={data.totalCount}/>
            </Grid>
            <Grid size="grow">
                <AppsDiscoveryFilter filter={filter} onChange={updateFilter} />
            </Grid>
        </Grid>
    );
}

export default AppsDiscovery;
