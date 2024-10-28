// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { db } from '../firebase/firebase'; // Firebase Firestore 추가
// import { collection, doc, addDoc, getDocs, deleteDoc, query, where, updateDoc, getDoc, setDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// function GPTChat() {
//     const [prompt, setPrompt] = useState('');
//     const [response, setResponse] = useState('');
//     const [responseHistory, setResponseHistory] = useState([]);
//     const [isHistoryVisible, setIsHistoryVisible] = useState(false);
//     const [user, setUser] = useState(null);
//     const [usageCount, setUsageCount] = useState(0); // 사용 횟수 상태 추가
//     const maxUsagePerDay = 20; // 하루 최대 사용 횟수

//     useEffect(() => {
//         const auth = getAuth();
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//             if (currentUser) {
//                 fetchHistory(currentUser.uid);  // 기록 가져오기
//                 checkUsageCount(currentUser.uid);  // 사용 횟수 확인
//             }
//         });
//         return () => unsubscribe();
//     }, []);

//     // Firestore에서 기록 불러오기
//     const fetchHistory = async (uid) => {
//         const q = query(collection(db, 'gptResponses'), where('uid', '==', uid));
//         const querySnapshot = await getDocs(q);
//         const fetchedHistory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setResponseHistory(fetchedHistory);
//     };

//     // Firestore에서 사용 횟수 확인
//     const checkUsageCount = async (uid) => {
//         const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD 형식)
//         const usageDocRef = doc(db, 'usageCounts', uid);
//         const docSnap = await getDoc(usageDocRef);

//         if (docSnap.exists()) {
//             const data = docSnap.data();
//             if (data.date === today) {
//                 setUsageCount(data.count); // 오늘의 호출 횟수 설정
//             } else {
//                 // 날짜가 다르면 호출 횟수를 0으로 초기화
//                 await setDoc(usageDocRef, { date: today, count: 0 });
//                 setUsageCount(0);
//             }
//         } else {
//             // 문서가 없으면 새로 생성
//             await setDoc(usageDocRef, { date: today, count: 0 });
//             setUsageCount(0);
//         }
//     };

//     // Firestore에 기록 저장
//     const saveResponseToFirestore = async (gptResponse) => {
//         if (user) {
//             await addDoc(collection(db, 'gptResponses'), {
//                 uid: user.uid,
//                 response: gptResponse,
//                 timestamp: new Date(),
//             });
//             fetchHistory(user.uid);  // 기록 다시 불러오기
//         }
//     };

//     // Firestore에 사용 횟수 업데이트
//     const updateUsageCount = async () => {
//         const usageDocRef = doc(db, 'usageCounts', user.uid);
//         await updateDoc(usageDocRef, {
//             count: usageCount + 1,
//         });
//         setUsageCount(usageCount + 1); // 로컬 상태 업데이트
//     };

//     // GPT API 호출 함수
//     const callGPTAPI = async (e) => {
//         e.preventDefault();

//         if (usageCount >= maxUsagePerDay) {
//             alert(`오늘의 사용 한도(${maxUsagePerDay}회)를 초과했습니다.`);
//             return;
//         }

//         try {
//             const res = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ prompt }),
//             });

//             const data = await res.json();
//             const gptResponse = data.content;
//             setResponse(gptResponse);
//             setResponseHistory((prevHistory) => [gptResponse, ...prevHistory]);

//             // Firestore에 기록 저장
//             saveResponseToFirestore(gptResponse);
//             // 사용 횟수 업데이트
//             updateUsageCount();
//         } catch (error) {
//             console.error('Error calling GPT API:', error);
//         }
//     };

//     // Firestore에서 기록 삭제
//     const deleteResponse = async (id) => {
//         try {
//             await deleteDoc(doc(db, 'gptResponses', id));
//             setResponseHistory(responseHistory.filter((item) => item.id !== id));  // 로컬에서도 기록 삭제
//         } catch (error) {
//             console.error('Error deleting response:', error);
//         }
//     };

//     // 응답 기록 표시/숨기기 토글 함수
//     const toggleHistoryVisibility = () => {
//         setIsHistoryVisible(!isHistoryVisible);
//     };

//     return (
//         <div>
//             <div>
//                 <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/">&lt;</Link>
//                 <div className="text-black font-bold text-[50px] italic text-center">Brainstorm</div>
//             </div>

