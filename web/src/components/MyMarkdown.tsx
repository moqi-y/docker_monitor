import ReactMarkdown from 'react-markdown';

const MyMarkdown = ({ markdownContent }: { markdownContent: string }) => {
    return (
        <div>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );
};

export default MyMarkdown;