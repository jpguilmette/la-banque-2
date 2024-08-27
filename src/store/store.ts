import {
    DocumentData,
    QueryDocumentSnapshot,
    QuerySnapshot,
    addDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firestore } from '../firebaseConfig';
import { User } from '../models/User';
import { LaBanqueError } from '../models/LaBanqueError';

export const useLaBanqueStore = defineStore('labanque', () => {
    const users = ref<User[]>([]);
    const usersCharging = ref(false);
    const usersLoaded = ref(false);

    const getUsers = async () => {
        try {
            usersCharging.value = true;

            users.value = [];
            const querySnapshot: QuerySnapshot = await getDocs(
                collection(firestore, 'users')
            );
            querySnapshot.docs.forEach(
                (doc: QueryDocumentSnapshot<DocumentData>) => {
                    users.value.push(doc.data() as User);
                }
            );

            usersLoaded.value = true;
        } catch (e) {
            if (e instanceof Error) {
                throw new LaBanqueError(e, 'get-users');
            }
        } finally {
            usersCharging.value = false;
        }
    };

    const getUser = async (uid: string) => {
        try {
            const querySnapshot: QuerySnapshot = await getDocs(
                query(collection(firestore, 'users'), where('uid', '==', uid))
            );
            return querySnapshot.docs[0]?.data() as User;
        } catch (e) {
            if (e instanceof Error) {
                throw new LaBanqueError(e, 'get-user');
            }
        }
    };

    const addUser = async (user: User) => {
        try {
            await addDoc(collection(firestore, 'users'), {
                ...user,
                dateCreated: new Date().toISOString(),
            });
            getUsers();
        } catch (e) {
            if (e instanceof Error) {
                throw new LaBanqueError(e, 'add-user');
            }
        }
    };

    const updateUser = async (user: User) => {
        try {
            const querySnapshot: QuerySnapshot = await getDocs(
                query(
                    collection(firestore, 'users'),
                    where('uid', '==', user.uid)
                )
            );
            const userRef = querySnapshot.docs[0].ref;

            if (!userRef) {
                throw new Error('Item not found');
            }

            const cleanedUser = Object.fromEntries(
                Object.entries(user).filter(([_, value]) => value !== undefined)
            );

            await updateDoc(userRef, cleanedUser);

            getUsers();
        } catch (e) {
            if (e instanceof Error) {
                throw new LaBanqueError(e, 'update-user');
            }
        }
    };

    const desactivateUser = async (uid: string, locked: boolean) => {
        try {
            const querySnapshot: QuerySnapshot = await getDocs(
                query(collection(firestore, 'users'), where('uid', '==', uid))
            );
            const userRef = querySnapshot.docs[0].ref;

            if (!userRef) {
                throw new Error('Item not found');
            }

            await updateDoc(userRef, { locked });

            getUsers();
        } catch (e) {
            if (e instanceof Error) {
                throw new LaBanqueError(e, 'desactivate-user');
            }
        }
    };

    return {
        users,
        usersCharging,
        usersLoaded,
        getUsers,
        getUser,
        addUser,
        updateUser,
        desactivateUser,
    };
});
