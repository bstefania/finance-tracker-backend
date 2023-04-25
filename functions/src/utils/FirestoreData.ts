
import { db } from "../firebase"
import { DocumentReference } from 'firebase-admin/firestore';
import { CategoryGroup } from '../types/General';

export const refsToData = async (input: DocumentReference | DocumentReference[]):
  Promise<CategoryGroup | CategoryGroup[] | undefined> => {
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
    return initialData as CategoryGroup;
  }

  return Promise.all(input.map(async (ref: DocumentReference) => {
    return refsToData(ref)
  })) as Promise<CategoryGroup[]>
}

export const idsToRef = (input: string | string[], collectionName: string) => {
  if (typeof input === "string") {
    return db.collection(collectionName).doc(input)
  }
  return input.map((id) =>
    db.collection(collectionName).doc(id)
  )
}
