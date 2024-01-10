const DEFAULT_URL =
  process.env?.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://mindful-college-2394382a42bf.herokuapp.com';
export const TEST_URL = `${DEFAULT_URL}/`;
export const SING_IN_URL = `${DEFAULT_URL}/v1/signin`;
export const SING_UP_URL = `${DEFAULT_URL}/v1/signup`;
export const SING_OUT_URL = `${DEFAULT_URL}/v1/signout`;
export const CHECK_IN_URL = `${DEFAULT_URL}/v1/checkin`;
