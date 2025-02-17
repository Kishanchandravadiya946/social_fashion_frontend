import Navbar from "./component/navbar";
import SocialSection from "./component/socialFashion";
import FeaturedProducts from "./component/featuredproducts";
import AboutUs from "./component/aboutUs";
import Footer from "./component/footer";

const HomeDashboard = ({user_id}) => {
  // console.log(user_id);
  return (
    <div>
      <Navbar user_id={user_id}/>
      <SocialSection />
      <FeaturedProducts />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default HomeDashboard;
