
// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from 'next/navigation';
// import { usePathname } from "next/navigation";
// import { db } from "../../../firebase/firebase";
// import {
//     doc,
//     getDoc,
//     updateDoc,
//     deleteDoc,
//     collection,
//     query,
//     onSnapshot
// } from "firebase/firestore";


// export default function ManageContest() {
//     const pathname = usePathname();
//     const id = pathname.split('/').pop();
//     const router = useRouter();
//     const [competition, setCompetition] = useState(null);
//     const [updatedData, setUpdatedData] = useState({
//         name: "",
//         description: "",
//         link: "",
//     });
//     const [applications, setApplications] = useState([]); // 참가자 정보를 저장할 상태

//     useEffect(() => {
//         const fetchCompetition = async () => {
//             const docRef = doc(db, "contests", id);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const data = docSnap.data();
//                 setCompetition(data);
//                 setUpdatedData({ name: data.name, description: data.description, link: data.link });
//             } else {
//                 console.log("대회 문서를 찾을 수 없습니다.");
//             }
//         };

//         const fetchApplications = async () => {
//             const appQuery = query(collection(db, "contestApplications"));
//             onSnapshot(appQuery, (snapshot) => {
//                 const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setApplications(apps.filter(app => app.contestId === id)); // 해당 대회에 대한 참가자만 필터링
//             });
//         };

//         if (id) {
//             fetchCompetition();
//             fetchApplications(); // 대회 신청 정보 불러오기
//         }
//     }, [id]);

//     const handleUpdate = async () => {
//         try {
//             const docRef = doc(db, "contests", id);
//             await updateDoc(docRef, updatedData);
//             alert("대회 정보가 수정되었습니다.");
//         } catch (error) {
//             console.error("대회 수정 중 오류 발생: ", error);
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             await deleteDoc(doc(db, "contests", id));
//             router.push("/contest");
//         } catch (error) {
//             console.error("대회 삭제 중 오류 발생: ", error);
//         }
//     };

//     const removeParticipant = async (participantId) => {
//         try {
//             const docRef = doc(db, "contestApplications", participantId); // 참가자 문서 참조
//             await deleteDoc(docRef); // 참가자 삭제
//             setApplications(applications.filter(app => app.id !== participantId)); // 로컬 상태에서 삭제
//             alert("참가자가 삭제되었습니다.");
//         } catch (error) {
//             console.error("참가자 삭제 중 오류 발생: ", error);
//         }
//     };

//     return (
//         <div className="p-6">
//             <div>
//                 <Link
//                     className="text-[#AE81FB] text-[40px] font-bold no-underline"
//                     href="/contest"
//                 >
//                     &lt;
//                 </Link>
//                 <div className="text-black text-[40px] font-bold text-center">
//                     Contest Manage
//                 </div>
//             </div>
//             {competition ? (
//                 <div className="relative top-[50px]">
//                     <div>
//                         <label className="block text-lg font-semibold mb-2">대회 이름</label>
//                         <input
//                             type="text"
//                             value={updatedData.name}
//                             onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
//                             className="w-full p-2 border border-gray-300 rounded mb-3"
//                         />
//                         <label className="block text-lg font-semibold mb-2">대회 설명</label>
//                         <textarea
//                             value={updatedData.description}
//                             onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
//                             className="w-full p-2 border border-gray-300 rounded mb-3"
//                         />
//                         <button
//                             onClick={handleUpdate}
//                             className="bg-[#AE81FB] text-white px-4 py-2 rounded mb-4 mr-2"
//                         >
//                             대회 정보 수정
//                         </button>
//                         <button
//                             onClick={handleDelete}
//                             className="bg-red-500 text-white px-4 py-2 rounded"
//                         >
//                             대회 삭제
//                         </button>
//                     </div>
//                     <h3 className="text-xl font-bold mt-6">신청자 관리&평가</h3>
//                     <ul>
//                         {applications.map((application) => (
//                             <li key={application.id} className="border-[2px] border-[#AE81FB] p-4 mb-4 rounded shadow break-words">
//                                 {application.imageUrl && (
//                                     <img src={application.imageUrl} alt="참가자 이미지" className="w-[200px] h-[200px] rounded mt-2" />
//                                 )}
//                                 <h4 className="text-lg font-semibold ">{application.title}</h4>
//                                 <div>이름: {application.participant}</div>
//                                 <div>이메일: {application.email}</div>
//                                 <div>설명: {application.description}</div>
//                                 <button
//                                     onClick={() => removeParticipant(application.id)}
//                                     className="bg-red-500 text-white px-2 py-1 rounded mt-2"
//                                 >
//                                     삭제
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <p>대회 정보를 불러오는 중...</p>
//             )}
//         </div>
//     );
// }


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { db } from "../../../firebase/firebase";
import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    onSnapshot
} from "firebase/firestore";

