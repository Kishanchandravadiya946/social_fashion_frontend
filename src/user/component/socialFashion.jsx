const SocialSection = () => {
    return (
      <section className="flex items-center justify-between px-10 py-16 bg-[#D1A684]">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold">
            One stop for all the <span className="text-blue-600">fashion trends</span>
          </h1>
          <p className="text-gray-800 mt-4">
            The home to all types of clothing for men, women, and children.
          </p>
          <button className="mt-6 px-6 py-2 bg-brown-700 text-white rounded-lg hover:bg-black">
            DISCOVER THE NEW
          </button>
        </div>
        {/* <img
          src="https://via.placeholder.com/300"
          alt="Fashion Model"
          className="rounded-lg"
        /> */}
      </section>
    );
  };
  
  export default SocialSection;
  