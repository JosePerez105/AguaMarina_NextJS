"use client";
import React from "react";
import { HashLoader } from "react-spinners";

const LoaderBasic: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="bg-[#000000] bg-opacity-10 h-[50vh] shadow-lg w-full min-h-[200px] rounded-xl flex items-center justify-center">
                <HashLoader color="#5750f1" size={80} speedMultiplier={1.8}/>
            </div>
        </div>
    );
};

export default LoaderBasic;