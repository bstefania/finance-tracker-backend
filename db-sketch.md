User(id: string, wealth: {wallet: number, saving: number, investment: number})
CategoryGroup(id: string, name: string, owner: User(foreign key), sharedWith: User[](foreign key list))
Category(id: string, name: string, categoryGroup: CategoryGroup(foreign key), owner: User(foreign key), sharedWith: User[](foreign key list))
Transaction(id: string, category: Category(foreign key), type: string, amount: number, createdAt: Date, note: string, owner: User(foreign key), sharedWith: User[](foreign key list))

RecurrentTransaction(id: string, category: Category(foreign key), type: string, frequency: string, startDate: Date, endDate: Date, payDay: number, payMonth: number, owner: User(foreign key), sharedWith: User[](foreign key list))
Plan(id: string, type: string, category: Category(foreign key), frequency: string, startDate: Date, endDate: Date, amount: number, owner: User(foreign key), sharedWith: User[](foreign key list))