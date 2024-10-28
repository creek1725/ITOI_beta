"use client"
import Carousel from "./components/cSlider";
import Carousel2 from "./components/ucSlider";
import Link from "next/link";
import React from "react";
import Navbar from "./components/Navbar";


const pageStyle = {
    backgroundColor: '#ede9fe',
    minHeight: '100vh',
};

export default function Home() {
    return (
        <div style={pageStyle}>
            <Navbar />
            <Carousel />
            <div className="flex justify-evenly relative top-[320px]">
                <Link className="flex items-center border-2 border-black w-[90px] h-[90px] rounded-[20px] ma-ti" href="/idea">
                    <img className="w-[70px] h-[70px] relative left-[8px]" src="idea.png" />
                    <div className="text-[25px] font-bold italic relative top-[70px] right-[55px]">idea</div>
                </Link>
                <Link className="flex items-center border-2 border-black w-[90px] h-[90px] rounded-[20px] ma-ti" href="/brainstorm">
                    <img className="w-[50px] h-[50px] relative left-[15px]" src="brainstorm.png" />
                    <div className="text-[20px] font-bold italic relative top-[70px] right-[62px]">Brianstorm</div>
                </Link>
                <Link className="flex items-center border-2 border-black w-[90px] h-[90px] rounded-[20px] ma-ti" href="/contest">
                    <img className="w-[50px] h-[50px] relative left-[18px]" src="contest.png" />
                    <div className="text-[22px] font-bold italic relative top-[70px] right-[45px]">contest</div>
                </Link>
                <Link className="flex items-center border-2 border-black w-[90px] h-[90px] rounded-[20px] ma-ti" href="/patent">
                    <img className="w-[60px] h-[60px] relative left-[12px]" src="patent.png" />
                    <div className="text-[22px] font-bold italic relative top-[70px] right-[52px]">patent</div>
                </Link>
            </div>
            <div className="text-[35px] font-bold italic absolute top-[600px] left-[20px]">EVENT</div>
            <Link className="text-[20px] font-bold absolute top-[615px] right-[20px]" href="/contest">READ MORE &gt;</Link>
            <Carousel2/>
        </div>
    );
}

