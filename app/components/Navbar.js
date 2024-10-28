import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const router = useRouter();

  // // 컴포넌트가 마운트될 때 localStorage에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    }
  }, []);

  const handleLogout = async () => {
    try {
      console.log("User signed out successfully");
      localStorage.removeItem('token'); // 로그아웃 시 토큰 제거
      window.location.reload()
      setIsLoggedIn(false)
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <div className="w-full h-[80px] bg-[#ede9fe]">
      <div className="relative">
        <Link className="text-[35px] font-bold italic absolute top-[11px] left-[30px]" href="/">ITOI</Link>
        <input type="checkbox" id="menuicon" />
        <label htmlFor="menuicon">
          <span />
          <span />
        </label>
        <div className="sidebar">
          <div className="absolute top-[120px] left-[100px] transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/idea">
              <img className="absolute top-[10px] left-[102px] w-[60px]" src="idea.png" />
              <div className="text-[50px] font-bold italic">idea</div>
            </Link>
          </div>
          <div className="absolute top-[200px] left-[175px] transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/brainstorm">
              <img className="absolute top-[20px] left-[270px] w-[45px]" src="brainstorm.png" />
              <div className="text-[50px] font-bold italic">Brianstorm</div>
            </Link>
          </div>
          <div className="absolute top-[280px] left-[130px] transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/contest">
              <img className="absolute top-[20px] left-[185px] w-[45px]" src="contest.png" />
              <div className="text-[50px] font-bold italic">contest</div>
            </Link>
          </div>
          <div className="absolute top-[360px] left-[120px] transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/patent">
              <img className="absolute top-[20px] left-[160px] w-[50px]" src="patent.png" />
              <div className="text-[50px] font-bold italic">patent</div>
            </Link>
          </div>
          <div className="absolute top-[80%] left-[83%] transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/profile">
              <div className="text-[40px] font-bold italic">Profile</div>
            </Link>
          </div>
          <div className="absolute top-[86%] left-[82%] transform -translate-x-1/2 -translate-y-1/2">
            {isLoggedIn ? (
              <div onClick={handleLogout} className="text-[40px] font-bold italic cursor-pointer">
                Logout
              </div>
            ) : (
              <Link href="/login">
                <div className="text-[40px] font-bold italic">Login</div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;




