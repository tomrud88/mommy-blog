"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import styles from "./writePage.module.css";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const WritePage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");

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
        desc: value,
        img: finalImgUrl,
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Tytuł artykułu"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

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
        />
      </div>
      <button className={styles.publish} onClick={handlePublish}>
        Opublikuj
      </button>
    </div>
  );
};

export default WritePage;
