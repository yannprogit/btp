import btpLogo from "/assets/images/logo_btp.png";

function Header() {
  return (
    <>
    <div className="w-full bg-white px-6 py-4 flex items-center">
      <div className="mx-auto flex items-center justify-center gap-4 flex-1">
        <a href="/">
          <img
            src={btpLogo}
            alt="Builder Team Pokemon logo"
            className="3xs:w-10 md:w-20"
          />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">
          Builder Team Pokemon
        </h1>
      </div>
      <div className="absolute mr-4">
        <a
          href="/auth"
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </a>
      </div>
    </div>
    </>
  );
}

export default Header;
