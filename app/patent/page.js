// "use client";
// import { useState } from 'react';
// import Link from 'next/link';
// import { parseStringPromise } from 'xml2js';

// export default function Home() {
//     const [patentNumber, setPatentNumber] = useState('');
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState('');

//     const searchPatent = async (e) => {
//         e.preventDefault(); 
//         setError('');
//         setResult(null);

//         try {
//             const response = await fetch(`/api/patent/patUtiModInfoSearchSevice/getWordSearch?word=${patentNumber}&ServiceKey=${process.env.NEXT_PUBLIC_KIPRIS_API_KEY}`);
//             if (!response.ok) {
//                 throw new Error('특허 정보를 가져오는 데 실패했습니다.');
//             }

//             const xmlContent = await response.text();
//             const jsonData = await parseStringPromise(xmlContent);
//             const patents = jsonData.response.body[0].items[0].item;
//             setResult(patents);  // 데이터 설정
//             console.log(patents)
    
//         } catch (err) {
//             setError('특허 검색에 실패했습니다. 다시 시도해 주세요.');
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative left-[10px]" href="/">&lt;</Link>
//             <div className="text-black font-bold text-[80px] italic text-center">patent</div>
//             <form onSubmit={searchPatent}>
//                 <div className="flex justify-center relative top-[50px]">
//                     <input
//                         type="text"
//                         value={patentNumber}
//                         onChange={(e) => setPatentNumber(e.target.value)}
//                         placeholder="선행기술 검색"
//                         className="w-[300px] h-[50px] rounded bg-[#ede9fe] border-[2px] border-[#AE81FB] outline-[#AE81FB]"
//                     />
//                     <button type="submit" className="w-[50px] h-[50px] bg-[#AE81FB] rounded">
//                         검색
//                     </button>
//                 </div>
//                 {error && <p className="text-red-500 mt-2">{error}</p>}
//                 {result && (
//                     <div className="relative top-[100px]">
//                         <div className="text-xl font-bold">검색 결과:</div>
//                         <ul>
//                             {result.map((patent, index) => (
//                                 <div key={index} className="border-b border-[#AE81FB] mb-4">
//                                       {patent.drawing && (
//                                         <div>
//                                             <img src={patent.drawing[0]} alt="도면 이미지" className="mt-2 w-[150px] h-[150px] rounded-[20px]" />
//                                         </div>
//                                     )}
//                                     <h3 className="text-lg font-semibold">{patent.inventionTitle[0]}</h3>
//                                     <p><strong>출원인:</strong> {patent.applicantName[0]}</p>
//                                     <p><strong>출원번호:</strong> {patent.applicationNumber[0]}</p>
//                                     <p><strong>출원일:</strong> {patent.applicationDate[0]}</p>
//                                     <p><strong>요약:</strong> {patent.astrtCont[0]}</p>
//                                 </div>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </form>
//             <div className='relative top-[200pxs]'>
//                 <div>특허가이드라인</div>
//                 <div>특허법 필독</div>
//             </div>         
//         </div>
//     );
// }


"use client";
import { useState } from 'react';
import Link from 'next/link';
import { parseStringPromise } from 'xml2js';
import PatentFAQ from '../components/Faq';

