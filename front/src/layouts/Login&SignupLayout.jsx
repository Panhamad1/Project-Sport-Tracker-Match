import NavigationBar from '../components/Login&SignupPage/NavigationBar';
import Footer from '../components/Login&SignupPage/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col scrollbar-hide">
      <NavigationBar />

      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;