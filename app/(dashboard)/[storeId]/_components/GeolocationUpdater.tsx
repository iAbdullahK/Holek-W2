"use client"

import React, { useEffect } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';

interface GeolocationUpdaterProps {
  storeId: string;
}

const GeolocationUpdater = ({ storeId }: GeolocationUpdaterProps) => {
  useEffect(() => {
    const updateLocation = async (lat: number, lng: number) => {
      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          lat,
          lng,
          locationUpdatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          lat,
          lng,
          locationUpdatedAt: serverTimestamp(),
        }, { merge: true }); // merge: true ensures we don't overwrite other fields
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(`Latitude: ${lat}, longitude: ${lng}`);

          updateLocation(lat, lng).then(() => {
            console.log('Location updated successfully');
          }).catch((error) => {
            console.error('Error updating location: ', error);
          });
        },
        (error) => {
          console.log("User refused giving location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [storeId]);

  return null; // This component doesn't render anything visible
};

export default GeolocationUpdater;
