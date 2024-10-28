// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "../firebase/firebase"; // firebase.js에서 불러옴
// import { updateProfile } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 가져옴
// import Link from "next/link";
// import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import { useRouter } from "next/navigation";

// const ProfilePage = () => {
//   const [displayName, setDisplayName] = useState("");
//   const [photoURL, setPhotoURL] = useState("");
//   const [newDisplayName, setNewDisplayName] = useState("");
//   const [newPhotoFile, setNewPhotoFile] = useState(null); // 파일 객체 저장
//   const [previewPhotoURL, setPreviewPhotoURL] = useState(""); // 미리보기 이미지 URL 상태
//   const [editMode, setEditMode] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
//   const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태
//   const router = useRouter();

//   // 사용자 인증 상태 확인
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setDisplayName(user.displayName || "user");
//         setPhotoURL(user.photoURL || "");
//         console.log("사용자 로그인 상태 확인:", user);
//       } else {
//         console.log("사용자가 로그인되지 않았습니다.");
//         router.push("/login");
//         localStorage.removeItem('token')
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // 이미지 파일 선택 시 미리보기 처리
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPhotoFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewPhotoURL(reader.result); // 미리보기 URL 설정
//       };
//       reader.readAsDataURL(file); // 파일을 데이터 URL로 읽음
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setEditMode(true);

//     if (auth.currentUser) {
//       let updatedPhotoURL = photoURL; // 기존 URL 유지

//       if (newPhotoFile) {
//         const storage = getStorage();
//         const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
//         await uploadBytes(storageRef, newPhotoFile); // Firebase Storage에 파일 업로드
//         updatedPhotoURL = await getDownloadURL(storageRef); // 업로드한 파일의 다운로드 URL 가져오기
//       }

//       updateProfile(auth.currentUser, {
//         displayName: newDisplayName || displayName,
//         photoURL: updatedPhotoURL,
//       })
//         .then(() => {
//           setDisplayName(newDisplayName || displayName);
//           setPhotoURL(updatedPhotoURL);
//           alert("프로필이 업데이트되었습니다.");
//           setEditMode(false);
//         })
//         .catch((error) => {
//           console.error("프로필 업데이트 중 오류 발생:", error);
//         });
//     } else {
//       alert("로그인이 필요합니다.");
//     }
//   };

//   const [posts, setPosts] = useState([]);
//   const [editPostId, setEditPostId] = useState(null); // 수정 중인 게시물 ID 저장
//   const [updatedTitle, setUpdatedTitle] = useState("");
//   const [updatedSubtitle, setUpdatedSubtitle] = useState("");
//   const [postPreviewPhotoURL, setPostPreviewPhotoURL] = useState(""); // 게시물 이미지 미리보기 URL
//   const [newPostPhotoFile, setNewPostPhotoFile] = useState(null); // 게시물 이미지 파일 저장

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       if (!auth.currentUser) return;

//       try {
//         const currentUser = auth.currentUser;
//         const q = query(collection(db, "posts"), where("userId", "==", currentUser.uid));
//         const querySnapshot = await getDocs(q);
//         const userPosts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setPosts(userPosts);
//       } catch (error) {
//         console.error("Error fetching user posts:", error);
//       }
//     };

//     fetchUserPosts();
//   });

//   const handlePostPhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPostPhotoFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPostPreviewPhotoURL(reader.result); // 게시물 이미지 미리보기 URL 설정
//       };
//       reader.readAsDataURL(file);
//     }
//   };


   
//   // 게시물 업데이트 처리 함수
//   const handleUpdatePost = async (postId) => {
//     if (!updatedTitle || !updatedSubtitle) {
//       alert("모든 필드를 입력해주세요.");
//       return;
//     }

