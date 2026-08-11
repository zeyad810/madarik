import Logo from "./Logo";

const Header = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4 md:px-8">
        <Logo />
      </div>
    </header>
  );
};

export default Header;