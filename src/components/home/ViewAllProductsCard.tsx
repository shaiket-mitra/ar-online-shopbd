import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const ViewAllProductsCard = ({category, quality, linkAdd}: any) => {
  return (
    <Link href={linkAdd} passHref>
      <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-pink-100">
        {/* Background decorative elements */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-pink-200 opacity-20 transition-all duration-500 group-hover:scale-150"></div>
        <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-pink-300 opacity-20 transition-all duration-500 group-hover:scale-150"></div>
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h3 className="mb-3 text-2xl font-bold text-pink-800 transition-all duration-300 group-hover:text-pink-900">
            Explore Our All {category} Collection
          </h3>
          <p className="mb-6 text-pink-600 transition-all duration-300 group-hover:text-pink-700">
            Discover all our delicious product varieties.
          </p>
          
          {/* Button with arrow icon */}
          <div className="flex items-center justify-center space-x-2 rounded-full bg-pink-400 px-6 py-3 text-white transition-all duration-300 group-hover:bg-pink-500 group-hover:shadow-md">
            <span className="font-medium">View {quality} Products</span>
            <ArrowRightIcon className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ViewAllProductsCard;