import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/builder/Dashboard';
import Editor from './pages/builder/Editor';
import Renderer from './pages/storefront/Renderer';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/builder/dashboard" replace />}
                />
                <Route path="/builder/dashboard" element={<Dashboard />} />
                <Route path="/builder/editor/:pageId" element={<Editor />} />
                <Route path="/:tenantId/*" element={<Renderer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
