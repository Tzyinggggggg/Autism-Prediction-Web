/** @format */

import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
	patient_name: string;
	raw_results: string;
	prediction_percentage: string;
}

interface Props {
	onSubmit: (formData: FormData) => void;
}

const PatientForm: React.FC<Props> = ({ onSubmit }) => {
	const [formData, setFormData] = useState<FormData>({
		patient_name: "",
		raw_results: "",
		prediction_percentage: "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Patient Name:
				<input
					type='text'
					name='patient_name'
					value={formData.patient_name}
					onChange={handleChange}
				/>
			</label>
			<label>
				Raw Results:
				<input
					type='text'
					name='raw_results'
					value={formData.raw_results}
					onChange={handleChange}
				/>
			</label>
			<label>
				Prediction Percentage:
				<input
					type='text'
					name='prediction_percentage'
					value={formData.prediction_percentage}
					onChange={handleChange}
				/>
			</label>
			<button type='submit'>Submit</button>
		</form>
	);
};

export default PatientForm;
