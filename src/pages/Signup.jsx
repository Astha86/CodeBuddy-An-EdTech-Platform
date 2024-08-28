import signupImg from "../assets/Images/page2.png"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
        title="Learn to Code Anywhere, Anytime with CodeBuddy"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={signupImg}
        formType="signup"
    />
  )
};

export default Signup;