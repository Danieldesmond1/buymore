import { useState } from "react";
import SignupForm from '../components/Signup/SignupForm';

const SignupPage = () => {
  const [role, setRole] = useState("buyer");

  return (
    <>
      <SignupForm selectedRole={role} />
    </>
  )
}

export default SignupPage;