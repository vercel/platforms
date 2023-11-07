import { ReactNode } from "react";
import AuthModal from "./auth-modal";

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
        <div className="fixed inset-0 bottom-0 left-0 right-0 top-10 flex items-center justify-center backdrop-blur-sm">
          <AuthModal />
        </div>
      )}
    </>
  );
};

export default AuthModalProvider;
