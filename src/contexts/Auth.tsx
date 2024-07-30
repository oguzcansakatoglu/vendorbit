import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const Auth: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '658919642567-n20gf24tj46ka866pi6f9kbvapqrktc3.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.updateProfile({displayName: name});
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('That email address is invalid!');
      }
      throw error;
    }
  };

  const anonymousSignIn = async () => {
    try {
      await auth().signInAnonymously();
    } catch (error) {
      console.error(error);
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken, user} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      console.log({idToken, user});
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const appleSignIn = async () => {
    try {
      console.log('Apple Sign-In: Starting');

      // Check if Apple Authentication is supported
      const isSupported = await appleAuth.isSupported;
      if (!isSupported) {
        console.log('Apple Authentication is not supported on this device');
        return null;
      }

      console.log('Apple Sign-In: Performing auth request');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      console.log('Apple Sign-In: Auth request completed');
      console.log(
        'Apple Auth Response:',
        JSON.stringify(appleAuthRequestResponse, null, 2),
      );

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      console.log('Apple Sign-In: Identity token received');

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      console.log('Creating Firebase credential');
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      console.log('Firebase credential created');

      // Sign the user in with the credential
      console.log('Signing in with Firebase');
      const userCredential = await auth().signInWithCredential(appleCredential);
      console.log('Firebase sign-in successful');
      console.log('User:', JSON.stringify(userCredential.user, null, 2));

      return userCredential;
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      if (error.code) {
        console.error('Error code:', error.code);
      }
      return null;
    } finally {
      console.log('Apple Sign-In: Process completed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        googleSignIn,
        anonymousSignIn,
        appleSignIn,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
