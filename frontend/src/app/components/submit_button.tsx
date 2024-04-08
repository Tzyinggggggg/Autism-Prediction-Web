/** @format */

"use client";

export default function SubmitButton() {
	return (
		<button
			className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
			onClick={() => console.log("Submitted")}
		>
			Submit
		</button>
	);
}
