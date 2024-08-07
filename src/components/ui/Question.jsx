import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Question = ({ question }) => (
    <div>
        {question && (
            <div className='flex flex-col md:flex-row px-2 sm:px-8 items-center py-2 rounded-xl'>
                <h3 className='text-xl sm:text-3xl font-semibold text-center px-2 underline underline-offset-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'><ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown></h3>

            </div>
        )}
        
    </div>
);

export default Question;