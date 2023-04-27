
import { db } from "../firebase"
import { DocumentReference } from 'firebase-admin/firestore';
import { Dictionary, HttpResponse } from '../types/General';
import { ApiError } from '../middlewares/ErrorHandler';

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

export const idsToRef = async (input: string | string[], collectionName: string): Promise<DocumentReference | DocumentReference[]> => {
  if (typeof input === "string") {
    const doc = db.collection(collectionName).doc(input)
    if (!(await doc.get()).exists) {
      throw new ApiError(HttpResponse.NOT_FOUND, `Item with id ${input} doesn't exist!`)
    }
    return doc as DocumentReference;
  }

  return Promise.all(input.map((id: string) => { return idsToRef(id, collectionName) as Promise<DocumentReference> }))
}
