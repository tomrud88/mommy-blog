"use client";
import React, { useState } from "react";
import styles from "./writePage.module.css";
import Image from "next/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useSession } from "next-auth/react";

const WritePage = () => {

  const { data, status } = useSession();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

  return (
    <div className={styles.container}>
          <input type="text" placeholder="Title" className={styles.input} />
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <button className={styles.addButton}>
              <Image src="/imageAdd.png" alt="" width={20} height={20} />
            </button>
            <button className={styles.addButton}>
              <Image src="/fileAdd.png" alt="" width={20} height={20} />
            </button>
            <button className={styles.addButton}>
              <Image src="/videoAdd.png" alt="" width={20} height={20} />
                      </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="write new post"
        />
          </div>
          <button className={styles.publish}>Opublikuj</button>
    </div>
  );
};

export default WritePage;
