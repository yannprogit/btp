import btpLogo from "/assets/images/logo_btp.svg";

function Header() {
  return (
    <>
      <div className="header-container">
        <div>
          <a href="/">
            <img
              src={btpLogo}
              className="logo"
              alt="builder team pokemon logo"
            />
          </a>
        </div>
        <div>
          <h1>Builder Team Pokemon</h1>
        </div>
        <div>
          <a href="/">Login</a>
        </div>
      </div>
    </>
  );
}

export default Header;
