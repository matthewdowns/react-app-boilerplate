import '@testing-library/jest-dom';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import HelloWorld from './HelloWorld';

let body: RenderResult;

describe('<Footer />', () => {
    beforeEach(() => body = render(<HelloWorld />));

    it('renders and displays "Hello World!"', () => {
        const text = body.getByText('Hello World!');
        expect(text).toBeVisible();
    });
});