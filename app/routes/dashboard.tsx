import Data from '~/Data/Data';
import type { Route } from './+types/dashboard';

import { makeData } from './makeData';

export function loader(args: Route.LoaderArgs) {
    return { data: makeData(10000) };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    return <Data data={loaderData.data} />;
}
