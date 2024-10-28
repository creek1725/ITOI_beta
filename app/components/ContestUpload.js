// import { useState } from "react";
// import { db, auth } from "../firebase/firebase"; // Firebase 초기화 파일 불러오기
// import { collection, addDoc } from "firebase/firestore"; // Firestore 관련 함수
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 관련 함수

// export default function AddCompetition() {
//   const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
//   const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
//   const [image, setImage] = useState(null); // 업로드할 이미지 상태
//   const [newCompetition, setNewCompetition] = useState({
//     name: "",
//     date: "",
//     description: "",
//     imageUrl: "", // 이미지 URL을 저장할 필드 추가
//   });

//   // 입력값 변경 처리
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCompetition((prev) => ({ ...prev, [name]: value }));
//   };

//   // 이미지 파일 선택 및 미리보기 처리
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     // 이미지 미리보기 설정
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   // 대회 업로드 처리
//   const addNewCompetition = async (e) => {
//     e.preventDefault();

//     if (!newCompetition.name || !newCompetition.date || !newCompetition.description || !image) {
//       alert("모든 필드를 입력해주세요.");
//       return;
//     }

//     try {
//       const user = auth.currentUser; // 현재 로그인된 사용자 가져오기
//       if (!user) {
//         alert("로그인이 필요합니다.");
//         return;
//       }

//       const storage = getStorage();
//       const storageRef = ref(storage, `images/${image.name}`);
//       await uploadBytes(storageRef, image);
//       const imageUrl = await getDownloadURL(storageRef); // 업로드 후 이미지 URL 가져오기

//       // Firestore에 새 대회 추가하기 전에 newCompetition에 userId와 imageUrl 추가
//       const updatedCompetition = { ...newCompetition, imageUrl, userId: user.uid };

//       // Firestore에 새 대회 추가
//       const docRef = await addDoc(collection(db, "contests"), updatedCompetition);
//       console.log("대회 추가 성공: ", docRef.id);

//       // 입력 필드 초기화
//       setNewCompetition({ name: "", date: "", description: "", imageUrl: "" });
//       setImage(null); // 이미지 상태 초기화
//       setImagePreview(null); // 이미지 미리보기 초기화
//       setIsModalOpen(false); // 모달 닫기
//     } catch (e) {
//       console.error("대회 추가 중 오류 발생: ", e);
//     }
//   };

//   // 모달 열기/닫기 토글 함수
//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   return (
//     <div className="inline-block">
//       <button
//         className="bg-[#AE81FB] text-white font-bold rounded-md p-2"
//         onClick={toggleModal}
//       >
//         대회 추가하기
//       </button>

//       {/* 모달창 */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
//             <h2 className="text-[30px] font-bold">대회 추가하기</h2>
//             <form onSubmit={addNewCompetition} className="flex flex-col gap-4 mt-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={newCompetition.name}
//                 onChange={handleInputChange}
//                 placeholder="대회 이름"
//                 className="p-2 border border-gray-300 rounded"
//               />
//               <input
//                 type="text"
//                 name="date"
//                 value={newCompetition.date}
//                 onChange={handleInputChange}
//                 placeholder="대회 날짜"
//                 className="p-2 border border-gray-300 rounded"
//               />
//               <textarea
//                 name="description"
//                 value={newCompetition.description}
//                 onChange={handleInputChange}
//                 placeholder="대회 설명"
//                 className="p-2 border border-gray-300 rounded"
//               />
//               <input
//                 type="file"
//                 accept="image/*" // 이미지 파일만 업로드 허용
//                 onChange={handleImageChange} // 이미지 선택 핸들러
//                 className="p-2 border border-gray-300 rounded"
//               />
//               {imagePreview && (
//                 <img src={imagePreview} alt="이미지 미리보기" className="mt-2 w-full h-auto rounded" />
//               )}
//               <button type="submit" className="mt-5 bg-[#AE81FB] text-white p-2 rounded-lg">
//                 대회 추가
//               </button>
//             </form>
//             <button
//               className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full"
//               onClick={toggleModal}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { db, storage, auth } from "../firebase/firebase"; // Firebase 초기화 파일 불러오기
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore"; // Firestore 관련 함수

