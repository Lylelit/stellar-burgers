import { ProfileMenuUI } from '@ui';
import { logout } from '@slices/authSlice';
import { useDispatch } from '@services/store';
import { useLocation } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
