import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../lib/firebase"
import { User } from "firebase/auth"

/**
 * Cria o documento do perfil do usuário no Firestore em users/{uid}
 * 
 * @param user - Usuário autenticado do Firebase
 * @param username - Nome fornecido manualmente (opcional)
 */
export const createUserProfile = async (user: User, username?: string) => {
  if (!user || !user.uid) return

  const userRef = doc(db, "users", user.uid)

  const userData = {
    name: username || user.displayName || "",
    email: user.email || "",
    role: "free", // padrão inicial
    planStatus: "inactive", // padrão inicial
    createdAt: serverTimestamp(),
  }

  try {
    await setDoc(userRef, userData, { merge: true })
    console.log("✅ Perfil do usuário criado com sucesso:", user.uid)
  } catch (error) {
    console.error("❌ Erro ao criar perfil do usuário:", error)
    throw error
  }
}
