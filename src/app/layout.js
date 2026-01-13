import "@styles/globals.css"; 
import ClientProvider from "@providers/ClientProvider";
import MobileBlocker from "../components/patient/MobileBlocker";

export const metadata = {
  title: "LumiDent: Bright smiles start here.",
  description: "At LumiDent, we’re dedicated to making every visit comfortable...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
        <MobileBlocker />
      </body>
    </html>
  );
}
