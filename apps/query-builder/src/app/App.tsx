import { useState } from 'react';

import 'react-querybuilder/dist/query-builder.scss';
import './App.scss';
import Faq from './components/faq/Faq';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';

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
            <Faq isDialogOpen={isFaqVisible} handleClose={handleCloseFaq} />
            <Home />
        </section>
    );
};

export default App;
