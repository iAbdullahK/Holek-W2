"use client";

import React from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase';

const DescriptionUpdater = ({ storeId, description }) => {
    const updateDescription = async (newDescription) => {
      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          description: newDescription,
        });
      } else {
        await setDoc(docRef, {
          description: newDescription,
        }, { merge: true }); // merge: true ensures we don't overwrite other fields
      }
    };

    updateDescription(description).then(() => {
      console.log('Description updated successfully');
    }).catch((error) => {
      console.error('Error updating description: ', error);
    });

  return null; // This component doesn't render anything visible
};

export default DescriptionUpdater;
