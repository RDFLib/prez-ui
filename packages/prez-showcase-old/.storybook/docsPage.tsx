// .storybook/CustomDocsPage.tsx
import React from 'react';
import { DocsContainer, Controls, Stories, DocsContext } from '@storybook/blocks';
import { DocsContextProps } from '@storybook/addon-docs';

const CustomDocsPage: React.FC = () => {
  const context = React.useContext(DocsContext) as DocsContextProps;
  
  return (
    <DocsContainer context={context}>
      <>
        <Stories title="Component Usage" />
        <h2>Properties</h2>
        <Controls />
      </>
    </DocsContainer>
  );
};

export default CustomDocsPage;
