

// import React, { useState, useEffect } from 'react';

// const ShareButtons = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Kakao SDK 초기화
//   useEffect(() => {
//     if (window.Kakao && !window.Kakao.isInitialized()) {
//       window.Kakao.init('YOUR_KAKAO_APP_KEY'); // 발급받은 카카오 앱 키를 여기에 입력하세요
//     }
//   }, []);

//   // 모달 열기/닫기
//   const handleShareClick = () => {
//     setIsOpen(!isOpen);
//   };

//   // Facebook 공유 기능
//   const handleFacebookShare = () => {
//     const urlToShare = window.location.href;
//     const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`;
//     window.open(facebookShareUrl, '_blank');
//   };

//   // 카카오톡 공유 기능
//   const handleKakaoShare = () => {
//     if (window.Kakao) {
//       window.Kakao.Link.sendDefault({
//         objectType: 'feed',
//         content: {
//           title: '공유할 제목',
//           description: '공유할 설명을 여기에 입력하세요.',
//           imageUrl: 'https://yourwebsite.com/yourimage.jpg', // 이미지 URL
//           link: {
//             mobileWebUrl: window.location.href,
//             webUrl: window.location.href,
//           },
//         },
//         buttons: [
//           {
//             title: '웹으로 보기',
//             link: {
//               mobileWebUrl: window.location.href,
//               webUrl: window.location.href,
//             },
//           },
//         ],
//       });
//     }
//   };

//   // 링크 복사 기능
//   const handleCopyLink = () => {
//     const urlToCopy = window.location.href;
//     navigator.clipboard.writeText(urlToCopy);
//     alert('링크가 복사되었습니다!');
//   };

//   return (
//     <div>
//       {/* 공유 버튼 (모달 여는 버튼) */}
//       <button
//         onClick={handleShareClick}
//         className="bg-[#AE81FB] relative top-[45px] rounded"
//       >
//         <img className="w-[50px] h-[50px]" src="/share.png" alt="shareIcon" />
//       </button>

//       {/* 모달 */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-[300px] relative">
//             <button
//               onClick={() => setIsOpen(false)} // 모달 닫기
//               className="absolute top-1 right-2 text-red-500 text-xl font-bold"
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-center">공유하기</h2>
            
//             <div className="flex justify-around">
//               {/* Facebook 공유 */}
//               <button onClick={handleFacebookShare} className="hover:bg-gray-100 p-2 rounded">
//                 <img className="w-[50px] h-[50px]" src="/facebook_img.png" alt="페이스북 공유" />
//               </button>

//               {/* 카카오톡 공유 */}
//               <button onClick={handleKakaoShare} className="hover:bg-gray-100 p-2 rounded">
//                 <img className="w-[50px] h-[50px]" src="/kakao_img.png" alt="카카오톡 공유" />
//               </button>

//               {/* 링크 복사 */}
//               <button onClick={handleCopyLink} className="hover:bg-gray-100 p-2 rounded">
//                 <img className="w-[50px] h-[50px]" src="/clip.png" alt="링크 복사" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShareButtons;
  




const ShareButtons = () => {
  // 링크 복사 기능
  const handleCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div>
      <button
        onClick={handleCopyLink}
        className="bg-[#AE81FB] relative top-[45px] rounded"
      >
        <img className="w-[50px] h-[50px]" src="/share.png" alt="shareIcon" />
      </button>
    </div>
  );
};

export default ShareButtons;
  