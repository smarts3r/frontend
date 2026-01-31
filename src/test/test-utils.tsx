import { renderHook, RenderHookOptions, RenderResult } from '@testing-library/react';
import { act } from 'react';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { server } from './mock-server';

type WrapperProps = PropsWithChildren;

const AllProviders = ({ children }: WrapperProps) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRenderHook = <T, P>(
  render: (initialProps: P) => T,
  options?: RenderHookOptions<P>
): RenderResult<T, P> => {
  return renderHook(render, {
    wrapper: AllProviders,
    ...options,
  });
};

// MSW setup
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Clean up localStorage after each test
  localStorage.clear();
});
afterAll(() => server.close());

export * from '@testing-library/react';
export { customRenderHook as renderHook };
export { act };