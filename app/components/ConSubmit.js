// "use client";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { db, storage } from "../firebase/firebase";
// import { doc, getDoc, collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 임포트

// export default function ContestSubmit() {
//     const pathname = usePathname();
//     const id = pathname.split('/').pop();
//     const [isOpen, setIsOpen] = useState(false);
//     const [contest, setContest] = useState(null);
//     const [formData, setFormData] = useState({
//         contestName: "",
//         participant: "",
//         email: "",
//         imageUrl: "",
//         title: "",
//         description: "",
//     });
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const [image, setImage] = useState(null);

//     useEffect(() => {
//         const fetchContest = async () => {
//             const docRef = doc(db, "contests", id);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const contestData = docSnap.data();
//                 setContest(contestData);
//                 setFormData({ ...formData, contestName: contestData.name });
//             } else {
//                 console.log("해당 대회를 찾을 수 없습니다.");
//             }
//         };
//         if (id) fetchContest();
//     }, [id]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     // 이미지 파일 선택 및 미리보기 처리
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setImage(file);

//         // 이미지 미리보기 설정
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImagePreview(reader.result);
//         };
//         if (file) {
//             reader.readAsDataURL(file);
//         } else {
//             setImagePreview(null);
//         }
//     };

//     // 이미지 미리보기 취소
//     const handleCancelPreview = () => {
//         setImage(null);
//         setImagePreview("");
//     };

//     const toggleModal = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             let imageUrl = "";
//             // 이미지가 선택되었을 경우 Firebase Storage에 업로드
//             if (image) {
//                 const storageRef = ref(storage, `contestImages/${image.name}`);
//                 await uploadBytes(storageRef, image);
//                 imageUrl = await getDownloadURL(storageRef); // 업로드한 이미지의 URL 가져오기
//             }

//             // Firestore에 데이터 저장
//             await addDoc(collection(db, "contestApplications"), { 
//                 ...formData, 
//                 contestId: id,
//                 imageUrl, // 이미지 URL을 Firestore에 저장
//             });
//             setIsSubmitted(true);
//         } catch (error) {
//             console.error("Error submitting application:", error);
//             setErrorMessage("신청을 제출하는 중 오류가 발생했습니다.");
//         }
//     };

//     if (isSubmitted) {
//         return (
//             <div className="text-center p-6">
//                 <h1 className="text-3xl font-bold">신청이 완료되었습니다!</h1>
//                 <p className="mt-4">대회 신청을 성공적으로 완료했습니다. 감사합니다.</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="flex justify-center">
//                 <button
//                     onClick={toggleModal}
//                     className="bg-[#AE81FB] text-white text-[25px] font-bold rounded-md p-2 relative top-[5px]"
//                 >
//                     참가하기
//                 </button>
//             </div>
//             {isOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
//                         <h1 className="text-4xl font-bold mb-8 text-center">대회 신청</h1>
//                         {contest && (
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div>
//                                     <label className="block text-lg font-semibold">신청자 이름</label>
//                                     <input
//                                         type="text"
//                                         name="participant"
//                                         placeholder="이름을 입력하세요"
//                                         value={formData.participant} // 수정된 부분
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                         autoComplete="off"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-lg font-semibold">신청자 이메일</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="이메일을 입력하세요"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                         autoComplete="off"
//                                     />
//                                 </div>
//                                 {imagePreview ? (
//                                     <div className="relative">
//                                         <img src={imagePreview} alt="이미지 미리보기" className="mt-2 w-full h-auto rounded" />
//                                         <button
//                                             type="button"
//                                             onClick={handleCancelPreview}
//                                             className="bg-red-500 text-white rounded-full w-6 h-6 absolute top-[10px] right-[10px]"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <div>
//                                         <label className="block text-lg font-semibold">아이디어 사진</label>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             name="imageUrl"
//                                             onChange={handleImageChange}
//                                             required
//                                             className="w-full p-2 border border-gray-300 rounded"
//                                         />
//                                     </div>
//                                 )}
//                                 <div>
//                                     <label className="block text-lg font-semibold">아이디어 제목</label>
//                                     <input
//                                         type="text"
//                                         name="title"
//                                         placeholder="제목을 입력하세요"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                         autoComplete="off"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-lg font-semibold">아이디어 설명</label>
//                                     <textarea
//                                         name="description"
//                                         placeholder="설명을 입력하세요"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         className="w-full p-2 border border-gray-300 rounded"
//                                         autoComplete="off"
//                                     />
//                                 </div>

