import { useState } from 'react';
import HubPage from './pages/HubPage';
import QrCodePage from './pages/QrCodePage';
import PasswordPage from './pages/PasswordPage';
import ImageResizerPage from './pages/ImageResizerPage';
import UnitConverterPage from './pages/UnitConverterPage';
import RandomNamePage from './pages/RandomNamePage';
import TextWritingToolsPage from './pages/TextWritingToolsPage';
import PopularToolsPage from './pages/PopularToolsPage';
import NumberConversionToolsPage from './pages/NumberConversionToolsPage';
import DailyUtilitiesPage from './pages/DailyUtilitiesPage';
import AppLayout from './components/AppLayout';
import { Toaster } from '@/components/ui/sonner';

export type Page = 'hub' | 'qr' | 'password' | 'image' | 'unit' | 'name' | 'text' | 'popular' | 'number' | 'daily';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hub');

  const renderPage = () => {
    switch (currentPage) {
      case 'hub':
        return <HubPage onNavigate={setCurrentPage} />;
      case 'popular':
        return <PopularToolsPage />;
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
      case 'text':
        return <TextWritingToolsPage />;
      case 'number':
        return <NumberConversionToolsPage />;
      case 'daily':
        return <DailyUtilitiesPage />;
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
