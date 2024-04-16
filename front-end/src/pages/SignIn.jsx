import LoginSignUp from "../components/LoginSignUp/LoginSignUp";
import "./SignIn.css";
import SignInComp from "../components/LoginSignUp/SignInComp";

function SignIn(){
    return(
        <div className="login">
            {/* <LoginSignUp/> */}
            <SignInComp/>
        </div>
    )
    }
    
    export default SignIn;