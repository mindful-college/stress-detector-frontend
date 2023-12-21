import { ChatbotKey, Conversation } from "../types/checkin"

export const QUESTIONS = {
    'init': '',
    'greeting': "Hey there! How's your day going? Feel free to share how you're feeling!",
    'text': "I'd love to see what's on your mind! If you'd rather not share, just type 'skip'.",
    'voice': "It's always nice to hear your voice! If you're not up for it, type 'skip'.",
    'followup' : "Thanks for sharing! Anything you want to share more? If there is nothing, type 'skip'",
    'study_hours': "How much did you dive into your studies today? Share in numbers (e.g., 1, 1.5, 2). If you're skipping, just type 'skip'.",
    'studyError': "Please put only numbers",
    'work_hours': "Tell me about your work grind! Share the hours in numbers (e.g., 1, 1.5, 2). If you're skipping, type 'skip'.",
    'workError': "Please put only numbers",
    'stress_level': "We're almost there! Pick your stress level from the options, please.",
    'closing': "Thanks a bunch for your check-in! Catch you later!",
}


export const getChatbotMessage = (step: ChatbotKey, idx: number, prevText, voice = null): [Conversation, ChatbotKey] => {
    let nextStep = step;

    switch (step) {
        case 'init':
            nextStep = 'greeting'; 
            break;
    
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
            nextStep = prevText.toLowerCase() === 'skip' || Number(prevText) ? 'work_hours' : 'studyError';
            break;
    
        case 'work_hours':
        case 'workError':
            nextStep = prevText.toLowerCase() === 'skip' || Number(prevText) ? 'stress_level' : 'workError';
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
