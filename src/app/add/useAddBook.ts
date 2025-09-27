"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useAddBook() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookFileName, setBookFileName] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveCover = () => setCoverPreview(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const handleRemoveTag = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  const handleBookFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 50MB.");
        return;
      }
      setBookFile(file);
      setBookFileName(file.name);
    }
  };
  const handleRemoveBookFile = () => {
    setBookFile(null);
    setBookFileName("");
  };

  const handleCancel = () => router.push("/home");

  // Função para fazer upload no Supabase
  const uploadFileSupabase = async (file: File, folder: string) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from(folder).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      let coverUrl = null;
      let bookUrl = null;

      // Upload da capa
      if (coverPreview) {
        const blob = await (await fetch(coverPreview)).blob();
        const file = new File([blob], "cover.jpg");
        coverUrl = await uploadFileSupabase(file, "covers");
      }

      // Upload do livro
      if (bookFile) {
        bookUrl = await uploadFileSupabase(bookFile, "books");
      }

      // Salvar no Firestore
      await addDoc(collection(db, "books"), {
        userId: user.uid,
        title: "", // criar estado para título
        author: "", // idem
        summary: "", // idem
        description,
        language: "pt", // idem: criar estado para idioma
        tags,
        coverUrl,
        bookUrl,
        createdAt: serverTimestamp(),
      });

      alert("Livro salvo com sucesso!");
      router.push("/home");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o livro.");
    }
  };

  return {
    user,
    loading,
    description,
    setDescription,
    bookFile,
    bookFileName,
    coverPreview,
    tags,
    tagInput,
    setTagInput,
    handleCoverUpload,
    handleRemoveCover,
    handleAddTag,
    handleRemoveTag,
    handleBookFileUpload,
    handleRemoveBookFile,
    handleSave,
    handleCancel,
  };
}
