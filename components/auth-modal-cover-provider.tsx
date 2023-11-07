import AuthModal from "@/app/app/(auth)/login/auth-modal";
import { ReactNode } from "react";

const AuthModalProvider = ({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) => {
  return (
    <>
      {children}
      {show && (
        <div className="fixed top-10 left-0 right-0 bottom-0 inset-0 flex items-center justify-center backdrop-blur-sm">
            <AuthModal />
        </div>
      )}
    </>
  );
};

export default AuthModalProvider;
