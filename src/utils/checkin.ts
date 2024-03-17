import { ChatbotKey, Conversation } from '../types/checkin';
import AppleHealthKit, { HealthValue } from 'react-native-health';
// import * as RNLocalize from 'react-native-localize';
// import moment from 'moment-timezone';

// const deviceTimeZone = RNLocalize.getTimeZone();

export const QUESTIONS = {
  init: '',
  greeting: "Hello! How's your day going? Feel free to share how you're feeling!",
  text: "I'm curious about what's on your mind! If you'd rather not share, just type 'skip'.",
  voice: "It's always wonderful to hear your voice! If you're not up for it, type 'skip'.",
  followup:
    "Thanks for sharing! Anything else you'd like to tell me? If not, type 'skip'. If you want to restart on any step, you can type 'restart'",
  studyHours:
    "How much time did you spend on your studies today? Share the hours (e.g., 1, 1.5, 2). If you're skipping, type 'skip'.",
  studyError: 'Please enter only numbers within the range of 0 to 24.',
  workHours:
    "Tell me about your workday! Share the hours (e.g., 1, 1.5, 2). If you're skipping, type 'skip'.",
  workError: 'Please enter only numbers within the range of 0 to 24.',
  stressLevel: "We're almost there! Choose your stress level from the options, please.",
  closing: 'Thanks a lot for your check-in! See you next time!',
  restart: 'Reset previous conversations... Please reshare your feeling',
};

export const getChatbotMessage = (
  step: ChatbotKey,
  idx: number,
  prevText,
): [Conversation, ChatbotKey] => {
  let nextStep = step;
  if (prevText.toLowerCase() === 'restart') {
    nextStep = 'restart';
    return [
      {
        id: nextStep + idx,
        isChatbot: true,
        text: QUESTIONS[nextStep],
      },
      nextStep,
    ];
  }

  switch (step) {
    case 'init':
      nextStep = 'greeting';
      break;

    case 'restart':
    case 'greeting':
      nextStep = prevText === '' ? 'text' : 'voice';
      break;

    case 'text':
    case 'voice':
      nextStep = 'followup';
      break;

    case 'followup':
      nextStep = 'studyHours';
      break;

    case 'studyHours':
    case 'studyError':
      const studyHours = Number(prevText);
      nextStep =
        prevText.toLowerCase() === 'skip' ||
        (!Number.isNaN(studyHours) && studyHours >= 0 && studyHours <= 24)
          ? 'workHours'
          : 'studyError';
      break;

    case 'workHours':
    case 'workError':
      const workHours = Number(prevText);
      nextStep =
        prevText.toLowerCase() === 'skip' ||
        (!Number.isNaN(workHours) && workHours >= 0 && workHours <= 24)
          ? 'stressLevel'
          : 'workError';
      break;

    case 'stressLevel':
      nextStep = 'closing';
      break;

    case 'closing':
      nextStep = 'followup';
      break;

    default:
      break;
  }

  return [
    {
      id: nextStep + idx,
      isChatbot: true,
      text: QUESTIONS[nextStep],
    },
    nextStep,
  ];
};

export const getStepCount = () => {
  let options = {
    date: new Date().toISOString(), // optional; default now
    includeManuallyAdded: true, // optional: default true
  };

  return new Promise((resolve, reject) => {
    AppleHealthKit.getStepCount(options, (err: Object, results: HealthValue) => {
      if (err) {
        reject(err);
      } else {
        console.log(results.value);
        resolve(results.value);
      }
    });
  });
};

export const getSleepHours = () => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();
  let options = {
    startDate: startDateISO, // required
    endDate: endDateISO, // optional; default now
    limit: 10, // optional; default no limit
    ascending: true, // optional; default false
  };

  return new Promise((resolve, reject) => {
    AppleHealthKit.getSleepSamples(options, (err: Object, results: any) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) resolve(null);

        let res = 0;
        for (const result of results) {
          if (result.value === 'ASLEEP' || result.value === 'INBED') {
            const resEndDate = new Date(result.endDate);
            const resStartDate = new Date(result.startDate);
            const differenceInMilliseconds = resEndDate.getTime() - resStartDate.getTime();
            const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
            res += differenceInHours;
          }
        }
        resolve(res);
      }
    });
  });
};
export const getHeartRate = (): Promise<null | number> => {
  // const today = moment().tz(deviceTimeZone);
  // console.log('today', today);
  return new Promise((resolve, reject) => {
    // const endDate = new Date();
    // const now = moment();
    // const startDate = new Date(endDate.getTime() - 12 * 60 * 60 * 1000);
    // const startDateISO = startDate.toISOString();
    // const endDateISO = endDate.toISOString();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();
    let options = {
      // unit: 'bpm', // optional; default 'bpm'
      startDate: startDateISO, // required
      endDate: endDateISO, // optional; default now
      ascending: false, // optional; default false
      limit: 10, // optional; default no limit
    };
    let bpmTotal = 0;
    let totalCnt = 0;
    console.log(options);
    AppleHealthKit.getHeartRateSamples(options, (err: Object, results: Array<HealthValue>) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) resolve(null);
        totalCnt = results.length;
        for (const result of results) {
          bpmTotal += result.value;
        }
        resolve(bpmTotal / totalCnt);
      }
    });
  });
};
