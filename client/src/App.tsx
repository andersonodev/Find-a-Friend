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
      <Route path="/" component={() => <Home user={user} />} />
      <Route path="/search" component={Search} />
      <Route path="/amigos/:id" component={FriendDetail} />
      <Route path="/booking/:id" component={() => <Booking user={user} />} />
      <Route path="/checkout/:id" component={() => <Checkout user={user} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={() => <Profile user={user} />} />
      <Route path="/bookings" component={() => <Bookings user={user} />} />
      <Route path="/favorites" component={() => <Favorites user={user} />} />
      <Route path="/how-it-works" component={() => <HowItWorks user={user} />} />
      <Route path="/become-amigo" component={() => <BecomeAmigo user={user} />} />
      <Route path="/help" component={() => <Help user={user} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
