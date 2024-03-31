/** @format */

import React, { useEffect, useState } from "react";

interface Item {
	id: number;
	name: string;
}

const ExampleComponent = () => {
	const [data, setData] = useState<Item[] | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8080/api/home");
				const jsonData = await response.json();
				setData(jsonData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>Example Component</h1>
			{data && Array.isArray(data) && (
				<ul>
					{data.map((item) => (
						<li key={item.id}>{item.name}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ExampleComponent;
