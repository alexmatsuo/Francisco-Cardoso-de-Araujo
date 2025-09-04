export const Footer = () =>{
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-center">
      <p>&copy; {year} Francisco Cardoso de Araujo. All rights reserved.</p>
    </footer>
  );
}
