
import { db } from "../firebase"
import { CollectionReference, DocumentData, DocumentReference, Query, QuerySnapshot } from 'firebase-admin/firestore';
import { Dictionary, DocumentDetails, HttpResponse } from '../types/General';
import { ApiError } from '../middlewares/ErrorHandler';

const ownerField = "owner"
const groupField = "sharedWith"

export const refsToData = async (input: DocumentReference | DocumentReference[])
  : Promise<Dictionary | Dictionary[] | undefined> => {
  if (input instanceof DocumentReference) {
    const doc = await input.get()
    if (!doc.exists) return

    const initialData: any = {
      id: input.id,
      ...doc.data(),
    };

    for (const [key, value] of Object.entries(initialData)) {
      if (value instanceof DocumentReference || value instanceof Array<DocumentReference>) {
        initialData[key] = await refsToData(value);
      }
    }
    return initialData;
  }

  return Promise.all(input.map(async (ref: DocumentReference) => {
    return refsToData(ref)
  })) as Promise<Dictionary[]>
}

export const idsToRef = async (input: string | string[], collectionName: string)
  : Promise<DocumentReference | DocumentReference[]> => {
  if (typeof input === "string") {
    const doc = db.collection(collectionName).doc(input)
    if (!(await doc.get()).exists) {
      throw new ApiError(HttpResponse.NOT_FOUND, `Item with id ${input} doesn't exist!`)
    }
    return doc as DocumentReference;
  }

  return Promise.all(input.map((id: string) => { return idsToRef(id, collectionName) as Promise<DocumentReference> }))
}

export const checkAccess = async (data: DocumentData | undefined, userId: string) => {
  if (!data || (data.owner.id !== userId && !data.sharedWith.contains(userId))) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Item not found.");
  }
}

export const checkIfDataAlreadyExists = async (
  details: DocumentDetails, userRef: DocumentReference, collection: CollectionReference) => {
  let mainQuery: Query = collection

  for (let [key, value] of Object.entries(details)) {
    mainQuery = mainQuery.where(
      key, '==', value
    )
  }
  if (!(await mainQuery.where(ownerField, '==', userRef).get()).empty
    || !(await mainQuery.where(groupField, 'array-contains', userRef).get()).empty) {
    throw new ApiError(HttpResponse.BAD_REQUEST, "Item with the same name already exists.");
  }
}

export const querySnapshotToRef = (querySnapshot: QuerySnapshot) => {
  return querySnapshot.docs.map(doc => doc.ref)
}