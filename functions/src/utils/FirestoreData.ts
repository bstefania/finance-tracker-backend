
import { db } from "../firebase"
import { CollectionReference, DocumentData, DocumentReference, Query, QuerySnapshot } from 'firebase-admin/firestore';
import { Dictionary, DocumentDetails, HttpResponse } from '../types/General';
import { ApiError } from '../middlewares/ErrorHandler';
import { getResponseCollectionName } from "./ResponseGenerator";

const ownerField = "owner"
const groupField = "sharedWith"

export const refsToData = async (input: DocumentReference | DocumentReference[], collectionName: string)
  : Promise<Dictionary | Dictionary[] | undefined> => {
  if (input instanceof DocumentReference) {
    const doc = await input.get()
    if (!doc.exists) {
      throw new ApiError(HttpResponse.NOT_FOUND, `${getResponseCollectionName(collectionName)} not found!`)
    }

    const initialData: any = {
      id: input.id,
      ...doc.data(),
    };

    for (const [key, value] of Object.entries(initialData)) {
      if (value instanceof DocumentReference || value instanceof Array) {
        initialData[key] = await refsToData(value, collectionName);
      }
    }
    return initialData;
  }

  return Promise.all(input.map(async (ref: DocumentReference) => {
    return refsToData(ref, collectionName)
  })) as Promise<Dictionary[]>
}

export const idsToRef = async (input: string | string[], collectionName: string)
  : Promise<DocumentReference | DocumentReference[]> => {
  if (typeof input === "string") {
    const doc = db.collection(collectionName).doc(input)
    if (!(await doc.get()).exists) {
      throw new ApiError(HttpResponse.NOT_FOUND, `${getResponseCollectionName(collectionName)} not found!`)
    }
    return doc as DocumentReference;
  }

  return Promise.all(input.map((id: string) => { return idsToRef(id, collectionName) as Promise<DocumentReference> }))
}

export const idsToData = async (input: string | string[], collectionName: string) => {
 // TODO 
}

export const checkAccess = async (data: DocumentData | undefined, userId: string, collectionName: string) => {
  if (!data || (data && data.owner.id !== userId && !data.sharedWith?.contains(userId))) {
    throw new ApiError(HttpResponse.NOT_FOUND, `${getResponseCollectionName(collectionName)} not found.`);
  }
}

export const checkIfDataAlreadyExists = async (
  details: DocumentDetails, userRef: DocumentReference, collection: CollectionReference, collectionName: string) => {
  let mainQuery: Query = collection

  for (let [key, value] of Object.entries(details)) {
    mainQuery = mainQuery.where(
      key, '==', value
    )
  }
  if (!(await mainQuery.where(ownerField, '==', userRef).get()).empty
    || !(await mainQuery.where(groupField, 'array-contains', userRef).get()).empty) {
    throw new ApiError(HttpResponse.CONFLICT, `${getResponseCollectionName(collectionName)} with the same name already exists.`);
  }
}

export const querySnapshotToRef = (querySnapshot: QuerySnapshot) => {
  return querySnapshot.docs.map(doc => doc.ref)
}