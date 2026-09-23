import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { checkAuth, selectAuth } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { type ReactNode, useEffect } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const ProtectedRoute = ({
  onlyUnAuth = false,
}: {
  onlyUnAuth?: boolean;
}): React.JSX.Element => {
  const { user, isChecked } = useSelector(selectAuth);
  const location = useLocation();

  if (!isChecked) return <Preloader />;
  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location } | null)?.from;
    return (
      <Navigate
        to={from ? `${from.pathname}${from.search}${from.hash}` : '/'}
        replace
      />
    );
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const DetailPage = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <main className={styles.detailPageWrap}>{children}</main>
);

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;

  useEffect(() => {
    void dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/feed/:number"
          element={
            <DetailPage>
              <OrderInfo />
            </DetailPage>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <DetailPage>
              <IngredientDetails />
            </DetailPage>
          }
        />

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route
            path="/profile/orders/:number"
            element={
              <DetailPage>
                <OrderInfo />
              </DetailPage>
            }
          />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="" onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={
                <Modal title="" onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