export default function AddCompetition() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
  const [image, setImage] = useState(null); // 업로드할 이미지 상태
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    stDate: "",
    fiDate: "",
    participant: "",
    description: "",
  });
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(""); // 에러 상태

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompetition((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 파일 선택 및 미리보기 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // 이미지 미리보기 설정
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // 이미지 미리보기 취소
  const handleCancelPreview = () => {
    setImage(null);
    setImagePreview("");
  };

  // 대회 업로드 처리 (PostPage와 동일한 방식)
  const addNewCompetition = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 현재 사용자 UID를 Firestore의 users 컬렉션에서 가져오기
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("사용자가 로그인되어 있지 않습니다.");
      }
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }

      // Firestore에 대회 데이터 저장
      const competitionData = {
        ...newCompetition,
        imageUrl,
        createdAt: new Date(),
        userId: currentUser.uid, // 사용자 UID 저장
      };

      await addDoc(collection(db, "contests"), competitionData); // Firestore에 데이터 저장
      setLoading(false);
      setIsModalOpen(false); // 모달 닫기
      window.location.reload()
    } catch (error) {
      console.error("대회 업로드 중 오류:", error);
      setError("대회를 업로드하는 데 실패했습니다.");
      setLoading(false);
    }
  };

  // 모달 열기/닫기 토글 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="inline-block">
      <button
        className="bg-[#AE81FB] text-white font-bold rounded-md p-2"
        onClick={toggleModal}
      >
        대회 추가하기
      </button>

      {/* 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
            <h2 className="text-[30px] font-bold">대회 추가하기</h2>
            <form onSubmit={addNewCompetition} className="flex flex-col gap-4 mt-4">
            <label className="block text-lg font-semibold">대회 이름</label>
              <input
                type="text"
                name="name"
                value={newCompetition.name}
                onChange={handleInputChange}
                placeholder="대회 이름"
                className="p-2 border border-gray-300 rounded"
                autoComplete="off"
                required
              />
              <label className="block text-lg font-semibold">대회 포스터</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="이미지 미리보기" className="mt-2 w-[200px] h-[200px] rounded" />
                  <button
                    type="button"
                    onClick={handleCancelPreview}
                    className="bg-red-500 text-white rounded-full w-6 h-6 absolute bottom-[190px] left-[190px]"
                  >
                    ✕
                  </button>
                </div>

              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*" // 이미지 파일만 업로드 허용
                    onChange={handleImageChange} // 이미지 선택 핸들러
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              )}
              <label className="block text-lg font-semibold">대회 시작일자</label>
              <input
                type="date"
                name="stDate"
                value={newCompetition.date}
                onChange={handleInputChange}
                placeholder="대회 시작일자"
                className="p-2 border border-gray-300 rounded"
                autoComplete="off"
                required
              />
              <label className="block text-lg font-semibold">대회 마감일자</label>
                <input
                type="date"
                name="fiDate"
                value={newCompetition.date}
                onChange={handleInputChange}
                placeholder="대회 마감일자"
                className="p-2 border border-gray-300 rounded"
                autoComplete="off"
                required
              />
              <label className="block text-lg font-semibold">모집 대상</label>
              <textarea
                type="text"
                name="participant"
                value={newCompetition.participant}
                onChange={handleInputChange}
                placeholder="모집 대상"
                className="p-2 border border-gray-300 rounded"
                autoComplete="off"
                required
              />
              <label className="block text-lg font-semibold">대회 설명</label>  
              <textarea
                name="description"
                value={newCompetition.description}
                onChange={handleInputChange}
                placeholder="대회 설명"
                className="p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="mt-5 bg-[#AE81FB] text-white p-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "업로드 중..." : "대회 추가"}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
            <button
              className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full"
              onClick={toggleModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