//     try {
//       let updatedImageUrl = null;
//       if (newPostPhotoFile) {
//         const storage = getStorage();
//         const imageRef = ref(storage, `postImages/${postId}`); // 게시물 이미지 저장 경로 설정
//         await uploadBytes(imageRef, newPostPhotoFile); // Firebase Storage에 파일 업로드
//         updatedImageUrl = await getDownloadURL(imageRef); // 업로드한 파일의 다운로드 URL 가져오기
//       }
//       const postRef = collection(db, "posts");
//       const postDoc = doc(postRef, postId);
//       await updateDoc(postDoc, {
//         title: updatedTitle,
//         subtitle: updatedSubtitle,
//       });
//       setEditPostId(null); // 수정 모드 종료
//       alert("게시물이 성공적으로 수정되었습니다.");
//     } catch (error) {
//       console.error("게시물 업데이트 중 오류 발생:", error);
//     }
//   };

//   // 게시물 삭제 처리 함수
//   const handleDeletePost = async (postId) => {
//     try {
//       const postRef = doc(db, "posts", postId); // Firestore에서 삭제할 문서 참조
//       await deleteDoc(postRef); // Firestore에서 게시물 삭제
//       setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // 삭제된 게시물 UI에서 제거
//       alert("게시물이 성공적으로 삭제되었습니다.");
//     } catch (error) {
//       console.error("게시물 삭제 중 오류 발생:", error);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setAlertMessage("로그인이 필요합니다."); // 알림 메시지 설정
//       setTimeout(() => {
//         router.push("/login"); // 3초 후 로그인 페이지로 리다이렉트
//       }, 3000);
//     } else {
//       setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
//     }
//   }, [router]);

//   if (!isLoggedIn) {
//     return (
//       <div className="text-center relative top-[200px]">
//         <div className="text-[#AE81FB] font-bold text-[20px]">{alertMessage}</div>
//       </div>
//     ); // 로그인되지 않았을 때 알림 메시지를 보여줌
//   }

//   return (
//     <div>
//       <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/">
//         &lt;
//       </Link>
//       <div className="flex justify-center mb-[20px] relative top-[35px]">
//         <label htmlFor="img">
//           <img
//             src={previewPhotoURL || photoURL || "/icon.png"} // 미리보기 이미지가 있으면 표시, 없으면 기존 이미지 표시
//             alt="Profile"
//             className="w-[70px] h-[70px] border-[2px] border-solid border-[#AE81FB] rounded-full relative bottom-[10px] right-[60px]"
//           />
//         </label>
//       </div>
//       {editMode ? (
//         <div className="flex justify-center mb-12">
//           <input
//             type="text"
//             className="bg-[#ede9fe] border border-solid border-[#AE81FB] rounded relative bottom-[65px] left-[160px]"
//             value={newDisplayName}
//             onChange={(e) => setNewDisplayName(e.target.value)}
//             placeholder="이름"
//             maxLength={10}
//           />
//           <input
//             id="img"
//             type="file"
//             className="hidden relative bottom-[40px] right-[65px]"
//             onChange={handlePhotoChange} // 파일 선택 시 미리보기 처리
//           />
//           <button
//             className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[18px]"
//             onClick={handleUpdateProfile}
//           >
//             Update
//           </button>
//           <button
//             className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[10px]"
//             onClick={() => setEditMode(false)}
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div>
//           <div className="flex justify-center">
//             <div className="font-bold text-[25px] text-[#AE81FB] relative bottom-[70px] left-[50px]">
//               {displayName || "user"}
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <button
//               onClick={() => setEditMode(true)}
//               className="text-black text-[20px] font-bold rounded bg-[#AE81FB] w-[80px] h-[30px] relative bottom-[60px] left-[42px]"
//             >
//               Edit
//             </button>
//           </div>
//         </div>
//       )}

//       <div>
//         <div className="text-[25px] font-bold italic relative top-[15px] ml-1">my post</div>

//         <Link href="/post">
//           <div className="w-[100px] text-black font-bold text-[20px] border-[#AE81FB] rounded-[10px] bg-[#AE81FB] relative bottom-[17px] left-[115px]">📌upload</div>
//         </Link>
//       </div>

//       {posts.length > 0 ? (
//         posts.map((post) => (
//           <div key={post.id} className="w-full h-[300px] border border-[#AE81FB] relative bottom-[10px]">
//             <img
//               className="w-[200px] h-[200px] rounded-[20px] relative top-[50px] left-[20px]"
//               src={post.imageUrl || "default.png"}
//               alt={post.title}
//             />