//                                 {errorMessage && <p className="text-red-500">{errorMessage}</p>}

//                                 <button
//                                     type="submit"
//                                     className="w-full bg-[#AE81FB] text-white py-2 px-4 rounded"
//                                 >
//                                     신청하기
//                                 </button>
//                             </form>
//                         )}
//                         <button
//                             className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full"
//                             onClick={toggleModal}
//                         >
//                             닫기
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



    // "use client";
    // import { useState, useEffect } from "react";
    // import { usePathname } from "next/navigation";
    // import { db, storage } from "../firebase/firebase";
    // import { doc, getDoc, collection, addDoc } from "firebase/firestore";
    // import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 임포트
    // import { getAuth, sendEmailVerification, onAuthStateChanged } from "firebase/auth"; // Firebase Auth 임포트

    // export default function ContestSubmit() {
    //     const pathname = usePathname();
    //     const id = pathname.split('/').pop();
    //     const [isOpen, setIsOpen] = useState(false);
    //     const [contest, setContest] = useState(null);
    //     const [formData, setFormData] = useState({
    //         contestName: "",
    //         participant: "",
    //         email: "",
    //         imageUrl: "",
    //         title: "",
    //         description: "",
    //     });
    //     const [isSubmitted, setIsSubmitted] = useState(false);
    //     const [errorMessage, setErrorMessage] = useState("");
    //     const [imagePreview, setImagePreview] = useState(null);
    //     const [image, setImage] = useState(null);
    //     const [user, setUser] = useState(null); 
    //     const [isCodeSent, setIsCodeSent] = useState(false); 

    //     useEffect(() => {
    //         const fetchContest = async () => {
    //             const docRef = doc(db, "contests", id);
    //             const docSnap = await getDoc(docRef);
    //             if (docSnap.exists()) {
    //                 const contestData = docSnap.data();
    //                 setContest(contestData);
    //                 setFormData({ ...formData, contestName: contestData.name });
    //             } else {
    //                 console.log("해당 대회를 찾을 수 없습니다.");
    //             }
    //         };

    //         const auth = getAuth();
    //         onAuthStateChanged(auth, (currentUser) => {
    //             setUser(currentUser); // 현재 사용자 상태 저장
    //         });

    //         if (id) fetchContest();
    //     }, [id]);

    //     const handleChange = (e) => {
    //         setFormData({
    //             ...formData,
    //             [e.target.name]: e.target.value,
    //         });
    //     };

    //     // 이미지 파일 선택 및 미리보기 처리
    //     const handleImageChange = (e) => {
    //         const file = e.target.files[0];
    //         setImage(file);

    //         // 이미지 미리보기 설정
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result);
    //         };
    //         if (file) {
    //             reader.readAsDataURL(file);
    //         } else {
    //             setImagePreview(null);
    //         }
    //     };

    //     // 이미지 미리보기 취소
    //     const handleCancelPreview = () => {
    //         setImage(null);
    //         setImagePreview("");
    //     };

    //     const toggleModal = () => {
    //         setIsOpen(!isOpen);
    //     };

    //     const sendVerificationEmail = async () => {
    //         if (user) {
    //             const auth = getAuth();
    //             await sendEmailVerification(user);
    //             setIsCodeSent(true);
    //             setErrorMessage("인증 이메일이 발송되었습니다. 이메일을 확인하세요.");
    //         } else {
    //             setErrorMessage("사용자가 로그인되지 않았습니다.");
    //         }
    //     };

    //     const handleSubmit = async (e) => {
    //         e.preventDefault();

    //         // 사용자 상태 확인
    //         if (!user) {
    //             setErrorMessage("사용자가 로그인되지 않았습니다.");
    //             return;
    //         }

    //         // 이메일 인증 여부 확인
    //         if (!user.emailVerified) {
    //             setErrorMessage("이메일 인증이 필요합니다. 인증 이메일을 확인하세요.");
    //             return;
    //         }

    //         try {
    //             let imageUrl = "";
    //             // 이미지가 선택되었을 경우 Firebase Storage에 업로드
    //             if (image) {
    //                 const storageRef = ref(storage, `contestImages/${image.name}`);
    //                 await uploadBytes(storageRef, image);
    //                 imageUrl = await getDownloadURL(storageRef); // 업로드한 이미지의 URL 가져오기
    //             }

    //             // Firestore에 데이터 저장
    //             await addDoc(collection(db, "contestApplications"), { 
    //                 ...formData, 
    //                 contestId: id,
    //                 imageUrl, // 이미지 URL을 Firestore에 저장
    //             });
    //             setIsSubmitted(true);
    //         } catch (error) {
    //             console.error("Error submitting application:", error);
    //             setErrorMessage("신청을 제출하는 중 오류가 발생했습니다.");
    //         }
    //     };

    //     if (isSubmitted) {
    //         return (
    //             <div className="text-center p-6 text-green-500">
    //                 <h1 className="text-3xl font-bold">신청이 완료되었습니다!</h1>
    //                 <p className="mt-4 font-bold">대회 신청을 성공적으로 완료했습니다. 감사합니다.</p>
    //             </div>
    //         );
    //     }

    //     return (
    //         <div>
    //             <div className="flex justify-center">
    //                 <button
    //                     onClick={toggleModal}
    //                     className="bg-[#AE81FB] text-white text-[25px] font-bold rounded-md p-2 relative top-[5px] mb-5"
    //                 >
    //                     참가하기
    //                 </button>
    //             </div>
    //             {isOpen && (
    //                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //                     <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
    //                         <h1 className="text-4xl font-bold mb-8 text-center">대회 신청</h1>
    //                         {contest && (
    //                             <form onSubmit={handleSubmit} className="space-y-4">
    //                                 <div>
    //                                     <label className="block text-lg font-semibold">신청자 이름</label>
    //                                     <input
    //                                         type="text"
    //                                         name="participant"
    //                                         placeholder="이름을 입력하세요"
    //                                         value={formData.participant}
    //                                         onChange={handleChange}
    //                                         required
    //                                         className="w-full p-2 border border-gray-300 rounded"
    //                                         autoComplete="off"
    //                                     />
    //                                 </div>

    //                                 <div>
    //                                     <label className="block text-lg font-semibold">신청자 이메일</label>
    //                                     <input
    //                                         type="email"
    //                                         name="email"
    //                                         placeholder="이메일을 입력하세요"
    //                                         value={formData.email}
    //                                         onChange={handleChange}
    //                                         required
    //                                         className="w-full p-2 border border-gray-300 rounded"
    //                                         autoComplete="off"
    //                                     />
    //                                 </div>

    //                                 <div>
    //                                     <button
    //                                         type="button"
    //                                         onClick={sendVerificationEmail}
    //                                         className="bg-[#AE81FB] text-white py-2 px-4 rounded"
    //                                     >
    //                                         인증 이메일 발송
    //                                     </button>
    //                                     {isCodeSent && (
    //                                         <p className="text-green-500 mt-2">인증 이메일을 확인하고 링크를 클릭하세요.</p>
    //                                     )}
    //                                 </div>

    //                                 {imagePreview ? (
    //                                     <div className="relative">
    //                                         <img src={imagePreview} alt="이미지 미리보기" className="mt-2 w-full h-auto rounded" />
    //                                         <button
    //                                             type="button"
    //                                             onClick={handleCancelPreview}
    //                                             className="bg-red-500 text-white rounded-full w-6 h-6 absolute top-[10px] right-[10px]"
    //                                         >
    //                                             ✕
    //                                         </button>
    //                                     </div>
    //                                 ) : (
    //                                     <div>
    //                                         <label className="block text-lg font-semibold">아이디어 사진</label>
    //                                         <input
    //                                             type="file"
    //                                             accept="image/*"
    //                                             name="imageUrl"
    //                                             onChange={handleImageChange}
    //                                             required
    //                                             className="w-full p-2 border border-gray-300 rounded"
    //                                         />
    //                                     </div>
    //                                 )}
    //                                 <div>
    //                                     <label className="block text-lg font-semibold">아이디어 제목</label>
    //                                     <input
    //                                         type="text"
    //                                         name="title"
    //                                         placeholder="제목을 입력하세요"
    //                                         value={formData.title}
    //                                         onChange={handleChange}
    //                                         required
    //                                         className="w-full p-2 border border-gray-300 rounded"
    //                                         autoComplete="off"
    //                                     />
    //                                 </div>

    //                                 <div>
    //                                     <label className="block text-lg font-semibold">아이디어 설명</label>
    //                                     <textarea
    //                                         name="description"
    //                                         placeholder="설명을 입력하세요"
    //                                         value={formData.description}
    //                                         onChange={handleChange}
    //                                         className="w-full p-2 border border-gray-300 rounded"
    //                                         autoComplete="off"
    //                                     />
    //                                 </div>

    //                                 {errorMessage && <p className="text-red-500">{errorMessage}</p>}

    //                                 <button
    //                                     type="submit"
    //                                     className="w-full bg-[#AE81FB] text-white py-2 px-4 rounded"
    //                                 >
    //                                     신청하기
    //                                 </button>
    //                             </form>
    //                         )}
    //                         <button
    //                             className="mt-3 bg-red-500 text-white p-2 rounded-lg w-full"
    //                             onClick={toggleModal}
    //                         >
    //                             닫기
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }


