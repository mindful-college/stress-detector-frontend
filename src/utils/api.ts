const DEFAULT_URL = !process.env.NODE_ENV || process.env.NODE_ENV ? 'http://127.0.0.1:8000' : '';
export const TEST_URL = `${DEFAULT_URL}/`;
export const SING_IN_URL = `${DEFAULT_URL}/v1/signin`;
export const SING_UP_URL = `${DEFAULT_URL}/v1/signup`;
