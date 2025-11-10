export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <img
        src="src/images/revy-logo.webp"
        id="navbar-logo"
        className="h-[2.2rem] w-[2.2rem]"
        alt="Logoen til Abakusrevyen"
        loading="eager"
      />
      <span
        id="navbar-title"
        className="font-serif text-xl font-medium tracking-tight md:text-2xl"
      >
        Abakusrevyen
      </span>
    </div>
  );
}
