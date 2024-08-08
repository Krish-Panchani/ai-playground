import { useState } from 'react';

const useQuestion = () => {
    const [question, setQuestion] = useState('');

    return {
        question,
        setQuestion
    };
};

export default useQuestion;