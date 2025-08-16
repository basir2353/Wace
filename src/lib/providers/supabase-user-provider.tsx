"use client";

import { Subscription } from "../supabase/supabase.types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserSubscriptionStatus } from "../supabase/queries";
import { useToast } from "@/components/ui/use-toast";
// import { createClient} from '../supabase/server';
import { createBrowserBasedClient } from "../supabase/client";
import { pool } from "@/utils/postgres";
import { DatabaseUser } from "@/types/types";
import { actiongetUser } from "../server-actions/auth-actions";

type SupabaseUserContextType = {
  user: DatabaseUser | null;
  setUser: Dispatch<SetStateAction<DatabaseUser | null>>;
  subscription: Subscription | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  setUser: () => null,
  subscription: null,
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  const supabase = createBrowserBasedClient();

  //Fetch the user details
  //subscrip

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          const userData: { data: DatabaseUser | null; message: string,success:boolean }   = await actiongetUser({userID:user.id})
          console.log(userData);
          setUser(userData.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }

        const { data, error } = await getUserSubscriptionStatus(user.id);
        if (error) {
          toast({
            title: "Unexpected Error",
            description:
              "Oppse! An unexpected error happened. Try again later.",
          });
          setLoading(false);

          return;
        }

        if (data) {
          setSubscription(data);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, [supabase, toast]);
  
  return (
    !loading && (
      <SupabaseUserContext.Provider value={{ user, setUser, subscription }}>
        {children}
      </SupabaseUserContext.Provider>
    )
  );
};
