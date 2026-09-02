import React from 'react';
import { PortfolioData } from '../types';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { DeveloperTemplate } from './templates/DeveloperTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { BentoTemplate } from './templates/BentoTemplate';
import { EditorialTemplate } from './templates/EditorialTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { ArchitectTemplate } from './templates/ArchitectTemplate';
import { MetroTemplate } from './templates/MetroTemplate';
import { NoirTemplate } from './templates/NoirTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';

interface Props {
  portfolio: PortfolioData;
  isCompact?: boolean;
}

export const PortfolioRenderer: React.FC<Props> = ({ portfolio, isCompact = false }) => {
  switch (portfolio.templateId) {
    case 'minimal':
      return <MinimalTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'developer':
      return <DeveloperTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'creative':
      return <CreativeTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'executive':
      return <ExecutiveTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'bento':
      return <BentoTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'editorial':
      return <EditorialTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'corporate':
      return <CorporateTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'architect':
      return <ArchitectTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'metro':
      return <MetroTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'noir':
      return <NoirTemplate portfolio={portfolio} isCompact={isCompact} />;
    case 'academic':
      return <AcademicTemplate portfolio={portfolio} isCompact={isCompact} />;
    default:
      return <CorporateTemplate portfolio={portfolio} isCompact={isCompact} />;
  }
};

