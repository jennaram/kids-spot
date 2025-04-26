export interface Comment {
    id: number;
    commentaire: string;
    note: number;
    date: {
      ajout: string;
      modification: string;
    };
    user: {
      id: number;
      pseudo: string;
    };
    lieu: {
      id: number;
      nom: string;
    };
  }
  
  export interface CommentsResponse {
    status: string;
    data: {
      moyenne_notes: string;
      commentaires: Comment[];
    };
  }