//             {editPostId === post.id ? (
//               <div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   id="editImg"
//                   onChange={handlePostPhotoChange} // 게시물 이미지 선택 처리
//                 />
//                 <label htmlFor="editImg">
//                   <img
//                     className="w-[200px] h-[200px] rounded-[20px] absolute top-[50px] left-[20px]"
//                     src={postPreviewPhotoURL || post.imageUrl || "default.png"} // 미리보기 이미지 표시
//                     alt={post.title}
//                   />
//                 </label>
//                 <input
//                   type="text"
//                   className="border-[#AE81FB] border rounded relative bottom-[100px] left-[240px]"
//                   value={updatedTitle}
//                   onChange={(e) => setUpdatedTitle(e.target.value)}
//                   placeholder="제목 수정"
//                 />
//                 <input
//                   type="text"
//                   className="border-[#AE81FB] border rounded relative bottom-[65px] left-[62px]"
//                   value={updatedSubtitle}
//                   onChange={(e) => setUpdatedSubtitle(e.target.value)}
//                   placeholder="부제목 수정"
//                 />
//                 <div className="absolute top-[180px] left-[239px]">
//                   <button
//                     className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md"
//                     onClick={() => handleUpdatePost(post.id)}
//                   >
//                     Save
//                   </button>
//                   <button
//                     className="bg-gray-500 text-black font-bold w-[85px] h-[30px] rounded-md ml-2"
//                     onClick={() => setEditPostId(null)} // 수정 취소
//                   >
//                     Cancel
//                   </button>
//                 </div>
//                 <button
//                   className="bg-red-500 w-[30px] h-[30px] rounded-md relative bottom-[140px] left-[30px]"
//                   onClick={() => handleDeletePost(post.id)}
//                 >
//                   <img className="w-[30px]" src="/trashCan.png"/>
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <Link href={`/idea/${post.id}`} className="text-[30px] font-bold absolute top-[90px] left-[240px]">
//                   {post.title}
//                 </Link>
//                 <div className="text-[20px] absolute top-[140px] left-[242px]">{post.subtitle}</div>
//                 <button
//                   className="bg-[#AE81FB] text-black font-bold w-[70px] h-[30px] rounded-md absolute top-[200px] left-[240px]"
//                   onClick={() => {
//                     setEditPostId(post.id);
//                     setUpdatedTitle(post.title);
//                     setUpdatedSubtitle(post.subtitle);
//                   }}
//                 >
//                   ✏️Edit
//                 </button>
//               </>
//             )}
//           </div>
//         ))
//       ) : (
//         <div className="text-center relative top-[250px]">아직 아이디어가 없습니다.</div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;





