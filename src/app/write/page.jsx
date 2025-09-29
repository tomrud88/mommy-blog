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

  const handlePublish = async () => {
    if (!title || !value) {
      alert("Uzupełnij tytuł i treść artykułu.");
      return;
    }

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
      router.push("/");
    } else {
      alert("Wystąpił błąd podczas publikacji.");
    }
  };

  // NAPRAWKA: Custom handler dla numerowanych list
  const handleListClick = () => {
    // Dodaj prostą numerowaną listę jako HTML
    const currentValue = value;
    const newList = `
<ol>
<li>Pierwszy punkt</li>
<li>Drugi punkt</li>
<li>Trzeci punkt</li>
</ol>
    `;
    setValue(currentValue + newList);
  };

  // NAPRAWKA: Problem React Quill z numeracją - lepsze modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
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
      <input
        type="text"
        placeholder="Tytuł artykułu"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        value={selectedCat}
        onChange={(e) => setSelectedCat(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.title}
          </option>
        ))}
      </select>

      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
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
                  }
                }}
              />
            </label>
            <button className={styles.addButton}>
              <Image src="/fileAdd.png" alt="" width={20} height={20} />
            </button>
            <button className={styles.addButton}>
              <Image src="/videoAdd.png" alt="" width={20} height={20} />
            </button>
            <button
              className={styles.addButton}
              onClick={handleListClick}
              title="Dodaj listę numerowaną"
            >
              📝
            </button>
          </div>
        )}
        {selectedImage && (
          <div className={styles.imagePreview}>
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Podgląd obrazu"
              width={200}
              height={200}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Napisz nowy artykuł"
          modules={modules}
          formats={formats}
        />
        <style jsx global>{`
          /* ZASADY FORMATOWANIA - NOWE POSTY */
          .ql-editor ol {
            counter-reset: item !important;
            padding-left: 1.5em !important;
            margin: 8px 0 12px 0 !important;
          }

          .ql-editor ol li {
            list-style: none !important;
            counter-increment: item !important;
            position: relative !important;
            display: block !important;
            margin-bottom: 6px !important;
            line-height: 1.6 !important;
          }

          .ql-editor ol li::before {
            content: counter(item) ". " !important;
            position: absolute !important;
            left: -1.5em !important;
            top: 0 !important;
            font-weight: bold !important;
            color: inherit !important;
            width: 18px !important;
          }

          .ql-editor ol li[data-list] {
            list-style: none !important;
          }

          .ql-editor ol li[data-list="ordered"] {
            list-style: none !important;
          }

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
      <button className={styles.publish} onClick={handlePublish}>
        Opublikuj
      </button>
    </div>
  );
};

export default WritePage;
