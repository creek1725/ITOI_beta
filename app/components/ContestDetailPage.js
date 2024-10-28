"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import Link from "next/link";
import ShareButton from "./shareButton";
import ConSubmit from "./ConSubmit"

export default function ContestDetailPage() {
    const [contest, setContest] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    useEffect(() => {
        const fetchUserNames = async () => {
            if (!auth.currentUser) return;

            try {
                const currentUser = auth.currentUser;
                const userNames = currentUser.displayName;
                setDisplayName(userNames);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };

        fetchUserNames();
    }, []);

    useEffect(() => {
        const fetchContest = async () => {
            if (id) {
                const docRef = doc(db, "contests", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContest(docSnap.data());
                } else {
                    console.log("해당 문서가 없습니다.");
                }
            }
        };
        fetchContest();
    }, [id]);

    if (!contest) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/contest">&lt;</Link>
            <div>
                <div className="flex justify-center relative bottom-[30px]">
                    <div className="text-[40px] text-[#AE81FB] font-bold relative top-[36px] mr-1">{contest.name}</div>
                    <ShareButton />
                </div>
                <div className="flex justify-center">
                    {contest.imageUrl && (
                        <img className="w-[400px] h-[400px] relative top-[20px] rounded-[20px] z-[-10]" src={contest.imageUrl} alt={contest.title} />
                    )}
                </div>
                <div className="flex justify-center">
                    <div className="font-bold relative top-[90px] break-words">
                        <div className="text-[20px] max-w-[330px] mb-10">
                            <span className="text-[#AE81FB]">대회일정:</span> {contest.stDate}~{contest.fiDate}
                        </div>
                        <div className="text-[20px] max-w-[330px] mb-10">
                            <span className="text-[#AE81FB]">모집대상:</span> {contest.participant}
                        </div>
                        <div className="text-[20px] max-w-[330px] mb-10">
                            <span className="text-[#AE81FB]">활동내용:</span> {contest.description}
                        </div>
                        <ConSubmit />
                    </div>
                </div>
            </div>
        </div>
    );
}



