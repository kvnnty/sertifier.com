// mockRecipientData.ts
export const mockRecipientData = {
  message: null,
  hasError: false,
  validationErrors: [],
  showPurchaseSheet: false,
  isUpgraded: false,
  upgradePlan: null,
  data: {
    items: [
      {
        id: "1",
        listName: "Marketing List 1",
        recipients: 50,
        sentCredentials: 30,
        createDate: "2025-06-26T12:00:00Z",
        createdBy: "John Doe",
      },
      {
        id: "2",
        listName: "Sales List 2",
        recipients: 25,
        sentCredentials: 15,
        createDate: "2025-06-25T09:15:00Z",
        createdBy: "Jane Smith",
      },
    ],
    count: 2,
  },
  content: null,
};

export const mockRecipientItemsData = {
  message: null,
  hasError: false,
  validationErrors: [],
  showPurchaseSheet: false,
  isUpgraded: false,
  upgradePlan: null,
  data: {
    items: [
      {
        id: "1",
        fullName: "Alice Johnson",
        email: "alice@example.com",
        createDate: "2025-06-26T10:00:00Z",
      },
      {
        id: "2",
        fullName: "Bob Williams",
        email: "bob@example.com",
        createDate: "2025-06-25T14:30:00Z",
      },
      {
        id: "3",
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        createDate: "2025-06-24T08:45:00Z",
      },
    ],
    count: 3,
  },
  content: null,
};