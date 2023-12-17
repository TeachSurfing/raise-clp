import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import useAppStore from '../../state/app.store';
import './MyProfile.scss';

const MyProfile = () => {
    const store = useAppStore();
    const user = store.user;
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const handlePasswordChange = () => {
        console.log('Password changed:', newPassword);
    };

    const userInitial = user?.name?.charAt(0) || '';

    return (
        <div className="my-profile">
            <Container>
                <div className="my-profile__content">
                    <div className="my-profile__header">
                        <Avatar alt="avatar" sx={{ width: 72, height: 72, fontSize: 40 }}>
                            {userInitial}
                        </Avatar>
                        <div className="my-profile__header__info">
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="my-profile__password-change">
                        <h3>Change Password (To Do)</h3>
                        <div>
                            <TextField
                                label="Old Password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                        <div>
                            <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MyProfile;
