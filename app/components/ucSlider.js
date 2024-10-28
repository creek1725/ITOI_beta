
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
      const ideasCollection = collection(db, "contests");
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

  if (loading) {
    return (
        <div></div>
    );
  }

  return (
    <div className="absolute top-[660px] w-full">
      <Slider {...settings}>
        {randomIdeas.length > 0 ? (
          randomIdeas.map((idea) => (
            <div key={idea.id}>
              <Link href={`/contest/${idea.id}`} className="block">
                <img
                  className="w-[430px] h-[260px]"
                  src={idea.imageUrl || "default.png"}
                  alt={idea.title}
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


