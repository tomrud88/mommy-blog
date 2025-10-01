"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import styles from "./writePage.module.css";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Import Quill for custom configuration
const Quill = dynamic(() => import("quill"), { ssr: false });

const WritePage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCat(data[0].slug); // default to first category
        }
      }
    };
    fetchCategories();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        event.target &&
        event.target.closest &&
        !event.target.closest(".add-menu-container")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Configure Quill for proper list handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      const configureQuill = async () => {
        const QuillModule = (await import("quill")).default;

        // Custom list handler to ensure proper numbering
        const List = QuillModule.import("formats/list");
        class CustomList extends List {
          static create(value) {
            const node = super.create(value);
            if (value === "ordered") {
              node.setAttribute("data-list", "ordered");
            }
            return node;
          }
        }

        QuillModule.register(CustomList, true);
      };

      configureQuill();
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Tytuł jest wymagany";
    }

    if (!value.trim() || value.trim() === "<p><br></p>") {
      newErrors.content = "Treść artykułu jest wymagana";
    }

    if (!selectedImage && !imgUrl) {
      newErrors.image = "Zdjęcie jest wymagane dla każdego artykułu";
    }

    if (!selectedCat) {
      newErrors.category = "Kategoria jest wymagana";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    // Walidacja formularza
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    let finalImgUrl = imgUrl; // Use the provided URL
    if (selectedImage && !imgUrl) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        finalImgUrl = uploadData.url;
      } else {
        alert("Błąd podczas przesyłania obrazu.");
        return;
      }
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        desc: value, // Zwykłe value bez transformacji
        img: finalImgUrl,
        catSlug: selectedCat,
      }),
    });
    if (res.ok) {
      alert("Artykuł został opublikowany!");
      setTitle("");
      setValue("");
      setSelectedImage(null);
      setImgUrl("");
      setErrors({});
      router.push("/");
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.message || "Wystąpił błąd podczas publikacji.");
    }

    setIsSubmitting(false);
  };

  // NAPRAWKA: Problem React Quill z numeracją - lepsze modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      // Naprawka dla list
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Tytuł artykułu *"
          className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: "" }));
            }
          }}
        />
        {errors.title && (
          <div className={styles.errorMessage}>{errors.title}</div>
        )}
      </div>
      <div className={styles.categoryContainer}>
        <label className={styles.categoryLabel}>Kategoria: *</label>
        <select
          className={`${styles.select} ${
            errors.category ? styles.inputError : ""
          }`}
          value={selectedCat}
          onChange={(e) => {
            setSelectedCat(e.target.value);
            if (errors.category) {
              setErrors((prev) => ({ ...prev, category: "" }));
            }
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.title}
            </option>
          ))}
        </select>
        {errors.category && (
          <div className={styles.errorMessage}>{errors.category}</div>
        )}
      </div>

      <div className={styles.editor}>
        <div className={styles.editorSidebar}>
          <div className={styles.editorControls}>
            <div className="add-menu-container">
              <button
                className={`${styles.button} ${
                  errors.image ? styles.buttonError : ""
                }`}
                onClick={() => setOpen(!open)}
                title="Dodaj zdjęcie (wymagane)"
              >
                <Image src="/plus.png" alt="" width={16} height={16} />
              </button>
              {errors.image && (
                <div className={styles.errorMessage}>{errors.image}</div>
              )}
              {open && (
                <div className={styles.add}>
                  <label className={styles.addButton}>
                    <Image
                      src="/imageAdd.png"
                      alt="Dodaj obraz"
                      width={20}
                      height={20}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedImage(e.target.files[0]);
                          setOpen(false); // Close menu after selection
                        }
                      }}
                    />
                  </label>
                  <button className={styles.addButton}>
                    <Image src="/videoAdd.png" alt="" width={20} height={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {selectedImage && (
            <div className={styles.imagePreview}>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Podgląd obrazu"
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <button
                className={styles.removeImageButton}
                onClick={() => setSelectedImage(null)}
                type="button"
                title="Usuń obraz"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className={styles.editorContent}>
          <ReactQuill
            className={`${styles.textArea} ${
              errors.content ? styles.inputError : ""
            }`}
            theme="snow"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              if (errors.content) {
                setErrors((prev) => ({ ...prev, content: "" }));
              }
            }}
            placeholder="Napisz nowy artykuł *"
            modules={modules}
            formats={formats}
          />
          {errors.content && (
            <div className={styles.errorMessage}>{errors.content}</div>
          )}
        </div>
        <style jsx global>{`
          /* Lepsze odstępy w edytorze */
          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3 {
            margin-bottom: 8px !important;
          }

          .ql-editor p {
            margin-bottom: 8px !important;
          }
        `}</style>
      </div>
      <button
        className={`${styles.publish} ${
          isSubmitting ? styles.publishLoading : ""
        }`}
        onClick={handlePublish}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publikowanie..." : "Opublikuj *"}
      </button>

      <div className={styles.requiredNote}>* - pola wymagane</div>
    </div>
  );
};

export default WritePage;
