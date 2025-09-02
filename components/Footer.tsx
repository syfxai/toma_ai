import React from 'react';
import MailIcon from './icons/MailIcon';
import type { UiText } from '../types';

interface FooterProps {
  uiText: Pick<UiText, 'feedbackButton' | 'feedbackSubject'>;
}

const Footer: React.FC<FooterProps> = ({ uiText }) => {
  const mailtoHref = `mailto:syfx.design@gmail.com?subject=${encodeURIComponent(uiText.feedbackSubject)}`;
  
  return (
    <footer className="w-full py-6 text-center">
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <p className="text-sm text-gray-500">
          Toma AI recipe generator by Syafiq Haron
        </p>
        <a
          href={mailtoHref}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-full shadow-sm text-xs font-medium text-gray-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
        >
          <MailIcon className="w-4 h-4" />
          <span>{uiText.feedbackButton}</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;