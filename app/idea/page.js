// "use client";
// import { useState, useEffect } from "react";
// import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore 관련 함수들
// import { db } from "../firebase/firebase";
// import Link from "next/link";

// export default function IdeaPage() {
//     const [ideas, setIdeas] = useState([]);
//     const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

//     // 모든 아이디어를 불러오는 useEffect
//     useEffect(() => {
//         const fetchPosts = async () => {
//             const postsCollection = collection(db, "posts");
//             const postsSnapshot = await getDocs(postsCollection);
//             const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setIdeas(postsList);
//         };
//         fetchPosts();
//     }, []);

//     // 검색 기능
//     const handleSearch = async (e) => {
//         e.preventDefault(); // 폼 제출 방지
        
//         if (!searchTerm.trim()) {
//             // 검색어가 비어있을 경우 모든 아이디어 다시 불러오기
//             const postsCollection = collection(db, "posts");
//             const postsSnapshot = await getDocs(postsCollection);
//             const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setIdeas(postsList);
//             return;
//         }

//         // Firestore에서 검색어가 포함된 아이디어만 불러오기
//         const postsCollection = collection(db, "posts");
//         const q = query(
//             postsCollection, 
//             where("title", ">=", searchTerm), 
//             where("title", "<=", searchTerm + "\uf8ff") // 검색어 범위 설정
//         );
//         const postsSnapshot = await getDocs(q);
//         const filteredPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setIdeas(filteredPosts);
//     };

//     return (
//         <div>
//             <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[0px]" href="/">&lt;</Link>
//             <div className="text-black font-bold text-[80px] italic text-center">idea</div>
            
//             <form onSubmit={handleSearch}>
//                 <input
//                     className="text-[20px] border-[2px] border-solid border-black bg-[#AE81FB] rounded-[50px] w-[250px] h-[50px] relative top-[60px] left-[5px] outline-black placeholder:text-[#E4D4FF] placeholder:font-bold placeholder:absolute placeholder:left-[10px]"
//                     type="text"
//                     placeholder="idea search"
//                     value={searchTerm} // 검색어 상태 연결
//                     onChange={e => setSearchTerm(e.target.value)} // 검색어 업데이트
//                     maxLength={6}
//                 />
//                 <button type="submit" className="relative top-[65px] right-[40px] ">
//                     <img className="w-[30px] h-[30px]" src="search.png" alt="검색" />
//                 </button>
//                 {/* */}
//             </form>

//             {ideas.length > 0 ? (
//                 ideas.map((idea) => (
//                     <div key={idea.id} className="w-full h-[300px] border border-[#AE81FB] relative top-[80px]">
//                         {idea.imageUrl && (
//                             <img className="w-[200px] h-[200px] rounded-[20px] absolute top-[50px] left-[20px]" src={idea.imageUrl || "default.png"} alt={idea.title} />
//                         )}
//                         <Link href={`/idea/${idea.id}`} className="text-[30px] font-bold absolute top-[100px] left-[240px]">{idea.title}</Link>
//                         <div className="text-[20px] absolute top-[160px] left-[245px]">{idea.subtitle}</div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="text-center relative top-[250px]">아직 아이디어가 없습니다.</div>
//             )}
//         </div>
//     );
// }


"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore 관련 함수들
import { db } from "../firebase/firebase";
import Link from "next/link";

