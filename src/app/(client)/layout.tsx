import Footer from "@/components/client/layouts/footer";
import Header from "@/components/client/layouts/header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>
  <Header/>
  {children}
  <Footer/>
  </>;
} 