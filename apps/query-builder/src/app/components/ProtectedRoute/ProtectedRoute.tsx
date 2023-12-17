import { Navigate } from 'react-router-dom';
import useAppStore from '../../state/app.store';

const ProtectedRoute = ({ children }: any) => {
    const store = useAppStore();

    if (!store.isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
