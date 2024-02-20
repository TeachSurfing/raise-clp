import 'react-querybuilder/dist/query-builder.scss';
import { Outlet, useLocation } from 'react-router-dom';
import './App.scss';
import ClpAlert from './components/Alert/Alert';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import useAppStore from './state/app.store';

const App = () => {
    const store = useAppStore();
    const location = useLocation();

    return (
        <div id="clp-app">
            <Navbar />
            <div className="clp-page">{location.pathname === '/' ? <LandingPage /> : <Outlet />}</div>
            <Footer />
            {store.alert ? <ClpAlert severity={store.alert.severity} message={store.alert.message} /> : null}
        </div>
    );
};

export default App;
