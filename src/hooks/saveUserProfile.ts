import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";

interface FavoriteGoal {
  goalName: string;
  goalValue: number;
  savedAmount: number;
}

interface CardItem {
  id: string;
  bank: string;
  cardName: string;
  brand: string;
  color: string;
  cardNumber: string;
}

interface UserProfile {
  displayName?: string;
  email?: string;
  role?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
  skills?: string[];
  balance?: number;
  expanse?: number;
  expensefixes?: number;
  goals?: number;
  subcriptions?: number;
  favoriteGoal?: FavoriteGoal;
  saldoMetas?: number;
  cardsList?: CardItem[];
}

export async function saveUserProfile(user: User, profileData: UserProfile) {
  if (!user) throw new Error("Usuário não autenticado");

  const userRef = doc(db, "users", user.uid);

  try {
    await updateDoc(userRef, profileData);
    console.log("Perfil atualizado com sucesso!");
  } catch (error: any) {
    if (error.code === "not-found") {
      await setDoc(userRef, profileData);
      console.log("Perfil criado com sucesso!");
    } else {
      console.error("Erro ao salvar perfil:", error);
      throw error;
    }
  }
}
