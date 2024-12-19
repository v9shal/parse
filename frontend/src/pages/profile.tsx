import { useSelector } from 'react-redux';
import ProfileProvider from '../components/profileProvider';
import ProfileUser from '../components/profileUser';

const Profile = () => {
  const role = useSelector((state: any) => state.auth.role);

  if (role === 'Provider') {
    return <ProfileProvider />;
  } else if (role === 'User') {
    return <ProfileUser />;
  }

  // Fallback return
  return <div>Role not recognized</div>;
};

export default Profile;
