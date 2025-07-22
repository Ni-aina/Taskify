import {
    SignInButton,
    SignUpButton
} from "@clerk/nextjs"

const Auth = () => {

    return (
        <div className="bg-gray-900 px-5 py-2 rounded-full flex gap-5">
            <SignInButton>
                <button className="text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:scale-105">
                    Sign In
                </button>
            </SignInButton>
            <SignUpButton>
                <button className="bg-amber-600 border border-amber-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-transparent hover:text-amber-600">
                    Sign Up
                </button>
            </SignUpButton>
        </div>
    )
}

export default Auth;