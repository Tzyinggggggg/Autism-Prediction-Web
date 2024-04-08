/** @format */

// Home.tsx
import React from "react";
import Title from "@/app/components/title";
import SubmitButton from "@/app/components/submit_button";

const Home = () => {
	return (
		<main>
			<h1>
				<Title text='Autism Prediction' />
			</h1>
			<SubmitButton />
		</main>
	);
};

export default Home;
