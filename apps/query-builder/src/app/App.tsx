import { useState } from 'react';

import 'react-querybuilder/dist/query-builder.scss';
import './App.scss';
import Faq from './components/Faq/Faq';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';

const App = () => {
    const [isFaqVisible, setIsFaqVisible] = useState<boolean>(false);

    const handleHelpClick = () => {
        setIsFaqVisible(true);
    };
    const handleCloseFaq = () => {
        setIsFaqVisible(false);
    };

    return (
        <section>
            <Navbar handleInfoButtonClick={handleHelpClick} />
            <Faq isDialogOpen={isFaqVisible} onClose={handleCloseFaq} />
            <Home />
        </section>
    );
};

export default App;
