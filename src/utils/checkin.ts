import { ChatbotKey, Conversation } from '../types/checkin';
import AppleHealthKit, { HealthValue } from 'react-native-health';
// import * as RNLocalize from 'react-native-localize';
// import moment from 'moment-timezone';

// const deviceTimeZone = RNLocalize.getTimeZone();

export const QUESTIONS = {
  init: '',
  greeting:
    'Hello! How was your day? Please share the details of your day to help predict your stress level',
  followup:
    'Thanks for sharing! Feel free to tell me more :) Please type "done" when you want to close the conversation',
  closing:
    'Thanks for your check-in! See you next time! If you want to start again, please type "restart"',
  restart: 'Reset previous conversations... Please share your day again :)',
  stressLevel: '',
  // text: "I'm curious about what's on your mind! If you'd rather not share, just type 'skip'.",
  // voice: "It's always wonderful to hear your voice! If you're not up for it, type 'skip'.",
};

export const getChatbotMessage = (
  step: ChatbotKey,
  idx: number,
  prevText,
): [Conversation | null, ChatbotKey] => {
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

  if (prevText.toLowerCase() === 'done') {
    nextStep = 'stressLevel';
    return [null, nextStep];
  }
  switch (step) {
    case 'init':
      nextStep = 'greeting';
      break;

    case 'restart':
    case 'greeting':
      nextStep = 'followup';
      // nextStep = prevText === '' ? 'text' : 'voice';
      break;

    // case 'text':
    // case 'voice':
    //   nextStep = 'continue';
    //   break;

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
        resolve(results.value);
      }
    });
  });
};

export const getSleepHours = () => {
  // get sleep hours within 24 hours
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
  return new Promise((resolve, reject) => {
    // get heart rate within 24 hours
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();
    let options = {
      startDate: startDateISO, // required
      endDate: endDateISO, // optional; default now
      ascending: false, // optional; default false
      limit: 10, // optional; default no limit
    };
    let bpmTotal = 0;
    let totalCnt = 0;
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
