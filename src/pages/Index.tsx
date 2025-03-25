
import React from 'react';
import Layout from '../components/Layout';
import ContentEditableEditor from '../components/ContentEditableEditor';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">
            Discord ANSI Color Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create beautifully formatted colored text for Discord messages. Select text and apply 
            colors, bold, or underline formatting. Copy the ANSI code to paste directly into Discord.
          </p>
        </div>
        
        <div className="glass p-6 rounded-xl shadow-sm">
          <ContentEditableEditor />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
