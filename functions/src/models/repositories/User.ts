import { DocumentReference } from "firebase-admin/firestore"
import { ApiError } from "../../middlewares/ErrorHandler"
import { User, Wealth } from "../../types/Database"
import { HttpResponse } from "../../types/General"
import { idsToRef, refsToData } from "../../utils/FirestoreData"

const collectionName = "users"
export const getWealth = async (
  userId: string
) => {
  const userRef = await idsToRef(userId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const user = await refsToData(userRef) as unknown as User
  return {
    id: user.id,
    wealth: user.wealth
  }
}

export const updateWealth = async (wealthUpdates: Partial<Wealth>, userId: string) => {
  const userRef = await idsToRef(userId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const user = await refsToData(userRef) as unknown as User;
  const newData: any = {...user.wealth};

  for (let [key, value] of Object.entries(wealthUpdates)) {
    newData[key] = value;
  }

  await userRef.update({ wealth: newData });
  const updatedUser = await refsToData(userRef) as unknown as User;

  if (!updatedUser) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Wealth could not be updated.")
  }

  return {
    id: userRef.id,
    wealth: updatedUser.wealth
  }
}