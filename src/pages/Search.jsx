import { useState, useEffect, useRef } from "react";

function Search() {
  const districts = [
    "District 1",
    "District 2",
    "District 3",
    "District 4",
    "District 5",
    "District 6",
  ];
  const subdistricts = [
    "Subdistrict A",
    "Subdistrict B",
    "Subdistrict C",
    "Subdistrict D",
    "Subdistrict E",
  ];
  const meters = ["100m", "200m", "500m", "1km", "2km"];

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
  const [selectedMeter, setSelectedMeter] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs to track dropdown containers
  const districtRef = useRef(null);
  const subdistrictRef = useRef(null);
  const meterRef = useRef(null);

  const handleSearch = () => {
    console.log("Search:", { selectedDistrict, selectedSubdistrict, selectedMeter });
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        districtRef.current &&
        !districtRef.current.contains(event.target) &&
        subdistrictRef.current &&
        !subdistrictRef.current.contains(event.target) &&
        meterRef.current &&
        !meterRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="fixed top-15 left-0 right-0 shadow-md p-2 flex items-center space-x-2">
        {/* District Dropdown */}
        <div ref={districtRef} className="relative flex-1">
          <button
            onClick={() => toggleDropdown("district")}
            className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span>{selectedDistrict || "District"}</span>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown === "district" && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
              {districts.map((district, index) => (
                <div
                  key={district}
                  onClick={() => {
                    setSelectedDistrict(district);
                    setOpenDropdown(null);
                  }}
                  className={`p-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    index > 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  {district}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subdistrict Dropdown */}
        <div ref={subdistrictRef} className="relative flex-1">
          <button
            onClick={() => toggleDropdown("subdistrict")}
            className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span>{selectedSubdistrict || "Subdistrict"}</span>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown === "subdistrict" && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
              {subdistricts.map((subdistrict, index) => (
                <div
                  key={subdistrict}
                  onClick={() => {
                    setSelectedSubdistrict(subdistrict);
                    setOpenDropdown(null);
                  }}
                  className={`p-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    index > 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  {subdistrict}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meter Dropdown */}
        <div ref={meterRef} className="relative flex-1">
          <button
            onClick={() => toggleDropdown("meter")}
            className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span>{selectedMeter || "Meter"}</span>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown === "meter" && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
              {meters.map((meter, index) => (
                <div
                  key={meter}
                  onClick={() => {
                    setSelectedMeter(meter);
                    setOpenDropdown(null);
                  }}
                  className={`p-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    index > 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  {meter}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.5 3a7.5 7.5 0 015.96 12.28l4.53 4.53a1 1 0 01-1.42 1.42l-4.53-4.53A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
          </svg>
        </button>
      </div>

      <div className="  pt-35 p-4">
        <p className="text-center text-gray-600">
          Search results will appear here...
        </p>
      </div>
    </div>
  );
}

export default Search;