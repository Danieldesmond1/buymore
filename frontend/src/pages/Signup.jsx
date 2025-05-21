import { useState } from "react";
import SignupForm from '../components/Signup/SignupForm';
// import Signup from '../components/Signup/Signup';
import RoleSelection from '../components/Signup/RoleSelection';

const SignupPage = () => {
  const [role, setRole] = useState("buyer");

  return (
    <>
      <SignupForm selectedRole={role} />
      {/* <Signup /> */}
      <RoleSelection setRole={setRole} />
    </>
  )
}

export default SignupPage;