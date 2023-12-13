import 'react-querybuilder/dist/query-builder.scss';
import { Outlet } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';

const App = () => {
    return (
        <div id="clp-app">
            <Navbar />
            <div className="clp-page">
                <Outlet />
            </div>
        </div>
    );
};

export default App;
