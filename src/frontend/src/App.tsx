import { useState } from 'react';
import HubPage from './pages/HubPage';
import QrCodePage from './pages/QrCodePage';
import PasswordPage from './pages/PasswordPage';
import ImageResizerPage from './pages/ImageResizerPage';
import UnitConverterPage from './pages/UnitConverterPage';
import RandomNamePage from './pages/RandomNamePage';
import AppLayout from './components/AppLayout';
import { Toaster } from '@/components/ui/sonner';

export type Page = 'hub' | 'qr' | 'password' | 'image' | 'unit' | 'name';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hub');

  const renderPage = () => {
    switch (currentPage) {
      case 'hub':
        return <HubPage onNavigate={setCurrentPage} />;
      case 'qr':
        return <QrCodePage />;
      case 'password':
        return <PasswordPage />;
      case 'image':
        return <ImageResizerPage />;
      case 'unit':
        return <UnitConverterPage />;
      case 'name':
        return <RandomNamePage />;
      default:
        return <HubPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </AppLayout>
      <Toaster />
    </>
  );
}

export default App;
