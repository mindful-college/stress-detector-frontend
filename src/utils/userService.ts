import axios from 'axios';

import { CONTACTUS_URL } from '../utils/api';

export const submitContactUsForm = async (
  userToken: string | undefined,
  { email, support_type, message },
) => {
  try {
    const response = await axios.post(
      CONTACTUS_URL,
      {
        email,
        support_type,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting the form:', error);
    throw error;
  }
};
