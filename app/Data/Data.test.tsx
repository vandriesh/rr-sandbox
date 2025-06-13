import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest'
import { makeData } from '../routes/makeData.js';
import Data from './Data'

const mockData = makeData(3)

test('check render Data', () => {
    const {container} = render(<Data data={mockData}/>)

    const table = screen.getByTestId('data-table');
    screen.debug(table)

    expect(table).toHaveTextContent('qwe')

})