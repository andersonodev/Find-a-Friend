import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "000000000000", // Valor fictício necessário para inicialização
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validar configuração do Firebase
if (!import.meta.env.VITE_FIREBASE_API_KEY || 
    !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
    !import.meta.env.VITE_FIREBASE_APP_ID) {
  throw new Error('Configuração do Firebase incompleta. Verifique as variáveis de ambiente.');
}

// Use um singleton para inicializar o Firebase apenas uma vez
let app: any;
let auth: any;
let googleProvider: GoogleAuthProvider;

try {
  // Inicializar Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  if (import.meta.env.DEV) {
    console.log("Firebase inicializado com sucesso");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
  // Se o app já existe, obtenha a instância atual
  auth = getAuth();
  googleProvider = new GoogleAuthProvider();
}

// Exportar funções e objetos do Firebase
export { app, auth };

/**
 * Registrar um usuário com email e senha
 */
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário registrado com sucesso:", userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error("Erro ao registrar com email:", error);
    
    // Mensagens de erro mais detalhadas para debugging
    if (error.code === "auth/configuration-not-found") {
      console.error("Erro de configuração do Firebase: Verifique se a autenticação por email/senha está ativada no console do Firebase");
    }
    
    throw error;
  }
};

/**
 * Login com email e senha
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login bem-sucedido:", userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error("Erro ao fazer login com email:", error);
    
    // Mensagens de erro mais detalhadas para debugging
    if (error.code === "auth/configuration-not-found") {
      console.error("Erro de configuração do Firebase: Verifique se a autenticação por email/senha está ativada no console do Firebase");
    }
    
    throw error;
  }
};

/**
 * Login com Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Login com Google bem-sucedido:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    throw error;
  }
};

/**
 * Atualizar perfil do usuário
 */
export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || null
      });
      console.log("Perfil atualizado com sucesso");
    } else {
      throw new Error("Nenhum usuário logado para atualizar o perfil");
    }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

/**
 * Fazer logout
 */
export const logout = async () => {
  try {
    await auth.signOut();
    console.log("Logout realizado com sucesso");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};