export default function IdeaPage() {
    const [ideas, setIdeas] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    // 모든 아이디어를 불러오는 useEffect
    useEffect(() => {
        const fetchPosts = async () => {
            const postsCollection = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setIdeas(postsList);
        };
        fetchPosts();
    }, []);

    // 검색 기능
    const handleSearch = async (e) => {
        e.preventDefault(); // 폼 제출 방지
        
        if (!searchTerm.trim()) {
            // 검색어가 비어있을 경우 모든 아이디어 다시 불러오기
            const postsCollection = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setIdeas(postsList);
            return;
        }

        // Firestore에서 검색어가 포함된 아이디어만 불러오기
        const postsCollection = collection(db, "posts");
        const q = query(
            postsCollection, 
            where("title", ">=", searchTerm), 
            where("title", "<=", searchTerm + "\uf8ff") // 검색어 범위 설정
        );
        const postsSnapshot = await getDocs(q);
        const filteredPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setIdeas(filteredPosts);
    };

    return (
        <div>
            <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/">&lt;</Link>
            <div className="text-black font-bold text-[80px] italic text-center">idea</div>
            
            <form onSubmit={handleSearch}>
                <input
                    className="text-[20px] border-[2px] border-solid border-black bg-[#AE81FB] rounded-[50px] w-[250px] h-[50px] relative top-[60px] left-[5px] outline-black placeholder:text-[#E4D4FF] placeholder:font-bold placeholder:absolute placeholder:left-[10px]"
                    type="text"
                    placeholder="idea search"
                    value={searchTerm} // 검색어 상태 연결
                    onChange={e => setSearchTerm(e.target.value)} // 검색어 업데이트
                    maxLength={6}
                />
                <button type="submit" className="relative top-[65px] right-[40px] ">
                    <img className="w-[30px] h-[30px]" src="search.png" alt="검색" />
                </button>
            </form>

            {ideas.length > 0 ? (
                ideas.map((idea) => (
                    <div key={idea.id} className="w-full h-[300px] border border-[#AE81FB] relative top-[80px] flex flex-col">
                        {idea.imageUrl && (
                            <img className="w-[200px] h-[200px] rounded-[20px] absolute top-[50px] left-[20px]" src={idea.imageUrl || "default.png"} alt={idea.title} />
                        )}
                        <Link href={`/idea/${idea.id}`} className="text-[30px] font-bold absolute top-[100px] left-[240px]">{idea.title}</Link>
                        <div className="text-[20px] absolute top-[160px] left-[245px]">{idea.subtitle}</div>
                        <div className="text-[16px] absolute top-[270px] right-[10px] text-gray-500">
                            {new Date(idea.createdAt.seconds * 1000).toLocaleDateString("ko-KR")} {/* 날짜 표시 */}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center relative top-[250px]">아직 아이디어가 없습니다.</div>
            )}
        </div>
    );
}


// "use client";
// import { useState, useEffect } from "react";
// import { collection, getDocs, query, orderBy, where } from "firebase/firestore"; // Firestore 관련 함수들
// import { db } from "../firebase/firebase";
// import Link from "next/link";

// export default function IdeaPage() {
//     const [ideas, setIdeas] = useState([]);
//     const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

//     // 모든 아이디어를 불러오는 useEffect
//     useEffect(() => {
//         const fetchPosts = async () => {
//             const postsCollection = collection(db, "posts");
//             const postsQuery = query(postsCollection, orderBy("createdAt", "desc")); // createdAt 기준 내림차순 정렬
//             const postsSnapshot = await getDocs(postsQuery);
//             const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setIdeas(postsList);
//         };
//         fetchPosts();
//     }, []);

//     // 검색 기능
//     const handleSearch = async (e) => {
//         e.preventDefault(); // 폼 제출 방지
        
//         if (!searchTerm.trim()) {
//             // 검색어가 비어있을 경우 모든 아이디어 다시 불러오기
//             const postsCollection = collection(db, "posts");
//             const postsQuery = query(postsCollection, orderBy("createdAt", "desc")); // createdAt 기준 내림차순 정렬
//             const postsSnapshot = await getDocs(postsQuery);
//             const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setIdeas(postsList);
//             return;
//         }

//         // Firestore에서 검색어가 포함된 아이디어만 불러오기
//         const postsCollection = collection(db, "posts");
//         const q = query(
//             postsCollection, 
//             where("title", ">=", searchTerm), 
//             where("title", "<=", searchTerm + "\uf8ff"), // 검색어 범위 설정
//             orderBy("createdAt", "desc") // 검색 결과를 최신 순으로 정렬
//         );
//         const postsSnapshot = await getDocs(q);
//         const filteredPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setIdeas(filteredPosts);
//     };

//     return (
//         <div>
//             <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[0px]" href="/">&lt;</Link>
//             <div className="text-black font-bold text-[80px] italic text-center">idea</div>
            
//             <form onSubmit={handleSearch}>
//                 <input
//                     className="text-[20px] border-[2px] border-solid border-black bg-[#AE81FB] rounded-[50px] w-[250px] h-[50px] relative top-[60px] left-[5px] outline-black placeholder:text-[#E4D4FF] placeholder:font-bold placeholder:absolute placeholder:left-[10px]"
//                     type="text"
//                     placeholder="idea search"
//                     value={searchTerm} // 검색어 상태 연결
//                     onChange={e => setSearchTerm(e.target.value)} // 검색어 업데이트
//                     maxLength={6}
//                 />
//                 <button type="submit" className="relative top-[65px] right-[40px] ">
//                     <img className="w-[30px] h-[30px]" src="search.png" alt="검색" />
//                 </button>
//             </form>

//             {ideas.length > 0 ? (
//                 ideas.map((idea) => (
//                     <div key={idea.id} className="w-full h-[300px] border border-[#AE81FB] relative top-[80px] flex flex-col">
//                         {idea.imageUrl && (
//                             <img className="w-[200px] h-[200px] rounded-[20px] absolute top-[50px] left-[20px]" src={idea.imageUrl || "default.png"} alt={idea.title} />
//                         )}
//                         <Link href={`/idea/${idea.id}`} className="text-[30px] font-bold absolute top-[100px] left-[240px]">{idea.title}</Link>
//                         <div className="text-[20px] absolute top-[160px] left-[245px]">{idea.subtitle}</div>
//                         <div className="text-[16px] absolute top-[270px] right-[10px] text-gray-500">
//                             {new Date(idea.createdAt.seconds * 1000).toLocaleDateString("ko-KR")} {/* 날짜 표시 */}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="text-center relative top-[250px]">아직 아이디어가 없습니다.</div>
//             )}
//         </div>
//     );
// }



