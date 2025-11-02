import React from 'react';
import { ChatMessage as ChatMessageType, Source } from '../types';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ExternalLinkIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface Props {
  message: ChatMessageType;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="message-bubble-user">
          <p className="text-white">{message.message}</p>
          <span className="text-xs text-blue-100 mt-1 block">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="message-bubble-ai">
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
            <span className="text-gray-600">AI is thinking...</span>
          </div>
        ) : (
          <>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown className="text-gray-800">
                {message.response || 'No response available'}
              </ReactMarkdown>
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Sources:</h4>
                <div className="space-y-2">
                  {message.sources.map((source, index) => (
                    <SourceCard key={index} source={source} index={index + 1} />
                  ))}
                </div>
              </div>
            )}
            
            <span className="text-xs text-gray-500 mt-2 block">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

interface SourceCardProps {
  source: Source;
  index: number;
}

const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const getSourceIcon = () => {
    if (source.type === 'document') {
      return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
    }
    return <GlobeAltIcon className="h-4 w-4 text-blue-500" />;
  };

  const getDomainColor = () => {
    const medicalDomains = ['pubmed', 'who.int', 'nih.gov', 'mayoclinic.org', 'nature.com'];
    const isMedical = medicalDomains.some(domain => source.domain.includes(domain));
    return isMedical ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-start space-x-2">
        <span className="flex-shrink-0 text-xs font-bold text-gray-500 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
          {index}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {getSourceIcon()}
            <span className={`text-xs font-medium ${getDomainColor()}`}>
              {source.domain}
            </span>
            {source.type === 'web' && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <h5 className="text-sm font-medium text-gray-900 mb-1 truncate">
            {source.title}
          </h5>
          
          {source.snippet && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {source.snippet}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
