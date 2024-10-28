"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import SocialLogin from '../social-login/SocialLogin';

// 스타일 설정
const pageStyle = {
  backgroundColor: '#ede9fe',
  minHeight: '100vh',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가시성 상태
  const [rememberCredentials, setRememberCredentials] = useState(false);
  const router = useRouter();

  // 페이지 로드 시 로그인 상태 및 저장된 이메일/패스워드 확인
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);  // 토큰이 있으면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 로그아웃 상태
    }

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberCredentials(true);
    }
  }, []);  // 컴포넌트가 처음 마운트될 때만 실행

  // 로그인 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);

      if (rememberCredentials) {
        localStorage.setItem('savedEmail', email); 
      } else {
        localStorage.removeItem('savedEmail');
      }
      setIsLoggedIn(true);
      router.push('/')
    } catch (error) {
      setError('로그인 실패!');
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleLogin}>
        <div className="w-[350px] h-[650px] mx-auto text-[15px] relative top-[120px] p-0 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
          <div>
            <Link className="text-[50px] font-bold italic relative bottom-[60px]" href="/">ITOI</Link>
          </div>
          <div className="relative bottom-[20px]">
            <input
              className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[20px] bg-gray-100"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative bottom-[20px]">
            <input
              className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[10px] bg-gray-100"
              id="password"
              type={showPassword ? "text" : "password"} // 눈 아이콘을 클릭하면 비밀번호를 보여줌
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} // 아이콘 클릭 시 가시성 토글
            >
              {showPassword ? "👁️" : "🙈"} {/* 눈 모양 아이콘 */}
            </span>
          </div>
          <div>
            <div className="relative bottom-[22px] right-[80px]">
              <input
                className="font-bold relative"
                id="rememberCredentials"
                type="checkbox"
                checked={rememberCredentials}
                onChange={(e) => setRememberCredentials(e.target.checked)}
              />
              <label className="font-bold relative left-[5px]" htmlFor="rememberCredentials">아이디 저장</label>
            </div>
            <div className="relative bottom-[44px] left-[65px]">
              <Link className="text-black text-[15px] font-bold relative left-[20px] p-[5px]" href="/sign-up">회원가입</Link>
              <Link className="text-black text-[15px] font-bold relative left-[20px] p-[5px]" href="/find-ac">비번찾기</Link>
            </div>
          </div>
          {error && (
            <div className="relative bottom-[25px]">
              <div className="text-red-500 text-[14px]">
                {error}
              </div>
            </div>
          )}

          <div>
            <input
              className="w-[300px] h-[60px] text-[25px] font-bold border-0 rounded-[15px] outline-none pl-[10px] bg-[#E4D4FF] relative bottom-[5px]"
              type="submit"
              value="Login"
            />
          </div>
          <div className="text-[30px] font-bold italic relative top-[30px]">or</div>
          <SocialLogin />
        </div>
      </form>
    </div>
  );
}
   