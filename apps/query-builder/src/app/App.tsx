import 'react-querybuilder/dist/query-builder.scss';
import { Outlet } from 'react-router-dom';
import './App.scss';
import ClpAlert from './components/Alert/Alert';
import Navbar from './components/Navbar/Navbar';
import useAppStore from './state/app.store';

const App = () => {
    const store = useAppStore();

    return (
        <div id="clp-app">
            <Navbar />
            <div className="clp-page">
                <Outlet />
            </div>
            {store.alert ? <ClpAlert severity={store.alert.severity} message={store.alert.message} /> : null}
        </div>
    );
};

export default App;
