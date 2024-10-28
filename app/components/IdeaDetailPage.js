"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import Link from "next/link";
import ShareButton from "./shareButton";

export default function IdeaDetailPage() {
    const [idea, setIdea] = useState(null);
    const [uploaderName, setUploaderName] = useState(""); // 업로더 이름 저장
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    // 아이디어 가져오기 및 업로더 이름 가져오기
    useEffect(() => {
        const fetchIdea = async () => {
            if (id) {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const ideaData = docSnap.data();
                    setIdea(ideaData);

                    // userId로 업로더 이름 가져오기
                    if (ideaData.userId) {
                        const userDocRef = doc(db, "users", ideaData.userId);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            setUploaderName(userDocSnap.data().name || "user");
                        } else {
                            console.log("업로더 정보를 찾을 수 없습니다.");
                        }
                    }
                } else {
                    console.log("해당 문서가 없습니다.");
                }
            }
        };
        fetchIdea();
    }, [id]);

    if (!idea) {
        return <div>로딩 중...</div>;
    }

    return (
        <div> 
            <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/">&lt;</Link>
            <div>
                <div className="flex justify-center relative bottom-[30px]">
                    <div className="text-[40px] text-[#AE81FB] font-bold relative top-[36px] mr-1">{idea.title}</div>
                    <ShareButton />
                </div>
                <div className="flex justify-center">
                    {idea.imageUrl && (
                        <img className="w-[400px] h-[400px] relative top-[20px] rounded-[20px] z-[-10]" src={idea.imageUrl} alt={idea.title} />
                    )}
                </div>
                <div className="flex justify-center text-[20px] font-bold mt-10">
                    <div>업로더: {uploaderName}</div> {/* 업로더 이름 표시 */}
                </div>
                <div>
                    <div className="flex justify-center w-full text-[40px] font-bold relative top-[50px] mb-4">
                        <div className="absolute top-[20px] left-[20px] italic">💡idea</div>
                        <div className="text-[25px] max-w-[330px] relative top-[80px] mb-[50px] break-words">
                            {idea.description}
                        </div>
                    </div>
                    <div className="flex justify-center w-full text-[40px] font-bold relative top-[100px] mb-4">
                        <div className="absolute top-[20px] left-[20px] italic">📄purpose</div>
                        <div className="text-[25px] max-w-[330px] relative top-[90px] mb-[200px] break-words">
                            {idea.purpose}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}