export default function Home() {
    const [patentNumber, setPatentNumber] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);
    const [isHistoryVisible1, setIsHistoryVisible1] = useState(true);

    const searchPatent = async (e) => {
        e.preventDefault(); 
        setError('');
        setResult(null);

        try {
            const response = await fetch(`/api/patent/patUtiModInfoSearchSevice/getWordSearch?word=${patentNumber}&ServiceKey=${process.env.NEXT_PUBLIC_KIPRIS_API_KEY}`);
            if (!response.ok) {
                throw new Error('특허 정보를 가져오는 데 실패했습니다.');
            }

            const xmlContent = await response.text();
            const jsonData = await parseStringPromise(xmlContent);
            const patents = jsonData.response.body[0].items[0].item;
            setResult(patents);
            console.log(patents);
    
        } catch (err) {
            setError('특허 검색에 실패했습니다. 다시 시도해 주세요.');
        }
    };
    const toggleHistoryVisibility = () => {
        setIsHistoryVisible(!isHistoryVisible);
    };
    const toggleHistoryVisibility1 = () => {
        setIsHistoryVisible1(!isHistoryVisible1);
    };
    return (
        <div>
            <Link className="text-[#AE81FB] text-[50px] font-bold no-underline relative bottom-[10px]" href="/">&lt;</Link>
            <div className="text-black font-bold text-[80px] italic text-center">Patent</div>
            <form onSubmit={searchPatent}>
                <div className="flex justify-center relative top-[50px]">
                    <input
                        type="text"
                        value={patentNumber}
                        onChange={(e) => setPatentNumber(e.target.value)}
                        placeholder="선행기술 검색"
                        className="w-[300px] h-[50px] rounded bg-[#ede9fe] border-[2px] border-[#AE81FB] outline-[#AE81FB]"
                    />
                    <button type="submit" className="w-[50px] h-[50px] bg-[#AE81FB] rounded font-bold">
                        검색
                    </button>
                </div>
                {error && 
                    <div className="flex justify-center">
                        <div className="text-red-500 relative top-[50px]">{error}</div>
                    </div>
                }
                {result && (
                    <div className="relative top-[100px]">
                        <div className="text-xl font-bold mb-5">검색 결과:</div>
                        <ul>
                            {result.map((patent, index) => (
                                <div key={index} className="border-b border-[#AE81FB] mt-10">
                                    {patent.drawing && (
                                        <div>
                                            <img src={patent.drawing[0]} alt="도면 이미지" className="mt-2 ml-2 w-[150px] h-[150px] rounded-[20px]" />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold">{patent.inventionTitle[0]}</h3>
                                    <p><strong>출원인:</strong> {patent.applicantName[0]}</p>
                                    <p><strong>출원번호:</strong> {patent.applicationNumber[0]}</p>
                                    <p><strong>출원일:</strong> {patent.applicationDate[0]}</p>
                                    <p><strong>요약:</strong> {patent.astrtCont[0]}</p>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
            <div className="mt-10 text-center relative top-[80px]">
                <button 
                    className="text-[#AE81FB] text-[20px] font-bold cursor-pointer border-[2px] bg-[#ede9fe] border-[#AE81FB] rounded-[25px] shadow-md w-[200px] h-[35px]"
                    onClick={toggleHistoryVisibility}
                >
                    {isHistoryVisible ? '▲' : '▼'} 특허가이드라인
                </button>
            </div>
            {isHistoryVisible && (
                <div className="relative top-[100px]">
                    <div className="flex justify-center" >
                        <div className="text-[25px] font-bold">특허 가이드라인</div>
                    </div>
                    <div className="flex justify-center" >
                        <ul className="list-disc ml-6">
                            <li>특허 출원 전에 발명 아이디어를 구체화하세요.</li>
                            <li>선행기술 조사를 통해 유사한 특허가 있는지 확인하세요.</li>
                            <li>특허 출원서 작성 시 정확한 정보를 작성하세요.</li>
                        </ul>
                    </div>
                    <div className="flex justify-center relative top-[20px]" >
                        <PatentFAQ/>
                    </div>
                </div>
            )}    
            <div className="relative top-[150px]">
                <div className="text-center">
                    <button
                        className="text-[#AE81FB] text-[20px] font-bold cursor-pointer border-[2px] bg-[#ede9fe] border-[#AE81FB] rounded-[25px] shadow-md  w-[200px] h-[35px]  mb-10"
                        onClick={toggleHistoryVisibility1}
                    >
                        {isHistoryVisible1 ? '▲' : '▼'} 특허법필독
                    </button>
                </div>
                {isHistoryVisible1 && (
                    <div className="relative bottom-[10px]">
                        <div className="flex justify-center" >
                            <h2 className="text-[25px] font-bold">특허법 필독</h2>
                        </div>
                        <div className="flex justify-center" >
                            <ul className="list-disc ml-6">
                                <li>특허의 보호 기간은 출원일로부터 20년입니다.</li>
                                <li>특허를 출원하기 전 공개된 정보는 특허를 받을 수 없습니다.</li>
                                <li>특허권은 독점적이며 무단 사용 시 법적 책임이 따릅니다.</li>
                            </ul>
                        </div>
                        <div className="flex justify-center relative top-10" >
                            <Link className="text-[25px] bg-[#AE81FB] font-bold rounded-[5px] mb-10" href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%ED%8A%B9%ED%97%88%EB%B2%95" target='_blank'>법제처 특허법</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
