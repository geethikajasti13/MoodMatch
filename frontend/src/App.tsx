import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Results from '@/pages/Results';
import Discover from '@/pages/Discover';
import ContentDetail from '@/pages/ContentDetail';
import MyList from '@/pages/MyList';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-cream-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
