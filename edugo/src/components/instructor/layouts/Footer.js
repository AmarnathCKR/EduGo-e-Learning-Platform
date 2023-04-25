import logo from "../../../Assets/logo-white.png"


function Footer() {
  const resolution = {
    height : "100px",
    width : "150px"
  }
  return (
    <>
      <div className="bg-neutral-900">
        <div className="grid grid-cols-2">
          <div className="flex justify-start text-white">
            <img style={resolution} className="text-white" src={logo} alt="logo" />
          </div>
          <div className="flex justify-end text-white items-center mx-5">
            © copyright 2023 Edugo LTD.
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
