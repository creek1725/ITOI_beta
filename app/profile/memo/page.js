

// "use client";
// import { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase';
// import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
// import Link from 'next/link';

// const Memo = () => {
//     const [memo, setMemo] = useState('');
//     const [memos, setMemos] = useState([]);

//     // 메모 불러오기
//     useEffect(() => {
//         const unsubscribe = onSnapshot(collection(db, 'memos'), (snapshot) => {
//             const memoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setMemos(memoList);
//         });

//         return () => unsubscribe();
//     }, []);


//     // 메모 추가
//     const addMemo = async () => {
//         if (memo.trim()) {
//             await addDoc(collection(db, 'memos'), { text: memo });
//             setMemo('');
//         }
//     };

//     // 메모 삭제
//     const deleteMemo = async (id) => {
//         await deleteDoc(doc(db, 'memos', id));
//     };

//     return (
//         <div>
//             <div>
//                 <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/profile">&lt;</Link>
//                 <div className="text-black font-bold text-[80px] italic text-center relative bottom-[20px]">memo</div>
//             </div>
//             <div className="flex flex-col items-center min-h-screen p-6">

//                 <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
//                     <textarea
//                         className="w-full h-40 border border-gray-300 p-2 rounded mb-4 resize-none"
//                         placeholder="메모를 입력하세요..."
//                         value={memo}
//                         onChange={(e) => setMemo(e.target.value)}
//                     />
//                     <button
//                         onClick={addMemo}
//                         className="w-full bg-[#AE81FB] text-black font-bold p-2 rounded hover:bg-blue-600 transition"
//                     >
//                         메모 추가
//                     </button>
//                 </div>

//                 {/* 모든 메모 표시 */}
//                 <div className="mt-10 text-[25px] font-bold italic">idea memo</div>
//                 <ul className="mt-2 w-full max-w-md">
//                     {memos.length > 0 ? (
//                         memos.map((m) => (
//                                 <li key={m.id} className="flex justify-between items-center bg-white border border-gray-300 rounded p-2 mb-2">
//                                     <span>{m.text}</span>
//                                     <button
//                                         onClick={() => deleteMemo(m.id)}
//                                         className="text-red-500 hover:text-red-700 transition"
//                                     >
//                                         삭제
//                                     </button>
//                                 </li>
//                     ))
//                 ) : (
//                     <div className="text-center relative top-[80px]">아직 메모가 없습니다.</div>
//                 )}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Memo;

"use client";
import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Firebase 인증 사용
import Link from 'next/link';

const Memo = () => {
    const [memo, setMemo] = useState('');
    const [memos, setMemos] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser; // 현재 로그인된 사용자 가져오기

    // 메모 불러오기
    useEffect(() => {
        if (!user) return; // 사용자 로그인 확인

        const memosRef = collection(db, 'memos');
        const q = query(memosRef, where("uid", "==", user.uid)); // UID로 메모 필터링

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const memoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMemos(memoList);
        });

        return () => unsubscribe();
    }, [user]);

    // 메모 추가
    const addMemo = async () => {
        if (memo.trim() && user) {
            await addDoc(collection(db, 'memos'), { text: memo, uid: user.uid }); // UID와 함께 메모 저장
            setMemo('');
        }
    };

    // 메모 삭제
    const deleteMemo = async (id) => {
        await deleteDoc(doc(db, 'memos', id));
    };

    return (
        <div>
            <div>
                <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/profile">&lt;</Link>
                <div className="text-black font-bold text-[80px] italic text-center relative bottom-[20px]">memo</div>
            </div>
            <div className="flex flex-col items-center min-h-screen p-6">
                <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                    <textarea
                        className="w-full h-40 border border-gray-300 p-2 rounded mb-4 resize-none"
                        placeholder="메모를 입력하세요..."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                    />
                    <button
                        onClick={addMemo}
                        className="w-full bg-[#AE81FB] text-black font-bold p-2 rounded"
                    >
                        메모 추가
                    </button>
                </div>

                {/* 모든 메모 표시 */}
                <div className="mt-10 text-[25px] font-bold italic">idea memo</div>
                <ul className="mt-2 w-full max-w-md">
                    {memos.length > 0 ? (
                        memos.map((m) => (
                            <li key={m.id} className="flex justify-between items-center bg-white border border-gray-300 rounded p-2 mb-2">
                                <span>{m.text}</span>
                                <button
                                    onClick={() => deleteMemo(m.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    삭제
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="text-center relative top-[80px]">아직 메모가 없습니다.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Memo;
