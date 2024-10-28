"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db, storage, auth } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PostPage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("")
    const [purpose, setPurpose] = useState("")
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(""); // 미리보기 이미지 URL
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();


    // 이미지 파일 선택 처리 및 미리보기 생성
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            // FileReader를 사용해 이미지 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 미리보기 URL 설정
            };
            reader.readAsDataURL(file);
        }
    };
    const handleCancelPreview = () => {
        setImage(null);
        setImagePreview("");
    };

    // 글과 사진 업로드 처리
    const handleSubmit = async (e) => {
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

            const postData = {
                title,
                subtitle,
                purpose,
                description,
                imageUrl,
                createdAt: new Date(),
                userId: currentUser.uid, // UID 저장
            };

            await addDoc(collection(db, "posts"), postData); // Firestore에 데이터 저장

            setLoading(false);
            router.push("/idea");
        } catch (error) {
            console.error("Error uploading post:", error);
            setError("글과 사진을 업로드하는 데 실패했습니다.");
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/profile">&lt;</Link>
                <div className="text-black font-bold text-[80px] italic text-center relative bottom-[20px]">post</div>
            </div>
            <div className="relative bottom-[20px]">
            <form onSubmit={handleSubmit}>
                {imagePreview ? (
                    <div className="flex justify-center">
                        <img
                            src={imagePreview}
                            alt="미리보기"
                            className="mt-5 w-[300px] h-[300px] rounded-[20px] relative left-[12px]"
                        />
                        <button
                            type="button"
                            onClick={handleCancelPreview}
                            className="bg-red-500 text-white rounded-full w-6 h-6 relative top-[10px] rigth-[10px]"
                        >
                            <div className="relative bottom-[1px]">✕</div>
                        </button>
                    </div>
                ) : (
                    <div className="text-center mt-5">
                        <input id="upload" className="hidden" type="file" accept="image/* required" onChange={handleImageChange} />
                        <label htmlFor="upload" className="inline-flex justify-center relative top-0 left-[35px]" >
                            <img className="w-[50px] h-[50px] cursor-pointer" src="/camera.png" />                         
                        </label>
                        <div className="inline-flex justify-center">
                            <div className="w-[70px] h-[70px] border border-[#AE81FB] rounded-full z-[-10] relative top-3 right-[25px]"></div>
                        </div>
                    </div>
                )}
                    <div className="text-center mt-10 mb-[20px]">
                        <label className="block text-[20px] font-bold relative right-[125px]">제목</label>
                        <input
                            type="text"
                            className="border p-2 rounded-md w-[300px] bg-[#ede9fe] border-solid border-[#AE81FB]"
                            placeholder="아이디어 제목을 입력하세요 (6글자)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={6}
                            minLength={2}
                            required
                        />
                    </div>
                    <div className="text-center mt-10 mb-[20px]">
                        <label className="block text-[20px] font-bold relative right-[95px]">간단한 설명</label>
                        <input
                            type="text"
                            className="border p-2 rounded-md w-[300px] bg-[#ede9fe] border-solid border-[#AE81FB]"
                            placeholder="간단한 설명을 입력하세요 (10글자)"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            maxLength={10}
                            minLength={2}
                            required
                        />
                    </div>
                    <div className="text-center mt-10 mb-[20px]">
                        <label className="block text-[20px] font-bold relative right-[85px]">아이디어 목적</label>
                        <textarea
                            type="text"
                            className="border p-2 rounded-md w-[300px] bg-[#ede9fe] border-solid border-[#AE81FB]"
                            placeholder="아이디어 목적을 입력하세요"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-center mt-10">
                        <label className="block text-[20px] font-bold relative right-[85px]">아이디어 설명</label>
                        <textarea
                            className="border p-2 rounded-md w-[300px] bg-[#ede9fe] border-solid border-[#AE81FB]"
                            placeholder="자세한 설명을 입력하세요"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="text-center mt-10">
                        <button type="submit" className="bg-[#AE81FB] w-[300px] h-[50px] mb-[20px] rounded-md text-[20px] font-bold" disabled={loading}>
                            {loading ? "업로드 중..." : "업로드"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