"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase"; // firebase.js에서 불러옴
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 가져옴
import Link from "next/link";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState(null); // 파일 객체 저장
  const [previewPhotoURL, setPreviewPhotoURL] = useState(""); // 미리보기 이미지 URL 상태
  const [editMode, setEditMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태
  const router = useRouter();

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName || "user");
        setPhotoURL(user.photoURL || "");
        console.log("사용자 로그인 상태 확인:", user);
      } else {
        console.log("사용자가 로그인되지 않았습니다.");
        router.push("/login");
        localStorage.removeItem('token')
      }
    });

    return () => unsubscribe();
  }, []);

  // 이미지 파일 선택 시 미리보기 처리
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhotoURL(reader.result); // 미리보기 URL 설정
      };
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽음
    }
  };

  const handleUpdateProfile = async () => {
    setEditMode(true);

    if (auth.currentUser) {
      let updatedPhotoURL = photoURL; // 기존 URL 유지

      if (newPhotoFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, newPhotoFile); // Firebase Storage에 파일 업로드
        updatedPhotoURL = await getDownloadURL(storageRef); // 업로드한 파일의 다운로드 URL 가져오기
      }

      updateProfile(auth.currentUser, {
        displayName: newDisplayName || displayName,
        photoURL: updatedPhotoURL,
      })
      .then(async () => {
                  // Firestore users 컬렉션에 사용자 정보 업데이트
                  const userDocRef = doc(db, "users", auth.currentUser.uid);
                  await updateDoc(userDocRef, {
                    name: newDisplayName || displayName,
                    photoURL: updatedPhotoURL,
                  });
        
                  setDisplayName(newDisplayName || displayName);
                  setPhotoURL(updatedPhotoURL);
                  alert("프로필이 업데이트되었습니다.");
                  setEditMode(false);
                })
        .catch((error) => {
          console.error("프로필 업데이트 중 오류 발생:", error);
        });
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null); // 수정 중인 게시물 ID 저장
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedSubtitle, setUpdatedSubtitle] = useState("");
  const [postPreviewPhotoURL, setPostPreviewPhotoURL] = useState(""); // 게시물 이미지 미리보기 URL
  const [newPostPhotoFile, setNewPostPhotoFile] = useState(null); // 게시물 이미지 파일 저장

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!auth.currentUser) return;

      try {
        const currentUser = auth.currentUser;
        const q = query(collection(db, "posts"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  });

  const handlePostPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostPreviewPhotoURL(reader.result); // 게시물 이미지 미리보기 URL 설정
      };
      reader.readAsDataURL(file);
    }
  };


   
  // 게시물 업데이트 처리 함수
  const handleUpdatePost = async (postId) => {
    if (!updatedTitle || !updatedSubtitle) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      let updatedImageUrl = posts.imageUrl; // 기존 이미지 URL 유지

      if (newPostPhotoFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `postImages/${postId}`); // 게시물 이미지 저장 경로 설정
        await uploadBytes(imageRef, newPostPhotoFile); // Firebase Storage에 파일 업로드
        updatedImageUrl = await getDownloadURL(imageRef); // 업로드한 파일의 다운로드 URL 가져오기
      }

      const postRef = collection(db, "posts");
      const postDoc = doc(postRef, postId);
      await updateDoc(postDoc, {
        title: updatedTitle,
        subtitle: updatedSubtitle,
        imageUrl: updatedImageUrl, // Firestore에 새로운 이미지 URL 업데이트
      });

      setEditPostId(null); // 수정 모드 종료
      setNewPostPhotoFile(null); // 새로운 파일 초기화
      setPostPreviewPhotoURL(""); // 미리보기 초기화
      alert("게시물이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("게시물 업데이트 중 오류 발생:", error);
    }
  };

  // 게시물 삭제 처리 함수
  const handleDeletePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId); // Firestore에서 삭제할 문서 참조
      await deleteDoc(postRef); // Firestore에서 게시물 삭제
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // 삭제된 게시물 UI에서 제거
      alert("게시물이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAlertMessage("로그인이 필요합니다."); // 알림 메시지 설정
      setTimeout(() => {
        router.push("/login"); // 3초 후 로그인 페이지로 리다이렉트
      }, 3000);
    } else {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    }
  }, [router]);

  if (!isLoggedIn) {
    return (
      <div className="text-center relative top-[200px]">
        <div className="text-[#AE81FB] font-bold text-[20px]">{alertMessage}</div>
      </div>
    ); // 로그인되지 않았을 때 알림 메시지를 보여줌
  }

  const pageStyle = {
    backgroundColor: '#ede9fe',
    minHeight: '100vh',
  };


  return (
    <div style={pageStyle}>
      <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/">&lt;</Link>
      <div className="flex justify-center mb-[20px] relative top-[35px]">
        <label htmlFor="img">
          <img
            src={previewPhotoURL || photoURL || "/icon.png"} // 미리보기 이미지가 있으면 표시, 없으면 기존 이미지 표시
            alt="Profile"
            className="w-[70px] h-[70px] border-[2px] border-solid border-[#AE81FB] rounded-full relative bottom-[10px] right-[60px]"
          />
        </label>
      </div>
      {editMode ? (
        <div className="flex justify-center mb-12">
          <input
            type="text"
            className="bg-[#ede9fe] border border-solid border-[#AE81FB] rounded relative bottom-[65px] left-[160px]"
            value={newDisplayName || displayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="이름"
            maxLength={10}
          />
          <input
            id="img"
            type="file"
            className="hidden relative bottom-[40px] right-[65px]"
            onChange={handlePhotoChange} // 파일 선택 시 미리보기 처리
          />
          <button
            className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[18px]"
            onClick={handleUpdateProfile}
          >
            Update
          </button>
          <button
            className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[10px]"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <div className="font-bold text-[25px] text-[#AE81FB] relative bottom-[50px] left-[50px]">
              {displayName || "user"}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setEditMode(true)}
              className="text-black text-[20px] font-bold rounded-[100px] bg-[#AE81FB] w-[40px] h-[40px] absolute top-[23px] right-[15px]"
            >
            ⚙️
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="text-[25px] font-bold italic relative top-[45px] ml-2">my post</div>

        <Link href="profile/post">
          <div className="w-[100px] text-black font-bold text-[20px] border-[#AE81FB] rounded-[10px] bg-[#AE81FB] relative top-[12px] left-[115px]">📌upload</div>
        </Link>
        <Link href="profile/memo">
          <div className="w-[100px] text-black font-bold text-[20px] border-[#AE81FB] rounded-[10px] bg-[#AE81FB] relative bottom-[18px] left-[220px]">🗒️memo</div>
        </Link>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="w-full h-[300px] border border-[#AE81FB] relative bottom-[10px]">
            <img
              className="w-[200px] h-[200px] rounded-[20px] relative top-[50px] left-[20px]"
              src={post.imageUrl || "default.png"}
              alt={post.title}
            />

            {editPostId === post.id ? (
              <div>
                <input
                  type="file"
                  className="hidden"
                  id="editImg"
                  onChange={handlePostPhotoChange} // 게시물 이미지 선택 처리
                />
                <label htmlFor="editImg">
                  <img
                    className="w-[200px] h-[200px] rounded-[20px] absolute top-[50px] left-[20px]"
                    src={postPreviewPhotoURL || post.imageUrl || "default.png"} // 미리보기 이미지 표시
                    alt={post.title}
                  />
                </label>
                <input
                  type="text"
                  className="border-[#AE81FB] border rounded relative bottom-[100px] left-[240px]"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="제목 수정"
                />
                <input
                  type="text"
                  className="border-[#AE81FB] border rounded relative bottom-[65px] left-[62px]"
                  value={updatedSubtitle}
                  onChange={(e) => setUpdatedSubtitle(e.target.value)}
                  placeholder="부제목 수정"
                />
                <div className="absolute top-[180px] left-[239px]">
                  <button
                    className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md"
                    onClick={() => handleUpdatePost(post.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-black font-bold w-[85px] h-[30px] rounded-md ml-2"
                    onClick={() => setEditPostId(null)} // 수정 취소
                  >
                    Cancel
                  </button>
                </div>
                <button
                  className="bg-red-500 w-[30px] h-[30px] rounded-md relative bottom-[140px] left-[30px]"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <img className="w-[30px]" src="/trashCan.png"/>
                </button>
              </div>
            ) : (
              <>
                <Link href={`/idea/${post.id}`} className="text-[30px] font-bold absolute top-[90px] left-[240px]">
                  {post.title}
                </Link>
                <div className="text-[20px] absolute top-[140px] left-[242px]">{post.subtitle}</div>
                <button
                  className="bg-[#AE81FB] text-black font-bold w-[70px] h-[30px] rounded-md absolute top-[200px] left-[240px]"
                  onClick={() => {
                    setEditPostId(post.id);
                    setUpdatedTitle(post.title);
                    setUpdatedSubtitle(post.subtitle);
                  }}
                >
                  ✏️Edit
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="text-center relative top-[250px]">아직 아이디어가 없습니다.</div>
      )}
    </div>
  );
};

export default ProfilePage;





// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "../firebase/firebase";
// import { updateProfile } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import Link from "next/link";
// import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import { useRouter } from "next/navigation";

// const ProfilePage = () => {
//   const [displayName, setDisplayName] = useState("");
//   const [photoURL, setPhotoURL] = useState("");
//   const [newDisplayName, setNewDisplayName] = useState("");
//   const [newPhotoFile, setNewPhotoFile] = useState(null); 
//   const [previewPhotoURL, setPreviewPhotoURL] = useState(""); 
//   const [editMode, setEditMode] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); 
//   const [alertMessage, setAlertMessage] = useState(""); 
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setDisplayName(user.displayName || "user");
//         setPhotoURL(user.photoURL || "");
//         console.log("사용자 로그인 상태 확인:", user);
//       } else {
//         console.log("사용자가 로그인되지 않았습니다.");
//         router.push("/login");
//         localStorage.removeItem("token");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPhotoFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewPhotoURL(reader.result); 
//       };
//       reader.readAsDataURL(file); 
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setEditMode(true);

//     if (auth.currentUser) {
//       let updatedPhotoURL = photoURL; 

//       if (newPhotoFile) {
//         const storage = getStorage();
//         const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
//         await uploadBytes(storageRef, newPhotoFile); 
//         updatedPhotoURL = await getDownloadURL(storageRef); 
//       }

//       // Firebase Authentication에 프로필 업데이트
//       updateProfile(auth.currentUser, {
//         displayName: newDisplayName || displayName,
//         photoURL: updatedPhotoURL,
//       })
//         .then(async () => {
//           // Firestore users 컬렉션에 사용자 정보 업데이트
//           const userDocRef = doc(db, "users", auth.currentUser.uid);
//           await updateDoc(userDocRef, {
//             name: newDisplayName || displayName,
//             photoURL: updatedPhotoURL,
//           });

//           setDisplayName(newDisplayName || displayName);
//           setPhotoURL(updatedPhotoURL);
//           alert("프로필이 업데이트되었습니다.");
//           setEditMode(false);
//         })
//         .catch((error) => {
//           console.error("프로필 업데이트 중 오류 발생:", error);
//         });
//     } else {
//       alert("로그인이 필요합니다.");
//     }
//   };

//   // 나머지 코드 동일 (게시물 처리 등)
  
//   return (
//     <div style={{ backgroundColor: '#ede9fe', minHeight: '100vh' }}>
//       <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/">
//         &lt;
//       </Link>
//       <div className="flex justify-center mb-[20px] relative top-[35px]">
//         <label htmlFor="img">
//           <img
//             src={previewPhotoURL || photoURL || "/icon.png"}
//             alt="Profile"
//             className="w-[70px] h-[70px] border-[2px] border-solid border-[#AE81FB] rounded-full relative bottom-[10px] right-[60px]"
//           />
//         </label>
//       </div>
//       {editMode ? (
//         <div className="flex justify-center mb-12">
//           <input
//             type="text"
//             className="bg-[#ede9fe] border border-solid border-[#AE81FB] rounded relative bottom-[65px] left-[160px]"
//             value={newDisplayName}
//             onChange={(e) => setNewDisplayName(e.target.value)}
//             placeholder="이름"
//             maxLength={10}
//           />
//           <input
//             id="img"
//             type="file"
//             className="hidden relative bottom-[40px] right-[65px]"
//             onChange={handlePhotoChange}
//           />
//           <button
//             className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[18px]"
//             onClick={handleUpdateProfile}
//           >
//             Update
//           </button>
//           <button
//             className="bg-[#AE81FB] text-black font-bold w-[85px] h-[30px] rounded-md relative bottom-[25px] right-[10px]"
//             onClick={() => setEditMode(false)}
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div>
//           <div className="flex justify-center">
//             <div className="font-bold text-[25px] text-[#AE81FB] relative bottom-[50px] left-[50px]">
//               {displayName || "user"}
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <button
//               onClick={() => setEditMode(true)}
//               className="text-black text-[20px] font-bold rounded-[100px] bg-[#AE81FB] w-[40px] h-[40px] absolute top-[23px] right-[15px]"
//             >
//               ⚙️
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 나머지 게시물 UI */}
//     </div>
//   );
// };

// export default ProfilePage;
