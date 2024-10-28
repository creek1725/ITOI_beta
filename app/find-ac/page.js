"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth"; // Firebase 비밀번호 재설정 메서드
import { auth } from "../firebase/firebase"; // Firebase 설정
import Link from "next/link";

export default function FindAccount() {
  const [email, setEmail] = useState(""); // 사용자 입력 이메일 상태
  const [message, setMessage] = useState(""); // 성공 또는 실패 메시지 상태
  const [error, setError] = useState(""); // 오류 메시지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 비밀번호 재설정 이메일 보내기 처리
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Firebase의 비밀번호 재설정 이메일 발송 메서드
      await sendPasswordResetEmail(auth, email);
      setMessage("비밀번호 재설정 이메일이 발송되었습니다.");
    } catch (error) {
      setError("이메일을 찾을 수 없습니다.");
      console.error("Error sending password reset email: ", error);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    backgroundColor: '#ede9fe',
    minHeight: '100vh',
  };

  return (
    <div style={pageStyle}>
      <div className="w-[350px] h-[400px] mx-auto text-[15px] relative top-[120px] p-0 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
        <Link className="text-[50px] font-bold italic relative bottom-[27px]" href="/">ITOI</Link>
        <form onSubmit={handlePasswordReset}>
          <div className="relative top-[20px]">
            <label htmlFor="email" className="block text-sm font-semibold relative bottom-1 left-2">
              비밀번호를 재설정 할 이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[15px] bg-gray-100"
              required
              placeholder="Email"
              autoComplete="off"
            />
          </div>
          {message && <div className="text-green-500 text-center mt-5">{message}</div>}
          {error && <div className="text-red-500 text-center mt-5">{error}</div>}
          <input
            type="submit"
            className="w-[300px] h-[60px] text-[15px] font-bold border-0 rounded-[15px] outline-none pl-[10px] bg-[#E4D4FF] relative top-[40px]"
            value={loading ? "이메일 전송 중..." : "비밀번호 재설정 이메일 보내기"}
          />
        </form>
      </div>
    </div>
  );
}

