const DEFAULT_URL =
  process.env?.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://mindful-college-2394382a42bf.herokuapp.com';
export const TEST_URL = `${DEFAULT_URL}/`;
export const SING_IN_URL = `${DEFAULT_URL}/v1/signin`;
export const SING_UP_URL = `${DEFAULT_URL}/v1/signup`;
export const SING_OUT_URL = `${DEFAULT_URL}/v1/signout`;
export const USER_INFO_URL = `${DEFAULT_URL}/v1/userinfo`;
export const PERMISSION_URL = `${DEFAULT_URL}/settings/permissions`;
export const CONTACTUS_URL = `${DEFAULT_URL}/settings/contact-us`;
export const DELETE_ACCOUNT_URL = `${DEFAULT_URL}/v1/delete_user`;
export const CHECK_IN_URL = `${DEFAULT_URL}/v1/checkin`;
export const ANALYSIS_WEEKLY = `${DEFAULT_URL}/analyses/data/weekly`;
export const ANALYSIS_MONTHLY = `${DEFAULT_URL}/analyses/data/monthly`;
export const GET_REPORT_DATA_URL = `${DEFAULT_URL}/report/stresslvl`;
export const GET_CHECKIN_DATA_URL = `${DEFAULT_URL}/report/checkin`;
export const GET_USER_DATA_AVERAGE_URL = `${DEFAULT_URL}/v1/average`;
export const REPORT_URL = `${DEFAULT_URL}/v1/report`;
export const ANAYLYSIS_URL = `${DEFAULT_URL}/v1/analyses`;
