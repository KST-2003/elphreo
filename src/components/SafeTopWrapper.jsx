const SafeTopWrapper = ({ children }) => (
  <>
    <div className="fixed-safe-top">
      {children}
    </div>
    {/* <div className="border-8 border-amber-800 w-full h-6" /> */}

    </>
  );
export default SafeTopWrapper;