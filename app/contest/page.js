"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../firebase/firebase"; // Firestore 초기화 파일 불러오기
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firestore 관련 함수
import MyContest from "../components/mycontest";
import AddCompetition from "../components/ContestUpload";

export default function Contest() {
  const [competitions, setCompetitions] = useState([
    {
      name: "전국학생발명품경진대회",
      link: "https://www.science.go.kr/board?menuId=MENU00386&siteId=",
      description:
        "전국학생발명품경진대회는 창의성과 실용성을 겸비한 아이디어를 가지고 경쟁하는 대회입니다.",
    },
    {
      name: "전국창업·발명경진대회",
      link: "https://s-talk.or.kr/",
      description:
        "전국창업·발명경진대회는 창의적인 발명 아이디어를 가지고 경연하는 대회입니다.",
    },
    {
      name: "청소년발명페스티벌",
      link: "https://www.ip-edu.net/home/kor/contents.do?menuPos=54",
      description:
        "청소년발명페스티벌은 청소년들의 발명아이디어를 발전시킬 수 있도록 도와주는 대회입니다.",
    },
  ]);

  const [userCompetitions, setUserCompetitions] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedCompetition, setSelectedCompetition] = useState(null); 

  useEffect(() => {
    // Firestore에서 사용자 대회 불러오기
    const fetchCompetitions = async () => {
      const querySnapshot = await getDocs(collection(db, "contests"));
      const userCompList = [];
      querySnapshot.forEach((doc) => {
        userCompList.push({ id: doc.id, ...doc.data() }); // 문서 ID 추가
      });
      setUserCompetitions(userCompList); // 상태에 저장
    };
    fetchCompetitions();
  }, []);

  const openModal = (competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompetition(null);
  };  

  return (
    <div>
      <div>
        <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/">&lt;</Link>
        <div className="text-black text-[50px] font-bold text-center italic">Contest</div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg relative top-[30px]">
          <div className="text-[30px] text-[#AE81FB] font-bold">contest List</div>
          {competitions.map((competition, index) => (
            <div key={index} className="bg-[#ede9fe] border-[2px] border-[#AE81FB] shadow-md p-5 mb-4 rounded-lg">
              <div className="text-[24px] font-bold mb-2">{competition.name}</div>
              <button
                className="text-blue-500 text-[20px] font-bold"
                onClick={() => openModal(competition)}
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg relative top-10">
          <div className="text-[30px] text-[#AE81FB] font-bold">user contest List</div>
          <div className="mb-2">
            <MyContest />
            <AddCompetition />
          </div> 
          {userCompetitions.length > 0 ? (
            userCompetitions.map((competition, index) => (
              <div key={index} className="bg-[#ede9fe] border-[2px] border-[#AE81FB] shadow-md p-5 mb-4 rounded-lg">
                <div className="text-[24px] font-bold mb-2">{competition.name}</div>
                <button
                  className="text-blue-500 text-[20px] font-bold"
                  onClick={() => openModal(competition)}
                >
                  자세히 보기
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 relative top-20">
              아직 추가된 대회가 없습니다.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedCompetition && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] max-w-[500px]">
            <h2 className="text-[30px] font-bold">{selectedCompetition.name}</h2>
            <p className="mt-4">{selectedCompetition.description}</p>

            {/* 기존 대회와 사용자 대회를 구분 */}
            {competitions.link > 0 ? (
              <Link
                href={selectedCompetition.link}
                className="text-blue-500 font-bold text-[20px]"
                target="_blank"
              >
                🌐 신청하러가기
              </Link>
            ) : (
              <Link
                href={`/contest/${selectedCompetition.id}`} // 사용자 대회는 contest/id로 이동
                className="text-blue-500 font-bold text-[20px]"
              >
                🌐 신청하러가기
              </Link>
            )}

            <button
              className="mt-6 bg-red-500 text-white p-2 rounded-lg w-full"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
}





