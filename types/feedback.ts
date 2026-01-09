export interface IFeedback {
  _id: string;
  encryptedEmployeeId: string;
  category: string;
  isFlagged: boolean;
  wasDecrypted: boolean;
  decryptionReason: string;
  decryptedBy: {
    _id: string;
    email: string;
  };
  approvedBy: string;
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  deletedAt: Date;
  deletedBy: {
    _id: string;
    email: string;
  };
}

export interface CreateFeedbackBody {
  sender: string;
  category: string;
  title: string;
  content: string;
  isAnonymous?: boolean;
}

export interface UpdateFeedbackBody extends Partial<CreateFeedbackBody> {}
