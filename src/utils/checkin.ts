import { ChatbotKey, Conversation } from "../types/checkin"

export const QUESTIONS = {
    'init': "",
    'greeting': "Hello! How's your day going? Feel free to share how you're feeling!",
    'text': "I'm curious about what's on your mind! If you'd rather not share, just type 'skip'.",
    'voice': "It's always wonderful to hear your voice! If you're not up for it, type 'skip'.",
    'followup': "Thanks for sharing! Anything else you'd like to tell me? If not, type 'skip'. If you want to restart on any step, you can type 'restart'",
    'study_hours': "How much time did you spend on your studies today? Share the hours (e.g., 1, 1.5, 2). If you're skipping, type 'skip'.",
    'studyError': "Please enter only numbers within the range of 0 to 24.",
    'work_hours': "Tell me about your workday! Share the hours (e.g., 1, 1.5, 2). If you're skipping, type 'skip'.",
    'workError': "Please enter only numbers within the range of 0 to 24.",
    'stress_level': "We're almost there! Choose your stress level from the options, please.",
    'closing': "Thanks a lot for your check-in! See you next time!",
    'restart': "Reset previous conversations... Please reshare your feeling"
};

export const getChatbotMessage = (step: ChatbotKey, idx: number, prevText, voice = null): [Conversation, ChatbotKey] => {
    let nextStep = step;
    if(prevText.toLowerCase() === 'restart') {
        nextStep = 'restart';
        return [
            {
                id: nextStep + idx,
                isChatbot: true,
                text: QUESTIONS[nextStep],
            }, 
            nextStep
        ]
    }

    switch (step) {
        case 'init':
            nextStep = 'greeting'; 
            break;
    
        case 'restart':
        case 'greeting':
            nextStep =  voice ? 'text' : 'voice';        
            break;
    
        case 'text':
        case 'voice':
            nextStep = 'followup';
            break;
    
        case 'followup':
            nextStep = 'study_hours';
            break;
    
        case 'study_hours':
        case 'studyError':
            const studyHours = Number(prevText);
            nextStep = prevText.toLowerCase() === 'skip' || 
                        (!Number.isNaN(studyHours) && studyHours >= 0 && studyHours <= 24) 
                        ? 'work_hours' : 'studyError';
            break;
    
        case 'work_hours':
        case 'workError':
            const workHours = Number(prevText);
            nextStep = prevText.toLowerCase() === 'skip' || 
                        (!Number.isNaN(workHours) && workHours >= 0 && workHours <= 24)  
                        ? 'stress_level' : 'workError';
            break;
    
        case 'stress_level':
            nextStep = 'closing';
            break;
    
        case 'closing':
            nextStep ='followup';
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
        nextStep
    ]
}