//             <form>
//                 <div className='flex justify-center mt-10'>
//                     <div className='relative'>
//                         <div className='w-[300px] max-w-[350px] bg-[#ede9fe] border-[2px] border-[#AE81FB] rounded p-5'>
//                             <span className='text-[#AE81FB] text-[30px] font-bold italic'>idea:</span>
//                             <span className='font-bold pl-3'>
//                                 {response || "아이디어가 있으신가요?"}
//                             </span>
//                         </div>
//                         <input
//                             className='w-full h-[50px] bg-[#ede9fe] border-[2px] border-[#AE81FB] rounded placeholder:relative placeholder:left-[10px] outline-none mt-4'
//                             value={prompt}
//                             onChange={(e) => setPrompt(e.target.value)}
//                             placeholder="아이디어를 입력하세요"
//                             maxLength={500}
//                         />
//                         <button 
//                             type='submit' 
//                             className='w-full bg-[#AE81FB] text-black font-bold rounded mt-2 p-2' 
//                             onClick={callGPTAPI}
//                             disabled={usageCount >= maxUsagePerDay}
//                         >
//                             Send
//                         </button>
//                         {usageCount >= maxUsagePerDay && (
//                             <p className="text-red-500 text-center mt-2">
//                                 오늘의 사용 한도를 초과했습니다.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </form>

//             {/* 응답 기록 표시/숨기기 버튼 */}
//             <div className="mt-10 text-center">
//                 <button 
//                     className="text-[#AE81FB] text-[20px] font-bold cursor-pointer"
//                     onClick={toggleHistoryVisibility}
//                 >
//                     {isHistoryVisible ? '▲' : '▼'} 기록 {isHistoryVisible ? '숨기기' : '보기'}
//                 </button>
//             </div>

//             {/* 응답 기록 표시 */}
//             {isHistoryVisible && (
//                 <div className="mt-4 flex flex-col items-center">
//                     {responseHistory.length > 0 ? (
//                         responseHistory.map((res, index) => (
//                             <div key={res.id || index}>
//                                 <div className="w-[300px] max-w-[350px] border-[1px] bg-[#ede9fe] border-[#AE81FB] rounded p-3 mt-2 flex justify-between items-center">
//                                     <div>
//                                         <span className="text-[#AE81FB] font-bold">{index + 1}:</span>
//                                         <span className="text-black pl-2 font-bold">{res.response}</span>
//                                     </div>
//                                 </div>
//                                 <div
//                                     onClick={() => deleteResponse(res.id)}
//                                     className="inline-block bg-red-500 text-white p-1 rounded relative bottom-[28px] left-[272px]"
//                                 >
//                                     <img className='w-[20px] h-[20px]' src='/trashCan.png' />
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center text-gray-500 relative top-20">기록된 아이디어가 없습니다.</div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default GPTChat;



