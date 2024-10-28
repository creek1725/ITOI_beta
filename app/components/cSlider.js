"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Firestore 초기화 경로

export default function CSlider() {
  const [randomIdeas, setRandomIdeas] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const ideasCollection = collection(db, "posts");
      const ideasSnapshot = await getDocs(ideasCollection);
      const ideasList = ideasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 아이디어 중에서 랜덤으로 3개 선택
      const selectedIdeas = [];
      for (let i = 0; i < 3; i++) {
        if (ideasList.length === 0) break; // 리스트가 비어있는 경우 방지
        const randomIndex = Math.floor(Math.random() * ideasList.length);
        selectedIdeas.push(ideasList[randomIndex]);
        ideasList.splice(randomIndex, 1); // 중복 방지를 위해 리스트에서 제거
      }

      setRandomIdeas(selectedIdeas);
      setLoading(false);
    };

    fetchIdeas();
  }, []); // 빈 배열을 전달해 처음 렌더링 시에만 실행

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    arrows: false,
  };

  const backgroundClasses = ["bg-[#c7d2fe]", "bg-[#ddd6fe]", "bg-[#e9d5ff]"];

  if (loading) {
    return (
      <div>
        <div className="absolute top-[80px] w-full h-[300px] bg-[#c7d2fe] rounded-[20px]"></div>
      </div>
    );
  }

  return (
    <div className="absolute top-[80px] w-full h-[300px]">
      <Slider {...settings}>
        {randomIdeas.length > 0 ? (
          randomIdeas.map((idea, index) => (
            <div
              key={idea.id}
              className={`${backgroundClasses[index % backgroundClasses.length]} h-[300px] rounded-[20px] flex items-center justify-center`}
            >
              <Link href={`/idea/${idea.id}`} className="block">
                <img
                  className="w-[200px] h-[200px] rounded-[20px] mb-4 relative top-[50px] left-[20px]"
                  src={idea.imageUrl || "default.png"}
                  alt={idea.title}
                />
                <div className="text-[25px] font-bold relative bottom-[100px] left-[250px]">
                  {idea.title}
                </div>
                <img
                  className="w-[50px] h-[50px] mt-2 relative bottom-[100px] left-[240px]"
                  src="share.png"
                  alt="Share"
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center">아이디어가 없습니다.</div>
        )}
      </Slider>
    </div>
  );
}


