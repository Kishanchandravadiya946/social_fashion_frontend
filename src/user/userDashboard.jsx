import Navbar from "./component/navbar";
import SocialSection from "./component/socialFashion";
import FeaturedProducts from "./component/featuredproducts";
import AboutUs from "./component/aboutUs";
import Footer from "./component/footer";

const HomeDashboard = () => {
  return (
    <div>
      <Navbar />
      <SocialSection />
      <FeaturedProducts />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default HomeDashboard;
