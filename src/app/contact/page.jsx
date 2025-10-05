"use client";
import React, { useState } from "react";
import styles from "./contactPage.module.css";
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Symulacja wysyłania wiadomości
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <Image
          src="/mom-child.webp"
          fill
          style={{ objectFit: "cover" }}
          alt="Mama z dzieckiem - kontakt"
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>Skontaktuj się ze mną</h1>
          <p className={styles.description}>
            Masz pytanie, sugestię lub po prostu chcesz się przywitać? Napisz do
            mnie! Postaram się odpowiedzieć jak najszybciej.
          </p>

          {success && (
            <div className={styles.successMessage}>
              ✅ Wiadomość została wysłana! Dziękuję za kontakt.
            </div>
          )}

          {error && <div className={styles.errorMessage}>❌ {error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Imię *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="Wpisz swoje imię"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="twoj.email@example.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="subject" className={styles.label}>
                Temat *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="O czym chcesz napisać?"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Wiadomość *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                required
                placeholder="Napisz swoją wiadomość..."
                rows={6}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
            </button>
          </form>

          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>Inne sposoby kontaktu:</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://facebook.com/mamazzwyobraznia"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Image
                  src="/communication.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
                Facebook
              </a>
              <a
                href="https://instagram.com/mamazzwyobraznia"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
                Instagram
              </a>
              <a
                href="https://tiktok.com/@mamazzwyobraznia"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Image src="/tiktok.png" alt="TikTok" width={24} height={24} />
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
