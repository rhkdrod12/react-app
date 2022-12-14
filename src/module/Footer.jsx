import React, { useEffect, useState } from "react";

const Footer = () => {
  const [nowDate, setNoewDate] = useState(() => new Date().toUTCString());

  useEffect(() => {
    setInterval(() => {
      setNoewDate(new Date().toUTCString());
    }, 1000);
  });

  return (
    <footer className="main-footer">
      Make Test Page 2022-09-30<br></br>
      {nowDate}
    </footer>
  );
};

export default Footer;
