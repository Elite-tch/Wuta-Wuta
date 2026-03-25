require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

jest.mock('@dripsprotocol/sdk', () => ({
  Drips: jest.fn().mockImplementation(() => ({})),
}), { virtual: true });

jest.mock('@sorobanrpc', () => ({
  SorobanRpc: jest.fn().mockImplementation(() => ({
    sendTransaction: jest.fn(),
    getContractData: jest.fn(),
  })),
}), { virtual: true });

jest.mock('react-router-dom', () => {
  const React = require('react');
  const navigate = jest.fn();

  return {
    BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
    Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useNavigate: () => navigate,
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
  };
}, { virtual: true });