export default function ManageContest() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();
    const [competition, setCompetition] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: "",
        description: "",
        link: "",
    });
    const [applications, setApplications] = useState([]); // 참가자 정보를 저장할 상태

    useEffect(() => {
        const fetchCompetition = async () => {
            const docRef = doc(db, "contests", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCompetition(data);
                setUpdatedData({ name: data.name, description: data.description, link: data.link });
            } else {
                console.log("대회 문서를 찾을 수 없습니다.");
            }
        };

        const fetchApplications = async () => {
            const appQuery = query(collection(db, "contestApplications"));
            onSnapshot(appQuery, (snapshot) => {
                const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(apps.filter(app => app.contestId === id)); // 해당 대회에 대한 참가자만 필터링
            });
        };

        if (id) {
            fetchCompetition();
            fetchApplications(); // 대회 신청 정보 불러오기
        }
    }, [id]);

    const handleUpdate = async () => {
        try {
            const docRef = doc(db, "contests", id);
            // undefined 값을 가진 필드를 제외하여 업데이트할 데이터 준비
            const filteredData = Object.fromEntries(
                Object.entries(updatedData).filter(([_, v]) => v !== undefined)
            );
            await updateDoc(docRef, filteredData);
            alert("대회 정보가 수정되었습니다.");
        } catch (error) {
            console.error("대회 수정 중 오류 발생: ", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "contests", id));
            router.push("/contest");
        } catch (error) {
            console.error("대회 삭제 중 오류 발생: ", error);
        }
    };

    const removeParticipant = async (participantId) => {
        try {
            const docRef = doc(db, "contestApplications", participantId); // 참가자 문서 참조
            await deleteDoc(docRef); // 참가자 삭제
            setApplications(applications.filter(app => app.id !== participantId)); // 로컬 상태에서 삭제
            alert("참가자가 삭제되었습니다.");
        } catch (error) {
            console.error("참가자 삭제 중 오류 발생: ", error);
        }
    };

    return (
        <div>
            <div>
                <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/contest">&lt;</Link>
                <div className="text-black text-[50px] font-bold text-center">Contest Manage</div>
            </div>
            {competition ? (
                <div className="relative top-[50px]">
                    <div>
                        <label className="block text-lg font-semibold mb-2">대회 이름</label>
                        <input
                            type="text"
                            value={updatedData.name}
                            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                            className="w-full p-2 border-[2px] border-[#AE81FB] rounded mb-3 bg-[#ede9fe]"
                        />
                        <label className="block text-lg font-semibold mb-2">대회 설명</label>
                        <textarea
                            value={updatedData.description}
                            onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
                            className="w-full p-2 border-[2px] border-[#AE81FB] rounded mb-3 bg-[#ede9fe]"
                        />
                        <button
                            onClick={handleUpdate}
                            className="bg-[#AE81FB] text-white px-4 py-2 rounded mb-4 mr-2"
                        >
                            대회 정보 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            대회 삭제
                        </button>
                    </div>
                    <h3 className="text-xl font-bold mt-6">신청자 관리&평가</h3>
                    <ul>
                        {applications.map((application) => (
                            <li key={application.id} className="border-[2px] border-[#AE81FB] p-4 mb-4 rounded shadow break-words">
                                {application.imageUrl && (
                                    <img src={application.imageUrl} alt="참가자 이미지" className="w-[200px] h-[200px] rounded mt-2" />
                                )}
                                <h4 className="text-lg font-semibold ">{application.title}</h4>
                                <div>이름: {application.participant}</div>
                                <div>이메일: {application.email}</div>
                                <div>설명: {application.description}</div>
                                <button
                                    onClick={() => removeParticipant(application.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>대회 정보를 불러오는 중...</p>
            )}
        </div>
    );
}
