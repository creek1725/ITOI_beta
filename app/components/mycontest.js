"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase"; // Firebase 초기화 파일 불러오기
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore 관련 함수
import Link from "next/link";

export default function MyContest() {
  const [myHostedCompetitions, setMyHostedCompetitions] = useState([]); // 내가 주최한 대회 상태
  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false); // 마이페이지 모달 상태

  // 내가 주최한 대회 불러오기 함수
  const fetchMyHostedCompetitions = async (userId) => {
    try {
      const q = query(collection(db, "contests"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const hostedCompetitions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyHostedCompetitions(hostedCompetitions); // 대회 목록 상태 업데이트
    } catch (error) {
      console.error("내가 주최한 대회를 불러오는 중 오류 발생:", error);
    }
  };

  // Firebase 인증 상태 확인 및 대회 불러오기
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchMyHostedCompetitions(user.uid); // 내가 주최한 대회 불러오기
      } else {
        console.log("사용자가 로그인되어 있지 않습니다.");
      }
    });

    // 컴포넌트가 언마운트될 때 인증 상태 구독 해제
    return () => unsubscribe();
  }, []);

  // 마이페이지 모달 열기/닫기 함수
  const toggleMyPageModal = () => {
    setIsMyPageModalOpen(!isMyPageModalOpen);
  };

  return (
    <div className="inline-block mr-1">
      <button
        className="bg-[#AE81FB] text-white font-bold rounded-md p-2"
        onClick={toggleMyPageModal}
      >
        MY CONTEST
      </button>

      {/* 마이페이지 모달 */}
      {isMyPageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] max-w-[500px]">
            {/* 내가 주최한 대회 목록 */}
            <div className="mt-6">
              <h3 className="text-[24px] font-bold">MY CONTEST</h3>
              {myHostedCompetitions.length > 0 ? (
                myHostedCompetitions.map((competition) => (
                  <div key={competition.id} className="mt-4">
                    <h4 className="text-[20px] font-bold">{competition.name}</h4>
                    <p>{competition.description}</p>
                    <Link className="text-[#AE81FB] font-bold" href={`/contest/manage/${competition.id}`}>관리&평가</Link>
                  </div>
                ))
              ) : (
                <p>주최한 대회가 없습니다.</p>
              )}
            </div>
            <button
              className="mt-6 bg-red-500 text-white p-2 rounded-lg w-full"
              onClick={toggleMyPageModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



