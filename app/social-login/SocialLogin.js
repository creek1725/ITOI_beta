

"use client";
import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider, githubProvider } from "../firebase/firebase";
import { db } from "../firebase/firebase"; // Firestore import
import { doc, setDoc } from "firebase/firestore"; // Firestore setDoc import
import { useRouter } from "next/navigation";

export default function SocialLogin() {
    const [error, setError] = useState("");
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // JWT 토큰을 로컬 스토리지에 저장하고 리다이렉트하는 함수
    const saveTokenAndRedirect = async (user) => {
        try {
            const token = await user.getIdToken();
            localStorage.setItem("token", token);

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                uid: user.uid,
                email: user.email,
                profileImageUrl: "",  // 기본 프로필 이미지 또는 URL
                createdAt: new Date()  // 가입 시간
            }, { merge: true }); // 기존 문서에 병합

            // 로그인 상태 업데이트
            setIsLoggedIn(true);
            router.push("/"); // 로그인 상태일 때 홈으로 리다이렉트
        } catch (error) {
            setError("토큰 저장 또는 사용자 정보 저장 실패: " + error.message);
        }
    };

    // Google 로그인 핸들러
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Google 로그인 성공:", user);
            await saveTokenAndRedirect(user);
        } catch (error) {
            setError("Google 로그인 실패: " + error.message);
        }
    };

    // Facebook 로그인 핸들러
    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            console.log("Facebook 로그인 성공:", user);
            await saveTokenAndRedirect(user);
        } catch (error) {
            setError("Facebook 로그인 실패: " + error.message);
        }
    };

    // GitHub 로그인 핸들러
    const handleGitHubLogin = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;
            console.log("GitHub 로그인 성공:", user);
            await saveTokenAndRedirect(user);
        } catch (error) {
            setError("GitHub 로그인 실패: " + error.message);
        }
    };

    // // 로그인 상태가 변경되면 홈으로 리다이렉트
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         router.push("/"); // 로그인 상태일 때 홈으로 리다이렉트
    //     }
    // }, [isLoggedIn, router]);

    return (
        <div className="relative top-[60px]">
            <button onClick={handleGoogleLogin}>
                <img className="w-[50px] h-[50px] mr-5" src="google_img.png" alt="google login" />
            </button>
            <button onClick={handleFacebookLogin}>
                <img className="w-[50px] h-[50px] mr-5" src="facebook_img.png" alt="facebook login" />
            </button>
            <button onClick={handleGitHubLogin}>
                <img className="w-[50px] h-[50px]" src="github_img.png" alt="github login" />
            </button>
        </div>
    );
}

