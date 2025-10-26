import React from "react";


export default function ScrollPaper({ text }) {
return (
<div className="relative w-full max-w-md">
<div className="relative p-6 bg-amber-50 border-2 border-amber-200 rounded-xl shadow-sm">
<div className="absolute -top-3 left-4 h-6 w-6 bg-amber-200 rounded-full border border-amber-300" />
<div className="absolute -top-3 right-4 h-6 w-6 bg-amber-200 rounded-full border border-amber-300" />
<p className="text-center text-lg">{text}</p>
</div>
</div>
);
}