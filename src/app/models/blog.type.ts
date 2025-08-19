export type Blog ={
    id: number;
    title: string;
    date: string;
    authorId: number | null;
    content: string;
}

export type CreateBlog = Omit<Blog, 'id'>;
export type UpdateBlog = Omit<Blog, 'id'>;