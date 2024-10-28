"use client";
import { useState } from 'react';
import { auth, db } from '../firebase/firebase'; // Firebase 설정
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore'; // Firestore에 데이터 저장 및 중복체크
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateProfile } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가시성 상태
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 가시성 상태
  const [error, setError] = useState('');
  const router = useRouter();

  // 이메일 중복 체크 함수
  const checkEmailDuplicate = async (email) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // 중복이 있으면 true 반환
  };

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호 확인 체크
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이름 필드 체크
    if (name.trim() === "") {
      setError("이름을 입력해주세요.");
      return;
    }

    try {
      // 이메일 중복 체크
      const isDuplicate = await checkEmailDuplicate(email);
      if (isDuplicate) {
        setError("이미 존재하는 이메일입니다.");
        return;
      }

      // Firebase Authentication으로 이메일과 비밀번호로 회원가입
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;



      // Firestore에 사용자 이름 저장
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        uid: user.uid,
        email: user.email,
        profileImageUrl: "",  // 기본 프로필 이미지 또는 URL
        createdAt: new Date()  // 가입 시간
      });

      await updateProfile(user, {
        displayName: name
      });

      console.log('User signed up and profile saved successfully');
      router.push('/login'); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error('Error signing up:', error);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  const pageStyle = {
    backgroundColor: '#ede9fe',
    minHeight: '100vh',
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={signup}>
        <div className="w-[350px] h-[650px] mx-auto text-[15px] relative top-[120px] p-0 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
          <div>

            <div>
              <Link className="text-[50px] font-bold italic relative bottom-[31px] left-[101px]" href="/">ITOI</Link>
            </div>

            <div className="relative bottom-[20px]">
              <div className="font-semibold relative bottom-1 left-2">이름</div>
              <input
                className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[20px] bg-gray-100"
                id="name"
                type="text"
                placeholder="Name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative bottom-[20px]">
              <div className="font-semibold relative bottom-1 left-2">이메일</div>
              <input
                className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[20px] bg-gray-100"
                id="email"
                type="text"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative bottom-[20px]">
              <div className="font-semibold relative bottom-1 left-2">비밀번호</div>
              <input
                className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[10px] bg-gray-100"
                id="password"
                type={showPassword ? "text" : "password"} // 눈 아이콘을 클릭하면 비밀번호를 보여줌
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-[35px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // 아이콘 클릭 시 가시성 토글
              >
                {showPassword ? "👁️" : "🙈"} {/* 눈 모양 아이콘 */}
              </span>
            </div>

            <div className="relative bottom-[20px]">
              <input
                className="w-[300px] h-[50px] text-[15px] border-0 rounded-[20px] outline-none pl-[10px] mb-[10px] bg-gray-100"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // 눈 아이콘을 클릭하면 비밀번호 확인을 보여줌
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-[12px] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // 아이콘 클릭 시 가시성 토글
              >
                {showConfirmPassword ? "👁️" : "🙈"} {/* 눈 모양 아이콘 */}
              </span>
            </div>
            {error && ( // 에러 메시지 표시

              <div>
                <div className="text-red-500 text-center mb-4">{error}</div>
              </div>

            )}

            <div className="relative bottom-[20px]">
              <input
                className="w-[300px] h-[60px] text-[25px] font-bold border-0 rounded-[15px] outline-none pl-[10px] bg-[#E4D4FF] relative top-[20px]"
                id='update'
                type="submit"
                value="SIGN UP"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