"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { db, storage } from "../firebase/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 임포트
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth 임포트

export default function ContestSubmit() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const [isOpen, setIsOpen] = useState(false);
    const [contest, setContest] = useState(null);
    const [formData, setFormData] = useState({
        contestName: "",
        participant: "",
        email: "",
        imageUrl: "",
        title: "",
        description: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchContest = async () => {
            const docRef = doc(db, "contests", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const contestData = docSnap.data();
                setContest(contestData);
                setFormData({ ...formData, contestName: contestData.name });
            } else {
                console.log("해당 대회를 찾을 수 없습니다.");
            }
        };

        const auth = getAuth();
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // 현재 사용자 상태 저장
        });

        if (id) fetchContest();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 사용자 상태 확인
        if (!user) {
            setErrorMessage("사용자가 로그인되지 않았습니다.");
            return;
        }

        try {
            let imageUrl = "";
            // 이미지가 선택되었을 경우 Firebase Storage에 업로드
            if (image) {
                const storageRef = ref(storage, `contestImages/${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef); // 업로드한 이미지의 URL 가져오기
            }

            // Firestore에 데이터 저장
            await addDoc(collection(db, "contestApplications"), { 
                ...formData, 
                contestId: id,
                imageUrl, // 이미지 URL을 Firestore에 저장
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            setErrorMessage("신청을 제출하는 중 오류가 발생했습니다.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-6 text-green-500">
                <h1 className="text-3xl font-bold">신청이 완료되었습니다!</h1>
                <p className="mt-4 font-bold">대회 신청을 성공적으로 완료했습니다. 감사합니다.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-center">
                <button
                    onClick={toggleModal}
                    className="bg-[#AE81FB] text-white text-[25px] font-bold rounded-md p-2 relative top-[5px] mb-5"
                >
                    참가하기
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
                        <h1 className="text-4xl font-bold mb-8 text-center">대회 신청</h1>
                        {contest && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-lg font-semibold">신청자 이름</label>
                                    <input
                                        type="text"
                                        name="participant"
                                        placeholder="이름을 입력하세요"
                                        value={formData.participant}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold">신청자 이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="이메일을 입력하세요"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                        autoComplete="off"
                                    />
                                </div>

                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="이미지 미리보기" className="mt-2 w-full h-auto rounded" />
                                        <button
                                            type="button"
                                            onClick={handleCancelPreview}
                                            className="bg-red-500 text-white rounded-full w-6 h-6 absolute top-[10px] right-[10px]"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-lg font-semibold">아이디어 사진</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="imageUrl"
                                            onChange={handleImageChange}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-lg font-semibold">아이디어 제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="제목을 입력하세요"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold">아이디어 설명</label>
                                    <textarea
                                        name="description"
                                        placeholder="설명을 입력하세요"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        autoComplete="off"
                                    />
                                </div>

                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                                <button
                                    type="submit"
                                    className="w-full bg-[#AE81FB] text-white py-2 px-4 rounded"
                                >
                                    신청하기
                                </button>
                            </form>
                        )}
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
