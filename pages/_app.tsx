import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="312596652717-2d10a03mfeqtikvucmb5qbpajbtc46fs.apps.googleusercontent.com">
      <Component {...pageProps} />;
      <Toaster />
    </GoogleOAuthProvider>
  );
}
