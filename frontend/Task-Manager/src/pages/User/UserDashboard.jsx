import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useUserAuth } from '../../hooks/useUserAuth';

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  return (
    <div>
      UserDashboard
      {JSON.stringify(user)}
    </div>
  );
};

export default UserDashboard;