"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../firebase/firebase'; // Firebase Firestore 추가
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function GPTChat() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [responseHistory, setResponseHistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [usageCount, setUsageCount] = useState(0); // 사용 횟수 상태 추가
    const maxUsagePerDay = 20; // 하루 최대 사용 횟수

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchHistory(currentUser.uid);  // 기록 가져오기
                checkUsageCount(currentUser.uid);  // 사용 횟수 확인
            }
        });
        return () => unsubscribe();
    }, []);

    // Firestore에서 기록 불러오기
    const fetchHistory = async (uid) => {
        const q = query(collection(db, 'gptResponses'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        const fetchedHistory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResponseHistory(fetchedHistory);
    };

    // Firestore에서 사용 횟수 확인
    const checkUsageCount = async (uid) => {
        const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD 형식)
        const usageDocRef = doc(db, 'usageCounts', uid);
        const docSnap = await getDoc(usageDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.date === today) {
                setUsageCount(data.count); // 오늘의 호출 횟수 설정
            } else {
                // 날짜가 다르면 호출 횟수를 0으로 초기화
                await setDoc(usageDocRef, { date: today, count: 0 });
                setUsageCount(0);
            }
        } else {
            // 문서가 없으면 새로 생성
            await setDoc(usageDocRef, { date: today, count: 0 });
            setUsageCount(0);
        }
    };

    // Firestore에 기록 저장
    const saveResponseToFirestore = async (gptResponse) => {
        if (user) {
            await addDoc(collection(db, 'gptResponses'), {
                uid: user.uid,
                response: gptResponse,
                timestamp: new Date(),
            });
            fetchHistory(user.uid);  // 기록 다시 불러오기
        }
    };

    // Firestore에 사용 횟수 업데이트
    const updateUsageCount = async () => {
        const usageDocRef = doc(db, 'usageCounts', user.uid);
        await updateDoc(usageDocRef, {
            count: usageCount + 1,
        });
        setUsageCount(usageCount + 1); // 로컬 상태 업데이트
    };

    // GPT API 호출 함수
    const callGPTAPI = async (e) => {
        e.preventDefault();

        if (usageCount >= maxUsagePerDay) {
            alert(`오늘의 사용 한도(${maxUsagePerDay}회)를 초과했습니다.`);
            return;
        }

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            const gptResponse = data.content;
            setResponse(gptResponse);
            setResponseHistory((prevHistory) => [gptResponse, ...prevHistory]);

            // Firestore에 기록 저장
            saveResponseToFirestore(gptResponse);
            // 사용 횟수 업데이트
            updateUsageCount();
        } catch (error) {
            console.error('Error calling GPT API:', error);
        }
    };

    // Firestore에서 기록 삭제
    const deleteResponse = async (id) => {
        try {
            await deleteDoc(doc(db, 'gptResponses', id));
            setResponseHistory(responseHistory.filter((item) => item.id !== id));  // 로컬에서도 기록 삭제
        } catch (error) {
            console.error('Error deleting response:', error);
        }
    };

    // 응답 기록 표시/숨기기 토글 함수
    const toggleHistoryVisibility = () => {
        setIsHistoryVisible(!isHistoryVisible);
    };

    return (
        <div>
            <div>
                <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/">&lt;</Link>
                <div className="text-black font-bold text-[50px] italic text-center">Brainstorm</div>
            </div>

            <form>
                <div className='flex justify-center mt-10'>
                    <div className='relative'>
                        <div className='w-[300px] max-w-[350px] bg-[#ede9fe] border-[2px] border-[#AE81FB] rounded p-5'>
                            <span className='text-[#AE81FB] text-[30px] font-bold italic'>idea:</span>
                            <span className='font-bold pl-3'>
                                {response || "아이디어가 있으신가요?"}
                            </span>
                        </div>
                        <input
                            className='w-full h-[50px] bg-[#ede9fe] border-[2px] border-[#AE81FB] rounded placeholder:relative placeholder:left-[10px] outline-none mt-4'
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="아이디어를 입력하세요"
                            maxLength={500}
                        />
                        <button 
                            type='submit' 
                            className='w-full bg-[#AE81FB] text-black font-bold rounded mt-2 p-2' 
                            onClick={callGPTAPI}
                            disabled={usageCount >= maxUsagePerDay}
                        >
                            Send
                        </button>
                        {usageCount >= maxUsagePerDay && (
                            <p className="text-red-500 text-center mt-2">
                                오늘의 사용 한도를 초과했습니다.
                            </p>
                        )}
                    </div>
                </div>
            </form>

            {/* 응답 기록 표시/숨기기 버튼 */}
            <div className="mt-10 text-center">
                <button 
                    className="text-[#AE81FB] text-[20px] font-bold cursor-pointer"
                    onClick={toggleHistoryVisibility}
                >
                    {isHistoryVisible ? '▲' : '▼'} 기록 {isHistoryVisible ? '숨기기' : '보기'}
                </button>
            </div>

            {/* 응답 기록 표시 */}
            {isHistoryVisible && (
                <div className="mt-4 flex flex-col items-center">
                    {responseHistory.length > 0 ? (
                        responseHistory.map((res, index) => (
                            <div key={res.id || index}>
                                <div className="w-[300px] max-w-[350px] border-[1px] bg-[#ede9fe] border-[#AE81FB] rounded p-3 mt-2 flex justify-between items-center">
                                    <div>
                                        <span className="text-[#AE81FB] font-bold">{index + 1}:</span>
                                        <span className="text-black pl-2 font-bold">{res.response}</span>
                                    </div>
                                </div>
                                <div
                                    onClick={() => deleteResponse(res.id)}
                                    className="inline-block bg-red-500 text-white p-1 rounded relative bottom-[28px] left-[272px]"
                                >
                                    <img className='w-[20px] h-[20px]' src='/trashCan.png' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 relative top-20">기록된 아이디어가 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GPTChat;
