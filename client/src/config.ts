interface Config {
  apiBaseUrl: string;
  frontendUrl: string;
}

const config: Config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  frontendUrl: process.env.REACT_APP_FRONTEND_URL,
};

export default config; 