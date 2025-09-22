'use client'

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { languages } from "@/src/data/languages";


export default function AddBook() {
  const { user, loading } = useAuth();
  const [description, setDescription] = useState("");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookFileName, setBookFileName] = useState("");

  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-8">Carregando...</div>;

  // Upload da imagem de capa
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Remover imagem da capa
  const handleRemoveCover = () => {
    setCoverPreview(null);
  };

  // Adicionar tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Remover tag
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.push("/home");
  };
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

  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="bg-white shadow-md p-8 rounded-lg flex flex-col gap-8 max-w-6xl mx-auto text-black">
            {/* Upload da capa e campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload da capa */}
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors w-full h-[445px] max-w-[300px] mx-auto p-4 text-center rounded-lg">
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Preview da Capa"
                      className="object-cover w-[300px] h-[445px] rounded-md"
                    />
                    <button
                      onClick={handleRemoveCover}
                      className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 text-sm hover:bg-red-500 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                      <span className="text-5xl font-light text-gray-500">+</span>
                      <p className="text-gray-500 mt-2 text-sm">300x445<br />10mb</p>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-upload"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Formulário */}
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-semibold">Título</label>
                  <input
                    type="text"
                    placeholder="Escreva a descrição do livro aqui..."
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Autor</label>
                  <input
                    type="text"
                    placeholder="Escreva o nome do autor ou autores"
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Resumo</label>
                  <input
                    type="text"
                    placeholder="Escreva um breve resumo"
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Descrição <span className="text-xs text-gray-400">(Limite de 500 caracteres)</span>
                  </label>
                  <textarea
                    placeholder="Escreva a descrição do livro aqui..."
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                    }}
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {description.length} / 500 caracteres
                  </div>
                </div>
              </div>
            </div>

            {/* Idioma e Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Idioma */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Idioma</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black">
                  {languages
                    .filter((lang) => lang.priority)
                    .map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}

                  <option disabled>──────────</option>

                  {languages
                    .filter((lang) => !lang.priority)
                    .map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Tags */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Digite e pressione Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-gray-600 hover:text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload do livro */}
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-6 text-center">
                {!bookFile ? (
                  <>
                    <label
                      htmlFor="book-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1"
                    >
                      <p className="text-sm text-gray-600 mb-2">
                        Clique ou arraste para enviar (PDF ou Word, até 50MB)
                      </p>
                      <div className="bg-black text-white px-4 py-2 rounded-md w-fit text-sm hover:bg-gray-800 transition">
                        Selecionar arquivo
                      </div>
                    </label>
                    <input
                      id="book-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleBookFileUpload}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-black">{bookFileName}</p>
                    <button
                      onClick={handleRemoveBookFile}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remover arquivo
                    </button>
                  </div>
                )}
              </div>

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">Salvar</button>
              <button
                onClick={handleCancel}
                className="border border-gray-400 text-black px-6 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
