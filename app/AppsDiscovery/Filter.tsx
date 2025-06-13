import { Button, Input, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { type ChangeEvent, useState } from 'react';

interface Props {
    filter: {
        name: string;
        category: string;
    };
    onChange: (filter: { name: string; value: string }) => void;
}

function AppsDiscoveryFilter({ onChange, filter }: Props) {
    const [name, setName] = useState(filter.name);
    const [category, setCategory] = useState(filter.category);

    const setNameFilter = (value: string) => {
        setName(value);
        onChange({ name: 'name', value });
    };
    const setCategoryFilter = (value: string) => {
        setCategory(value);
        onChange({ name: 'category', value });
    };

    return (
        <Stack direction="column" spacing={2} sx={{ textAlign: 'left' }}>
            <Typography variant="h6">Filters</Typography>
            <TextField
                sx={{ width: '100%' }}
                variant="filled"
                label="Filter Name"
                value={name}
                onChange={(e) => setNameFilter(e.target.value)}
            />{' '}
            <TextField
                sx={{ width: '100%' }}
                variant="filled"
                label="Filter Category"
                value={category}
                onChange={(e) => setCategoryFilter(e.target.value)}
            />
        </Stack>
    );
}

export default AppsDiscoveryFilter;
