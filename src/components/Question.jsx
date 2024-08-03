import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Question = ({ question, loadingQuestion }) => (
    <div>
        {question && (
            <div className='flex flex-col md:flex-row px-8 items-center py-2 rounded-xl'>
                {/* <h2 className='text-xl'>AI Generated Que: </h2> */}
                <p className='text-xl sm:text-3xl font-semibold px-2 underline underline-offset-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'><ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown></p>

            </div>
        )}
        {loadingQuestion && <div className="h-1 w-60 mb-4 bg-gradient-to-r from-cyan-400 to-green-500 mx-auto rounded-full animate-gradient-animate z-50"></div>}
    </div>
);

export default Question;