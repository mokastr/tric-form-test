import React, { useState, ChangeEvent, FormEvent } from 'react'

import styles from './FeedbackForm.module.scss'

interface FormData {
	name: string
	surname: string
	email: string
	category: string
	message: string
	image: File | null
}

const FeedbackForm: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		surname: '',
		email: '',
		category: '',
		message: '',
		image: null,
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = event.target
		setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
	}

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedImage = event.target.files && event.target.files[0]
		console.log('handleImageChange ~ selectedImage:', selectedImage)
		if (selectedImage) {
			if (
				selectedImage.size <= 2 * 1024 * 1024 &&
				(selectedImage.type === 'image/jpeg' ||
					selectedImage.type === 'image/png')
			) {
				setFormData(prevFormData => ({
					...prevFormData,
					image: selectedImage,
				}))
			} else {
				setErrors(prevErrors => ({
					...prevErrors,
					image: 'Размер файла не должен превышать 2 MB.',
				}))
			}
		}
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		setErrors({})

		const { name, surname, email, category, message } = formData
		console.log('handleSubmit ~ formData:', formData)
		const inputErrors: Record<string, string> = {}

		if (!name && !surname) {
			inputErrors.name = 'Необходимо ввести имя или фамилию'
			inputErrors.surname = 'Необходимо ввести имя или фамилию'
		}

		if (!email) {
			inputErrors.email = 'Введите email'
		}

		if (!category) {
			inputErrors.category = 'Выберите категорию'
		}

		if (message.length < 10) {
			inputErrors.message = 'Пожалуйста напишите комментарий'
		}

		if (Object.keys(inputErrors).length > 0) {
			setErrors(inputErrors)
			return
		}

		// Отправка данных
		console.log(JSON.stringify(formData))
		setIsSubmitted(true)
	}

	const handleGoBack = () => {
		setIsSubmitted(false)
		setFormData({
			name: '',
			surname: '',
			email: '',
			category: '',
			message: '',
			image: null,
		})
	}

	return (
		<form className={styles['feedback-form']} onSubmit={handleSubmit}>
			{isSubmitted ? (
				<>
					<p className={styles['success-message']}>Форма успешно отправлена!</p>
					<button
						type="button"
						className={styles['btn']}
						onClick={handleGoBack}
					>
						Вернуться назад
					</button>
				</>
			) : (
				<>
					<div className={styles['form-group']}>
						<label htmlFor="name">Имя:</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className={styles.input}
						/>
						{errors.name && (
							<p className={styles['error-message']}>{errors.name}</p>
						)}
					</div>

					<div className={styles['form-group']}>
						<label htmlFor="surname">Фамилия:</label>
						<input
							type="text"
							id="surname"
							name="surname"
							value={formData.surname}
							onChange={handleChange}
							className={styles.input}
						/>
						{errors.surname && (
							<p className={styles['error-message']}>{errors.surname}</p>
						)}
					</div>

					<div className={styles['form-group']}>
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							// required
							className={styles.input}
						/>
						{errors.email && (
							<p className={styles['error-message']}>{errors.email}</p>
						)}
					</div>

					<div className={styles['form-group']}>
						<label htmlFor="category">Категория:</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							// required
							className={styles.select}
						>
							<option value="">Выбор категории:</option>
							<option value="category1">Категория 1</option>
							<option value="category2">Категория 2</option>
							<option value="category3">Категория 3</option>
						</select>
						{errors.category && (
							<p className={styles['error-message']}>{errors.category}</p>
						)}
					</div>

					<div className={styles['form-group']}>
						<label htmlFor="message">Комментарий:</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							minLength={10}
							rows={5}
							// required
							className={styles.message}
						/>
						{errors.message && (
							<p className={styles['error-message']}>{errors.message}</p>
						)}
					</div>

					<div className={styles['form-group']}>
						<label htmlFor="image">Изображение</label>
						<div className={styles['file-input-container']}>
							<input
								type="file"
								id="image"
								accept="image/jpeg, image/png"
								onChange={handleImageChange}
								className={styles['file-input']}
							/>
							<label htmlFor="image" className={styles['file-input-label']}>
								<span className={styles['file-input-text']}>
									{formData.image ? formData.image.name : 'Добавить файл'}
								</span>
							</label>
						</div>
						{errors.image && (
							<p className={styles['error-message']}>{errors.image}</p>
						)}
					</div>

					<button type="submit" className={styles['btn']}>
						Отправить
					</button>
				</>
			)}
		</form>
	)
}

export default FeedbackForm
