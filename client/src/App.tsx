import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import FriendDetail from "@/pages/FriendDetail";
import Booking from "@/pages/Booking";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import HowItWorks from "@/pages/HowItWorks";
import BecomeAmigo from "@/pages/BecomeAmigo";
import Help from "@/pages/Help";
import Favorites from "@/pages/Favorites";
import Bookings from "@/pages/Bookings";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SecurityShield from "@/components/security/SecurityShield";
import DynamicWatermark from "@/components/security/DynamicWatermark";

function Router() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          name: authUser.displayName,
          avatar: authUser.photoURL,
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {() => <Home user={user} />}
      </Route>
      <Route path="/search" component={Search} />
      <Route path="/amigos/:id" component={FriendDetail} />
      <Route path="/booking/:id">
        {() => <Booking user={user} />}
      </Route>
      <Route path="/checkout/:id">
        {() => <Checkout user={user} />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile">
        {() => <Profile user={user} />}
      </Route>
      <Route path="/bookings">
        {() => <Bookings user={user} />}
      </Route>
      <Route path="/favorites">
        {() => <Favorites user={user} />}
      </Route>
      <Route path="/how-it-works">
        {() => <HowItWorks user={user} />}
      </Route>
      <Route path="/become-amigo">
        {() => <BecomeAmigo user={user} />}
      </Route>
      <Route path="/help">
        {() => <Help user={user} />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  const [securityEnabled, setSecurityEnabled] = useState(false);
  
  useEffect(() => {
    // Ativar medidas de segurança apenas em ambiente de produção
    // ou quando explicitamente solicitado via localStorage
    const isProd = import.meta.env.PROD;
    const forceSecurity = localStorage.getItem('forceSecurity') === 'true';
    
    if (isProd || forceSecurity) {
      setSecurityEnabled(true);
      console.log("Medidas de segurança ativadas");
    } else {
      console.log("Medidas de segurança não ativadas em ambiente de desenvolvimento");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      {securityEnabled && (
        <>
          <SecurityShield />
          <DynamicWatermark />
        </>
      )}
    </QueryClientProvider>
  );
}

export default App;
