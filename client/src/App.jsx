import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Home    from './pages/Home.jsx';
import Sheet   from './pages/Sheet.jsx';
import { useApp } from './context/AppContext.jsx';

function Guard({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/home"      element={<Guard><Home /></Guard>} />
        <Route path="/sheet/:id" element={<Guard><Sheet /></Guard>} />
      </Routes>
    </BrowserRouter>
  );
}
